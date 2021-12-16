<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/paper', 
    [App\Http\Controllers\PaperController::class, 'fetch'])
->name('get-papers');

Route::get('/paper/random', 
    [App\Http\Controllers\PaperController::class, 'random'])
->name('random-papers');

Route::get('/paper/liked', 
    [App\Http\Controllers\PaperController::class, 'fetch_liked'])
->name('get-liked-papers');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([$request->user(), 'roles' => $request->user()->getRoleNames()]);
})->name('get-user');

Route::middleware(['auth:sanctum', 'sanitizer'])->post('/paper',  
    [App\Http\Controllers\PaperController::class, 'create_paper']
)->name("add-paper");

Route::middleware(['auth:sanctum'])->post('/paper/sync',
    [App\Http\Controllers\PaperController::class, 'sync_paper']
)->name('sync-paper');

Route::middleware(['auth:sanctum', 'sanitizer'])->put('/paper/{paper_id}',  
    [App\Http\Controllers\PaperController::class, 'update_paper']
)->name("update-paper");

Route::middleware(['auth:sanctum'])->delete('/paper/{paper_id}',  
    [App\Http\Controllers\PaperController::class, 'delete_paper']
)->name("delete-paper");

Route::middleware(['auth:sanctum'])->post('/inspect-upload',  
    [App\Http\Controllers\SubmissionController::class, 'inspect_upload']
)->name("inspect-upload");

Route::middleware(['auth:sanctum'])->post('/paper/{paper_id}/downloaded',  
    [App\Http\Controllers\PaperController::class, 'record_download']
)->name("record-download");

Route::middleware(['auth:sanctum'])->post('/paper/{paper_id}/like',  
    [App\Http\Controllers\PaperController::class, 'record_like']
)->name("record-like");

Route::middleware(['auth:sanctum'])->delete('/paper/{paper_id}/like',  
    [App\Http\Controllers\PaperController::class, 'record_unlike']
)->name("record-unlike");

Route::get('/tag', 
    [App\Http\Controllers\TagController::class, 'fetch'])
->name('get-tags');

Route::get('/creator', 
    [App\Http\Controllers\CreatorController::class, 'fetch'])
->name('get-creators');
