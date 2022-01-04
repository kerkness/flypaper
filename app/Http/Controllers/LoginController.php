<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Two\InvalidStateException;
use Spatie\Permission\Models\Role;

class LoginController extends Controller
{

    public $user;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
    }

    public function logout(Request $request)
    {
        Auth::logout();
    
        $request->session()->invalidate();
    
        $request->session()->regenerateToken();
    
        return redirect('/');
    }

    public function auth_redirect(Request $request, $social)
    {
        return Socialite::driver($social)->redirect();
    }

    public function auth_callback(Request $request, $social)
    {

        $user = Socialite::driver($social)->stateless()->user();
        // try {
        //     $user = Socialite::driver($social)->user();
        // } catch (InvalidStateException $e) {
        //     $user = Socialite::driver($social)->stateless()->user();
        // }

        // $user = Socialite::driver($social)->user();

        $users = User::where(['email' => $user->getEmail()])->first();
    
        if ($users) {
    
            Auth::login($users, true);
            return redirect()->route('browse-paper');
    
        } else {
    
            $random = Str::random(32);
            $hashed = bcrypt($random);

            $user = User::create([
                'name'          => $user->getName(),
                'email'         => $user->getEmail(),
                'image'         => $user->getAvatar(),
                'provider_id'   => $user->getId(),
                'provider'      => $user,
                'password'      => $hashed,
            ]);

            $creator = Role::firstWhere('name', 'creator');
            $user->assignRole($creator);
    
            Auth::login($user, true);
    
            return redirect()->route('browse-paper');
        }    
    }

}