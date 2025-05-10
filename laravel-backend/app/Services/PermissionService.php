<?php

namespace App\Services;

use App\Models\Permission;

class PermissionService
{
    /**
     * Create a new permission.
     */
    public function create(array $data): Permission
    {
        return Permission::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'category' => $data['category'],
        ]);
    }

    /**
     * Update an existing permission.
     */
    public function update(Permission $permission, array $data): Permission
    {
        if (isset($data['name'])) {
            $permission->name = $data['name'];
        }

        if (isset($data['description'])) {
            $permission->description = $data['description'];
        }

        if (isset($data['category'])) {
            $permission->category = $data['category'];
        }

        $permission->save();

        return $permission;
    }

    /**
     * Delete a permission.
     */
    public function delete(Permission $permission): bool
    {
        return $permission->delete();
    }
}
