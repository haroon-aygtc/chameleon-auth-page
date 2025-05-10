
<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        
        // Assign admin role
        $adminRole = Role::where('name', 'Administrator')->first();
        if ($adminRole) {
            $adminUser->roles()->sync([$adminRole->id]);
        }
        
        // Create manager user
        $managerUser = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        
        // Assign manager role
        $managerRole = Role::where('name', 'Manager')->first();
        if ($managerRole) {
            $managerUser->roles()->sync([$managerRole->id]);
        }
        
        // Create editor user
        $editorUser = User::firstOrCreate(
            ['email' => 'editor@example.com'],
            [
                'name' => 'Editor User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        
        // Assign editor role
        $editorRole = Role::where('name', 'Editor')->first();
        if ($editorRole) {
            $editorUser->roles()->sync([$editorRole->id]);
        }
        
        // Create viewer user
        $viewerUser = User::firstOrCreate(
            ['email' => 'viewer@example.com'],
            [
                'name' => 'Viewer User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        
        // Assign viewer role
        $viewerRole = Role::where('name', 'Viewer')->first();
        if ($viewerRole) {
            $viewerUser->roles()->sync([$viewerRole->id]);
        }
    }
}
