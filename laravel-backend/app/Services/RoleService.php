<?php

namespace App\Services;

use App\Models\Role;

class RoleService
{
    /**
     * Create a new role.
     */
    public function create(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        if (isset($data['permissions'])) {
            $role->permissions()->sync($data['permissions']);
        }

        return $role;
    }

    /**
     * Update an existing role.
     */
    public function update(Role $role, array $data): Role
    {
        if (isset($data['name'])) {
            $role->name = $data['name'];
        }

        if (isset($data['description'])) {
            $role->description = $data['description'];
        }

        $role->save();

        if (isset($data['permissions'])) {
            $role->permissions()->sync($data['permissions']);
        }

        return $role;
    }

    /**
     * Delete a role.
     */
    public function delete(Role $role): bool
    {
        return $role->delete();
    }

    /**
     * Assign permissions to a role.
     */
    public function assignPermissions(Role $role, array $permissionIds): Role
    {
        $role->permissions()->sync($permissionIds);
        return $role;
    }
}
