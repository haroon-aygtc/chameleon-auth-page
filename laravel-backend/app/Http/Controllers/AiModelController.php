
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAiModelRequest;
use App\Http\Requests\UpdateAiModelRequest;
use App\Http\Resources\AiModelResource;
use App\Models\AiModel;
use App\Services\AiModelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AiModelController extends Controller
{
    protected $aiModelService;

    public function __construct(AiModelService $aiModelService)
    {
        $this->aiModelService = $aiModelService;
    }

    /**
     * Display a listing of the AI models.
     */
    public function index(): AnonymousResourceCollection
    {
        $models = $this->aiModelService->getAllModels();
        return AiModelResource::collection($models);
    }

    /**
     * Store a newly created AI model in storage.
     */
    public function store(StoreAiModelRequest $request): JsonResponse
    {
        $model = $this->aiModelService->createModel($request->validated());
        return response()->json([
            'message' => 'AI model created successfully',
            'data' => new AiModelResource($model)
        ], 201);
    }

    /**
     * Display the specified AI model.
     */
    public function show(string $id): JsonResponse
    {
        $model = $this->aiModelService->findModelById($id);
        return response()->json([
            'data' => new AiModelResource($model)
        ]);
    }

    /**
     * Update the specified AI model in storage.
     */
    public function update(UpdateAiModelRequest $request, string $id): JsonResponse
    {
        $model = $this->aiModelService->updateModel($id, $request->validated());
        return response()->json([
            'message' => 'AI model updated successfully',
            'data' => new AiModelResource($model)
        ]);
    }

    /**
     * Remove the specified AI model from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $this->aiModelService->deleteModel($id);
        return response()->json([
            'message' => 'AI model deleted successfully'
        ]);
    }

    /**
     * Toggle the active status of the specified AI model.
     */
    public function toggleActive(string $id): JsonResponse
    {
        $model = $this->aiModelService->toggleActiveStatus($id);
        return response()->json([
            'message' => $model->is_active 
                ? 'AI model activated successfully' 
                : 'AI model deactivated successfully',
            'data' => new AiModelResource($model)
        ]);
    }

    /**
     * Set the specified AI model as the default model.
     */
    public function setDefault(string $id): JsonResponse
    {
        $model = $this->aiModelService->setAsDefault($id);
        return response()->json([
            'message' => 'AI model set as default successfully',
            'data' => new AiModelResource($model)
        ]);
    }

    /**
     * Test the specified AI model with the given input.
     */
    public function testModel(string $id, Request $request): JsonResponse
    {
        $result = $this->aiModelService->testModel($id, 
            $request->input('message'), 
            $request->input('style', 'friendly')
        );
        
        return response()->json([
            'message' => 'Model tested successfully',
            'data' => $result
        ]);
    }
}
