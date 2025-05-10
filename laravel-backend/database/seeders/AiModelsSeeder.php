<?php

namespace Database\Seeders;

use App\Models\AiModel;
use Illuminate\Database\Seeder;

class AiModelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a default model
        AiModel::factory()->default()->create([
            'name' => 'GPT-4o',
            'description' => 'Latest OpenAI model with advanced reasoning capabilities',
            'type' => 'openai',
            'api_key' => 'default-key',
            'base_prompt' => 'You are a helpful AI assistant.',
            'is_active' => true,
            'is_default' => true,
        ]);

        // Create additional models
        AiModel::factory()->create([
            'name' => 'Gemini Pro',
            'description' => 'Google\'s advanced large language model',
            'type' => 'gemini',
            'api_key' => 'gemini-key',
        ]);

        AiModel::factory()->create([
            'name' => 'Mistral 7B',
            'description' => 'Efficient and powerful open-source LLM',
            'type' => 'huggingface',
            'api_key' => 'mistral-key',
        ]);

        // Additional random models
        AiModel::factory(3)->create();
    }
}
