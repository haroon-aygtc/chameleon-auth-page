<?php

namespace App\Services;

use App\Models\AiModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class AiModelService
{
    /**
     * Get all AI models.
     */
    public function getAllModels(): Collection
    {
        return AiModel::orderBy('created_at', 'desc')->get();
    }

    /**
     * Find an AI model by ID.
     */
    public function findModelById(string $id): AiModel
    {
        return AiModel::findOrFail($id);
    }

    /**
     * Create a new AI model.
     */
    public function createModel(array $data): AiModel
    {
        // Add the authenticated user as creator if available
        if (Auth::check()) {
            $data['created_by'] = Auth::id();
        }

        // If this model is set as default, unset all other defaults
        if (isset($data['is_default']) && $data['is_default']) {
            $this->unsetAllDefaults();
        }

        return AiModel::create($data);
    }

    /**
     * Update an existing AI model.
     */
    public function updateModel(string $id, array $data): AiModel
    {
        $model = $this->findModelById($id);

        // If this model is being set as default, unset all other defaults
        if (isset($data['is_default']) && $data['is_default'] && !$model->is_default) {
            $this->unsetAllDefaults();
        }

        $model->update($data);
        return $model;
    }

    /**
     * Delete an AI model.
     */
    public function deleteModel(string $id): bool
    {
        $model = $this->findModelById($id);

        // If this is the default model, prevent deletion
        if ($model->is_default) {
            throw new \Exception('Cannot delete the default AI model.');
        }

        return $model->delete();
    }

    /**
     * Toggle the active status of an AI model.
     */
    public function toggleActiveStatus(string $id): AiModel
    {
        $model = $this->findModelById($id);

        // If this is the default model and it's active, prevent deactivation
        if ($model->is_default && $model->is_active) {
            throw new \Exception('Cannot deactivate the default AI model.');
        }

        $model->update(['is_active' => !$model->is_active]);
        return $model;
    }

    /**
     * Set an AI model as the default.
     */
    public function setAsDefault(string $id): AiModel
    {
        DB::transaction(function () use ($id) {
            // Unset all defaults
            $this->unsetAllDefaults();

            // Set the new default
            $model = $this->findModelById($id);
            $model->update([
                'is_default' => true,
                'is_active' => true, // Default models should always be active
            ]);

            return $model;
        });

        return $this->findModelById($id);
    }

    /**
     * Unset all default AI models.
     */
    protected function unsetAllDefaults(): void
    {
        AiModel::where('is_default', true)
            ->update(['is_default' => false]);
    }

    /**
     * Test an AI model with a message.
     */
    public function testModel(string $id, string $message, string $style = 'friendly'): array
    {
        $model = $this->findModelById($id);

        // Ensure the model is active
        if (!$model->is_active) {
            throw new \Exception('Cannot test an inactive AI model.');
        }

        try {
            // Call the appropriate AI provider based on the model type
            $response = $this->callAiProvider($model, $message, $style);

            return [
                'model' => $model->name,
                'message' => $message,
                'response' => $response,
                'style' => $style,
                'timestamp' => now()->toIso8601String()
            ];
        } catch (\Exception $e) {
            Log::error('AI model test failed', [
                'model_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new \Exception('Failed to test AI model: ' . $e->getMessage());
        }
    }

    /**
     * Call the appropriate AI provider based on the model type.
     */
    protected function callAiProvider(AiModel $model, string $message, string $style): string
    {
        // Prepare the system message based on style
        $systemMessage = $this->getSystemMessageForStyle($model->base_prompt, $style);

        // Call the appropriate API based on model type
        switch ($model->type) {
            case 'openai':
                return $this->callOpenAI($model, $systemMessage, $message);
            case 'gemini':
                return $this->callGemini($model, $systemMessage, $message);
            case 'huggingface':
                return $this->callHuggingFace($model, $systemMessage, $message);
            case 'custom':
                return $this->callCustomApi($model, $systemMessage, $message);
            default:
                throw new \Exception("Unsupported AI model type: {$model->type}");
        }
    }

    /**
     * Get the system message based on the conversation style.
     */
    protected function getSystemMessageForStyle(string $basePrompt, string $style): string
    {
        $styleInstructions = [
            'friendly' => 'Be warm, approachable and conversational in your responses.',
            'technical' => 'Be technical, precise and use technical terminology where appropriate.',
            'concise' => 'Be extremely brief and to the point, using as few words as possible.',
            'detailed' => 'Be thorough and provide comprehensive explanations with examples where helpful.'
        ];

        $styleInstruction = $styleInstructions[$style] ?? $styleInstructions['friendly'];

        return trim($basePrompt . "\n\n" . $styleInstruction);
    }

    /**
     * Call the OpenAI API.
     */
    protected function callOpenAI(AiModel $model, string $systemMessage, string $userMessage): string
    {
        $apiKey = $model->api_key;
        $config = $model->configuration;

        $temperature = $config['temperature'] ?? 0.7;
        $maxTokens = $config['maxTokens'] ?? 1000;

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => $config['model'] ?? 'gpt-4o',
            'messages' => [
                ['role' => 'system', 'content' => $systemMessage],
                ['role' => 'user', 'content' => $userMessage]
            ],
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
        ]);

        if ($response->failed()) {
            throw new \Exception("OpenAI API error: " . $response->body());
        }

        $responseData = $response->json();
        return $responseData['choices'][0]['message']['content'] ?? '';
    }

    /**
     * Call the Google Gemini API.
     */
    protected function callGemini(AiModel $model, string $systemMessage, string $userMessage): string
    {
        $apiKey = $model->api_key;
        $config = $model->configuration;

        $temperature = $config['temperature'] ?? 0.7;
        $maxTokens = $config['maxTokens'] ?? 1000;
        $topP = $config['topP'] ?? 0.95;

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={$apiKey}", [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $systemMessage . "\n\nUser message: " . $userMessage]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => $temperature,
                'maxOutputTokens' => $maxTokens,
                'topP' => $topP,
            ],
        ]);

        if ($response->failed()) {
            throw new \Exception("Gemini API error: " . $response->body());
        }

        $responseData = $response->json();
        return $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';
    }

    /**
     * Call the Hugging Face API.
     */
    protected function callHuggingFace(AiModel $model, string $systemMessage, string $userMessage): string
    {
        $apiKey = $model->api_key;
        $config = $model->configuration;

        // Get the model ID from configuration or use a default
        $modelId = $config['model_id'] ?? 'meta-llama/Llama-3-8b-chat-hf';

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
        ])->post("https://api-inference.huggingface.co/models/{$modelId}", [
            'inputs' => "<|system|>\n{$systemMessage}\n<|user|>\n{$userMessage}\n<|assistant|>",
            'parameters' => [
                'temperature' => $config['temperature'] ?? 0.7,
                'max_new_tokens' => $config['maxTokens'] ?? 1000,
                'return_full_text' => false,
            ]
        ]);

        if ($response->failed()) {
            throw new \Exception("HuggingFace API error: " . $response->body());
        }

        $responseData = $response->json();

        // Handle different response formats
        if (isset($responseData[0]['generated_text'])) {
            return $responseData[0]['generated_text'];
        }

        return $responseData[0] ?? '';
    }

    /**
     * Call a custom API endpoint.
     */
    protected function callCustomApi(AiModel $model, string $systemMessage, string $userMessage): string
    {
        $config = $model->configuration;

        if (empty($config['endpoint'])) {
            throw new \Exception("Custom API endpoint not configured");
        }

        $endpoint = $config['endpoint'];
        $method = strtoupper($config['method'] ?? 'POST');
        $headers = $config['headers'] ?? [];

        // Replace placeholders in the request body template
        $requestBody = $config['body_template'] ?? '{"system": "%system%", "user": "%user%"}';
        $requestBody = str_replace(
            ['%system%', '%user%'],
            [$systemMessage, $userMessage],
            $requestBody
        );

        // Convert string to JSON if needed
        $requestData = is_string($requestBody) && $this->isJson($requestBody)
            ? json_decode($requestBody, true)
            : $requestBody;

        // Make the request
        $http = Http::withHeaders($headers);

        if ($method === 'GET') {
            $response = $http->get($endpoint, is_array($requestData) ? $requestData : []);
        } else {
            $response = $http->$method($endpoint, $requestData);
        }

        if ($response->failed()) {
            throw new \Exception("Custom API error: " . $response->body());
        }

        // Extract response using the configured path
        $responsePath = $config['response_path'] ?? 'response';
        $responseData = $response->json();

        return $this->extractValueByPath($responseData, $responsePath);
    }

    /**
     * Extract a value from an array using dot notation path.
     */
    protected function extractValueByPath(array $data, string $path)
    {
        $keys = explode('.', $path);
        $value = $data;

        foreach ($keys as $key) {
            if (!isset($value[$key])) {
                return null;
            }
            $value = $value[$key];
        }

        return $value;
    }

    /**
     * Check if a string is valid JSON.
     */
    protected function isJson(string $string): bool
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
}
