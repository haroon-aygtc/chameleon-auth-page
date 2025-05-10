
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
            $createdPermissions[] = Permission::create($permission);
        }

        // Create roles
        $adminRole = Role::create([
            'name' => 'Admin',
            'description' => 'Administrator with all permissions',
        ]);

        $managerRole = Role::create([
            'name' => 'Manager',
            'description' => 'Manager with limited permissions',
        ]);

        $userRole = Role::create([
            'name' => 'User',
            'description' => 'Regular user with basic permissions',
        ]);

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

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        $admin->roles()->attach($adminRole->id);

        // Create manager user
        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
        ]);

        $manager->roles()->attach($managerRole->id);

        // Create regular user
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
        ]);

        $user->roles()->attach($userRole->id);
    }
}
