<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email_verified_at');
            $table->text('bio')->nullable()->after('password');
            $table->string('location')->nullable()->after('bio');
            $table->string('website')->nullable()->after('location');
            $table->string('phone')->nullable()->after('website');
            $table->string('job_title')->nullable()->after('phone');
            $table->string('company')->nullable()->after('job_title');
            $table->string('theme_preference')->default('system')->after('company');
            $table->json('notification_preferences')->nullable()->after('theme_preference');
            $table->timestamp('last_login_at')->nullable()->after('notification_preferences');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar',
                'bio',
                'location',
                'website',
                'phone',
                'job_title',
                'company',
                'theme_preference',
                'notification_preferences',
                'last_login_at',
            ]);
        });
    }
};
