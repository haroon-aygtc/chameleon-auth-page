
<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Services\RoleService;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    protected $roleService;

    /**
     * Create a new controller instance.
     */
    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of the roles.
     */
    public function index(): AnonymousResourceCollection
    {
        $roles = Role::with(['permissions', 'users'])->get();
        return RoleResource::collection($roles);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(StoreRoleRequest $request): RoleResource
    {
        $role = $this->roleService->create($request->validated());
        return new RoleResource($role->load(['permissions', 'users']));
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role): RoleResource
    {
        return new RoleResource($role->load(['permissions', 'users']));
    }

    /**
     * Update the specified role in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role): RoleResource
    {
        $role = $this->roleService->update($role, $request->validated());
        return new RoleResource($role->load(['permissions', 'users']));
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): JsonResponse
    {
        $this->roleService->delete($role);
        return response()->json(['message' => 'Role deleted successfully']);
    }

    /**
     * Assign permissions to a role.
     */
    public function assignPermissions(Request $request, Role $role): RoleResource
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = $this->roleService->assignPermissions($role, $request->permissions);
        return new RoleResource($role->load(['permissions', 'users']));
    }

    /**
     * Get users assigned to a role.
     */
    public function getRoleUsers(Role $role): AnonymousResourceCollection
    {
        $users = $role->users;
        return UserResource::collection($users);
    }
}
