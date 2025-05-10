
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get permission IDs for the frontend
        $permissionIds = $this->whenLoaded('permissions', function () {
            return $this->permissions->pluck('id')->toArray();
        }, []);
        
        // Get user count
        $userCount = $this->whenLoaded('users', function () {
            return $this->users->count();
        }, 0);
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'permissions' => $permissionIds,
            'isSystem' => $this->is_system ?? false,
            'color' => $this->color,
            'userCount' => $userCount,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
