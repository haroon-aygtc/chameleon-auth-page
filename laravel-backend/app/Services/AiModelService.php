
<?php

namespace App\Services;

use App\Models\AiModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
            // Here you would integrate with the actual AI provider APIs
            // For now, we'll simulate a response
            $response = $this->simulateAiResponse($model, $message, $style);
            
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
                'error' => $e->getMessage()
            ]);
            
            throw new \Exception('Failed to test AI model: ' . $e->getMessage());
        }
    }

    /**
     * Simulate an AI response for testing purposes.
     * In a production environment, this would call the actual AI provider API.
     */
    private function simulateAiResponse(AiModel $model, string $message, string $style): string
    {
        $responses = [
            'friendly' => "Hi there! Thanks for your message: \"{$message}\". I'm happy to help with anything you need!",
            'technical' => "Technical response to: \"{$message}\". Analysis indicates multiple approaches could be considered.",
            'concise' => "Re: \"{$message}\". Understood. Will process.",
            'detailed' => "Regarding your message: \"{$message}\". I'd like to provide a comprehensive response that addresses all aspects of your query. First, let's analyze what you're asking for..."
        ];
        
        // Add a short delay to simulate API call
        usleep(500000); // 0.5 seconds
        
        return $responses[$style] ?? $responses['friendly'];
    }
}
