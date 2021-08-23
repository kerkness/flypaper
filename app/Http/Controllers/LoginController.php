<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


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

    public function auth_redirect()
    {
        return Socialite::driver('discord')->redirect();
    }

    public function auth_callback()
    {
        $user = Socialite::driver('discord')->user();

        $users = User::where(['email' => $user->getEmail()])->first();
    
        if ($users) {
    
            Auth::login($users, true);
            return redirect()->route('submit-paper');
    
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
    
            Auth::login($user, true);
    
            return redirect()->route('submit-paper');
        }    
    }

}