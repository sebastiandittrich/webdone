<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Belonging;

class Workspace extends Model
{
    use Belonging;

    protected $fillable = ['name', 'user_id'];
}
