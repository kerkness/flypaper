<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperTag extends Model
{
    use HasFactory;

    public $table = 'paper_tag';
    public $timestamps = false;

    protected $fillable = [
        'tag_id',
        'paper_id',
    ];

}
