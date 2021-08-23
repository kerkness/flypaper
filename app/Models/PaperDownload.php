<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperDownload extends Model
{
    use HasFactory;

    public $table = 'paper_downloads';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'paper_id',
    ];

}
