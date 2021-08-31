<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/auth/{social}/redirect', [App\Http\Controllers\LoginController::class, 'auth_redirect'])
    ->where('social', 'twitch|discord')
    ->name('auth-redirect');
Route::get('/auth/{social}/callback', [App\Http\Controllers\LoginController::class, 'auth_callback'])
    ->where('social', 'twitch|discord')
    ->name('auth-callback');

// Route::get('/auth/twitch/redirect', [App\Http\Controllers\LoginController::class, 'auth_redirect'])->name('twitch-redirect');
// Route::get('/auth/twitch/callback', [App\Http\Controllers\LoginController::class, 'auth_callback'])->name('twitch-callback');


Route::get('/', [App\Http\Controllers\PaperController::class, 'browse_paper'])->name('browse-paper');
Route::get('/random-paper', [App\Http\Controllers\PaperController::class, 'random_image'])->name('random-image-server');
// Route::any('/submit', [App\Http\Controllers\PaperController::class, 'browse_paper'])->name('submit-paper');
Route::any('/login', [App\Http\Controllers\PaperController::class, 'browse_paper'])->name('login');
Route::any('/logout', [App\Http\Controllers\LoginController::class, 'logout'])->name('logout');

