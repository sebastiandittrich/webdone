<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Belonging;

class Project extends Model
{
    use Belonging;

    protected $fillable = ['name', 'user_id'];
}
