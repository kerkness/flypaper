<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use App\Models\User;

class Roles extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::create(['name' => 'edit paper']);
        Permission::create(['name' => 'delete paper']);
        Permission::create(['name' => 'publish paper']);
        Permission::create(['name' => 'unpublish paper']);
        Permission::create(['name' => 'verify user']);

        $creator = Role::create(['name' => 'creator']);
        $creator->givePermissionTo('edit paper');
        $creator->givePermissionTo('delete paper');
        
        $editor = Role::create(['name' => 'editor']);
        $editor->givePermissionTo('publish paper');
        $editor->givePermissionTo('unpublish paper');

        $god = Role::create(['name' => 'god']);

        $user = User::where('email', '=', env('SUPER_ADMIN_EMAIL'))->first();
        $user->assignRole($god);

        $users = User::where('email', '!=', env('SUPER_ADMIN_EMAIL'))->get();

        collect($users)->each(function($user) use ($creator) {
            $user->assignRole($creator);
        });

    }
}
