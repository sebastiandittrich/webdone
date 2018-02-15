<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Belonging;

class Task extends Model
{
    use Belonging;

    protected $fillable = ['title', 'description', 'workspace', 'energy', 'time', 'project', 'state', 'user_id'];

}
