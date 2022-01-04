<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'remember_token',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'email',
        'email_verified_at',
        'created_at',
        'updated_at',
        'password',
        'remember_token',
    ];

    protected $appends = [
        'likes_count',
        'downloads_count',
        'rank'
    ];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function papers()
    {
        return $this->hasMany(Paper::class);
    }

    public function getRankAttribute()
    {
        return $this->paper_likes + $this->papers_count + $this->paper_downloads;
    }

    public function getLikesCountAttribute()
    {
        $papers = $this->papers()->withLikeCount()->get();
        return $papers->sum('likes_count');
    }

    public function getDownloadsCountAttribute()
    {
        $papers = $this->papers()->withDownloadCount()->get();
        return $papers->sum('downloads_count');
    }

    public function scopeWithPaperCount($query)
    {
        return $query->withCount(['papers' => function($query) {
            $query->where('approved', '=', 1);
        }]);
    }

    public function scopeHasPapers($query)
    {
        return $query->withPaperCount()->having('papers_count', '>', 0);
    }
}
