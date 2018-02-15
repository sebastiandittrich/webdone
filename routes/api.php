<?php

use Illuminate\Http\Request;
use App\User;
use App\Task;
use App\Project;
use App\Workspace;
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

// User
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// Tasks
Route::middleware('auth:api')->post('/tasks', function(Request $request) {
    $args = request('item');
    $args['user_id'] = $request->user()->id;
    $task = Task::create($args);
    return $task;
});

Route::middleware('auth:api')->put('/tasks/{task}', function (Task $task, Request $request) {
    if($task->user->id == $request->user()->id) {
        $item = request('item');
        $item['user_id'] = $request->user()->id;
        $task->update($item);
        return $task;
    }
});

Route::middleware('auth:api')->delete('/tasks/{task}', function(Request $request, Task $task) {
    if($task->user_id != $request->user()->id) {
        return 'false';
    } else {
        $task->delete();
        return 'true';
    }
});

Route::middleware('auth:api')->get('/tasks', function(Request $request) {
    return $request->user()->tasks;
});

// Workspaces
Route::middleware('auth:api')->post('/workspaces', function(Request $request) {
    $args = request('item');
    $args['user_id'] = $request->user()->id;
    $workspace = Workspace::create($args);
    return $workspace;
});

Route::middleware('auth:api')->put('/workspaces/{workspace}', function (Workspace $workspace, Request $request) {
    if($workspace->user->id == $request->user()->id) {
        $item = request('item');
        $item['user_id'] = $request->user()->id;
        $workspace->update($item);
        return $workspace;
    }
});

Route::middleware('auth:api')->delete('/workspaces/{workspace}', function(Request $request, Workspace $workspace) {
    if($workspace->user_id != $request->user()->id) {
        return 'false';
    } else {
        $workspace->delete();
        return 'true';
    }
});

Route::middleware('auth:api')->get('/workspaces', function(Request $request) {
    return $request->user()->workspaces;
});

// Projects
Route::middleware('auth:api')->post('/projects', function(Request $request) {
    $args = request('item');
    $args['user_id'] = $request->user()->id;
    $project = Project::create($args);
    return $project;
});

Route::middleware('auth:api')->put('/projects/{project}', function (Project $project, Request $request) {
    if($project->user->id == $request->user()->id) {
        $item = request('item');
        $item['user_id'] = $request->user()->id;
        $project->update($item);
        return $project;
    }
});

Route::middleware('auth:api')->delete('/projects/{project}', function(Request $request, Project $project) {
    if($project->user_id != $request->user()->id) {
        return 'false';
    } else {
        $project->delete();
        return 'true';
    }
});

Route::middleware('auth:api')->get('/projects', function(Request $request) {
    return $request->user()->projects;
});

// Route::get('/users/{user}', function(User $user) {
//     return $user;
// });

// Route::get('/tasks', function (Request $request) {
//     return $request->user()->tasks;
// });