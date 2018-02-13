<?php

use Illuminate\Http\Request;
use App\User;
use App\Task;
use Illuminate\Support\Facades\Auth;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::get('/users/{user}', function(User $user) {
//     return $user;
// });

// Route::get('/tasks', function (Request $request) {
//     return $request->user()->tasks;
// });