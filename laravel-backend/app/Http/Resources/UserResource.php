<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
            'email_verified_at' => $this->email_verified_at,
            'avatar' => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'bio' => $this->bio,
            'location' => $this->location,
            'website' => $this->website,
            'phone' => $this->phone,
            'job_title' => $this->job_title,
            'company' => $this->company,
            'theme_preference' => $this->theme_preference,
            'notification_preferences' => $this->notification_preferences,
            'last_login_at' => $this->last_login_at,
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
