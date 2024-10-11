<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', action: [AuthController::class, 'logout']);
    Route::get('/fetchAndStoreNews', [NewsController::class, 'fetchAndStoreNews']);
    Route::get('/news', [NewsController::class, 'getNews']);
    Route::get('/newsitem/{id}', [NewsController::class, 'show']);

});
