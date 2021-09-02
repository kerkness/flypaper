<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'label',
    ];

    public function papers()
    {
        return $this->belongsToMany(Paper::class);
    }

    public function scopeWithPaperCount($query)
    {
        return $query->withCount('papers');
    }

    public function scopeHasPapers($query)
    {
        return $query->withPaperCount()->having('papers_count', '>', 0);
    }

}
