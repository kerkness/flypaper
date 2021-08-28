<?php

namespace App\Policies;

use App\Models\Paper;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class PaperPolicy
{
    use HandlesAuthorization;

    public function before(User $user, $ability)
    {
        if ($user->hasRole('god')) {
            return true;
        }
    }
    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        //
        return Response::allow();
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Paper  $paper
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Paper $paper)
    {
        //
        return $paper->approved || $paper->user_id === $user->id || $user->hasRole('god')
            ? Response::allow()
            : Response::deny('Paper is not approved or you do not own it.');
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        //
        return $user->hasRole('creator') || $user->hasRole('editor')
            ? Response::allow()
            : Response::deny('You are not permitted to created paper');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Paper  $paper
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Paper $paper)
    {
        //
        return ($user->can('edit paper') && $paper->user_id === $user->id) || $user->hasRole('editor')
            ? Response::allow()
            : Response::deny('You cannot update this paper');
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Paper  $paper
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Paper $paper)
    {
        //
        return ($user->can('delete paper') && $paper->user_id === $user->id) || $user->hasRole('editor')
            ? Response::allow()
            : Response::deny('You cannot delete this paper');;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Paper  $paper
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Paper $paper)
    {
        //
        return ($user->can('edit paper') && $paper->user_id === $user->id) || $user->hasRole('editor')
            ? Response::allow()
            : Response::deny('You cannot restore this paper');;
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Paper  $paper
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Paper $paper)
    {
        //
        return ($user->can('delete paper') && $paper->user_id === $user->id) || $user->hasRole('editor')
            ? Response::allow()
            : Response::deny('You cannot delete this paper');
    }
}
