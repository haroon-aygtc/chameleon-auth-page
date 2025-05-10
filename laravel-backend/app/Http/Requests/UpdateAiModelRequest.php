
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAiModelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Can be restricted based on permissions if needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['string', 'max:255'],
            'description' => ['string'],
            'type' => ['string', Rule::in(['openai', 'gemini', 'huggingface', 'custom'])],
            'api_key' => ['string'],
            'base_prompt' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'is_default' => ['boolean'],
            'configuration' => ['nullable', 'array'],
        ];
    }
}
