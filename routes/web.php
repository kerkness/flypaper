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

Route::get('/auth/discord/redirect', [App\Http\Controllers\LoginController::class, 'auth_redirect'])->name('discord-redirect');
Route::get('/auth/discord/callback', [App\Http\Controllers\LoginController::class, 'auth_callback'])->name('discord-callback');

Route::get('/auth/twitch/redirect', [App\Http\Controllers\LoginController::class, 'auth_redirect'])->name('twitch-redirect');
Route::get('/auth/twitch/callback', [App\Http\Controllers\LoginController::class, 'auth_callback'])->name('twitch-callback');


Route::get('/', [App\Http\Controllers\PaperController::class, 'browse_paper'])->name('browse-paper');
Route::any('/submit', [App\Http\Controllers\PaperController::class, 'browse_paper'])->name('submit-paper');
Route::any('/login', [App\Http\Controllers\PaperController::class, 'browse_paper'])->name('login');
Route::any('/logout', [App\Http\Controllers\LoginController::class, 'logout'])->name('logout');
