
<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Services\PermissionService;
use App\Http\Resources\PermissionResource;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    protected $permissionService;

    /**
     * Create a new controller instance.
     */
    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Display a listing of the permissions.
     */
    public function index(): AnonymousResourceCollection
    {
        $permissions = Permission::all();
        return PermissionResource::collection($permissions);
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(StorePermissionRequest $request): PermissionResource
    {
        $permission = $this->permissionService->create($request->validated());
        return new PermissionResource($permission);
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission): PermissionResource
    {
        return new PermissionResource($permission);
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission): PermissionResource
    {
        $permission = $this->permissionService->update($permission, $request->validated());
        return new PermissionResource($permission);
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy(Permission $permission): JsonResponse
    {
        $this->permissionService->delete($permission);
        return response()->json(['message' => 'Permission deleted successfully']);
    }
    
    /**
     * Get permissions by category.
     */
    public function getByCategory($category): AnonymousResourceCollection
    {
        $permissions = Permission::where('category', $category)->get();
        return PermissionResource::collection($permissions);
    }
}
