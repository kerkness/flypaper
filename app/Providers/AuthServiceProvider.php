<?php

namespace App\Providers;

use App\Models\Paper;
use App\Models\User;
use App\Policies\PaperPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Paper::class => PaperPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // God can do anything.
        Gate::before(function($user, $ability) {
            return $user->hasRole('god') ? true : null;
        });

        // Update your own paper as a creator
        // Gate::define('edit-paper', function(User $user, Paper $paper) {
        //     return $user->id === $paper->user_id && $user->can('edit paper');
        // });

    }
}
