<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions by category
        $userPermissions = [
            ['name' => 'view users', 'description' => 'Can view users', 'category' => 'User Management'],
            ['name' => 'create users', 'description' => 'Can create users', 'category' => 'User Management'],
            ['name' => 'edit users', 'description' => 'Can edit users', 'category' => 'User Management'],
            ['name' => 'delete users', 'description' => 'Can delete users', 'category' => 'User Management'],
        ];

        $rolePermissions = [
            ['name' => 'view roles', 'description' => 'Can view roles', 'category' => 'Role Management'],
            ['name' => 'create roles', 'description' => 'Can create roles', 'category' => 'Role Management'],
            ['name' => 'edit roles', 'description' => 'Can edit roles', 'category' => 'Role Management'],
            ['name' => 'delete roles', 'description' => 'Can delete roles', 'category' => 'Role Management'],
        ];

        $permissionPermissions = [
            ['name' => 'view permissions', 'description' => 'Can view permissions', 'category' => 'Permission Management'],
            ['name' => 'create permissions', 'description' => 'Can create permissions', 'category' => 'Permission Management'],
            ['name' => 'edit permissions', 'description' => 'Can edit permissions', 'category' => 'Permission Management'],
            ['name' => 'delete permissions', 'description' => 'Can delete permissions', 'category' => 'Permission Management'],
        ];

        $systemPermissions = [
            ['name' => 'access admin panel', 'description' => 'Can access admin panel', 'category' => 'System'],
            ['name' => 'manage settings', 'description' => 'Can manage system settings', 'category' => 'System'],
        ];

        // Create all permissions
        $allPermissions = array_merge($userPermissions, $rolePermissions, $permissionPermissions, $systemPermissions);
        $createdPermissions = [];

        foreach ($allPermissions as $permission) {
            $createdPermissions[] = Permission::firstOrCreate(
                ['name' => $permission['name']],
                [
                    'description' => $permission['description'],
                    'category' => $permission['category']
                ]
            );
        }

        // Get or create roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'Admin'],
            ['description' => 'Administrator with all permissions']
        );

        $managerRole = Role::firstOrCreate(
            ['name' => 'Manager'],
            ['description' => 'Manager with limited permissions']
        );

        $userRole = Role::firstOrCreate(
            ['name' => 'User'],
            ['description' => 'Regular user with basic permissions']
        );

        // Assign permissions to roles
        $adminRole->permissions()->sync(collect($createdPermissions)->pluck('id'));
        $managerRole->permissions()->attach(
            Permission::whereIn('name', [
                'view users', 'view roles', 'view permissions',
                'access admin panel'
            ])->pluck('id')
        );
        $userRole->permissions()->attach(
            Permission::whereIn('name', [
                'view users'
            ])->pluck('id')
        );

        // Get or create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );

        $admin->roles()->syncWithoutDetaching([$adminRole->id]);

        // Get or create manager user
        $manager = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );

        $manager->roles()->syncWithoutDetaching([$managerRole->id]);

        // Get or create regular user
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );

        $user->roles()->syncWithoutDetaching([$userRole->id]);
    }
}
