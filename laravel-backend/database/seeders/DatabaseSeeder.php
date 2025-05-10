<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // First create permissions
            PermissionsSeeder::class,
            // Then create roles (which may depend on permissions)
            RolesSeeder::class,
            // Then create users (which may depend on roles)
            UsersSeeder::class,
            // Finally create AI models
            AiModelsSeeder::class,
        ]);
    }
}
