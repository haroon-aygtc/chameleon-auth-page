
<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin role
        $adminRole = Role::firstOrCreate(
            ['name' => 'Administrator'],
            ['description' => 'Full system access']
        );
        
        // Assign all permissions to admin role
        $allPermissions = Permission::all();
        $adminRole->permissions()->sync($allPermissions->pluck('id')->toArray());
        
        // Create manager role
        $managerRole = Role::firstOrCreate(
            ['name' => 'Manager'],
            ['description' => 'Can manage content and users']
        );
        
        // Get user management and content management permissions
        $managerPermissions = Permission::where('category', 'user_management')
            ->orWhere('category', 'content_management')
            ->get();
        
        $managerRole->permissions()->sync($managerPermissions->pluck('id')->toArray());
        
        // Create editor role
        $editorRole = Role::firstOrCreate(
            ['name' => 'Editor'],
            ['description' => 'Can edit content']
        );
        
        // Get content management permissions
        $editorPermissions = Permission::where('category', 'content_management')
            ->get();
        
        $editorRole->permissions()->sync($editorPermissions->pluck('id')->toArray());
        
        // Create viewer role
        Role::firstOrCreate(
            ['name' => 'Viewer'],
            ['description' => 'Read-only access']
        );
    }
}
