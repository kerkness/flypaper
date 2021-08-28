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

Route::get('/paper', [App\Http\Controllers\PaperController::class, 'fetch'])->name('get-papers');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([$request->user(), 'roles' => $request->user()->getRoleNames()]);
});

Route::middleware(['auth:sanctum', 'sanitizer'])->post('/submit-paper',  
    [App\Http\Controllers\SubmissionController::class, 'submit_paper']
)->name("submit-paper");

Route::middleware(['auth:sanctum'])->post('/inspect-upload',  
    [App\Http\Controllers\SubmissionController::class, 'inspect_upload']
)->name("inspect-upload");

Route::middleware(['auth:sanctum'])->post('/downloaded/{paper_id}',  
    [App\Http\Controllers\PaperController::class, 'record_download']
)->name("record-download");

Route::middleware(['auth:sanctum'])->post('/like/{paper_id}',  
    [App\Http\Controllers\PaperController::class, 'record_like']
)->name("record-like");

Route::middleware(['auth:sanctum'])->post('/unlike/{paper_id}',  
    [App\Http\Controllers\PaperController::class, 'record_unlike']
)->name("record-unlike");
