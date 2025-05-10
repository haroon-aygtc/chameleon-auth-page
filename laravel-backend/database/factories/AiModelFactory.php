<?php

namespace Database\Factories;

use App\Models\AiModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AiModel>
 */
class AiModelFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AiModel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['openai', 'gemini', 'huggingface', 'custom'];

        return [
            'name' => $this->faker->unique()->catchPhrase(),
            'description' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement($types),
            'api_key' => $this->faker->uuid(),
            'base_prompt' => $this->faker->sentence(),
            'is_active' => $this->faker->boolean(80),
            'is_default' => false,
            'configuration' => [
                'max_tokens' => $this->faker->numberBetween(100, 4000),
                'temperature' => $this->faker->randomFloat(1, 0, 1)
            ],
            'created_by' => null,
        ];
    }

    /**
     * Indicate that the model is default.
     */
    public function default(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }
}
