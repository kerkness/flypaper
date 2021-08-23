<?php

namespace App\Models;

use Imgix\UrlBuilder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Paper extends Model
{
    use HasFactory;

    protected $fillable = [
        'file',
        'source',
        'mime_type',
        'size',
        'category',
    ];

    protected $with = [
        'user',
        'tags'
    ];

    protected $appends = [
        'src',
        'like_count',
        'download_count',
        'user_liked',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function likes()
    {
        return $this->hasMany(PaperLike::class);
    }

    public function downloads()
    {
        return $this->hasMany(PaperDownload::class);
    }

    public function scopeWithCurrentUser( $query )
    {
        if (Auth::check()) {
            return $query->orWhere('user_id', '=', Auth::user()->id);
        }

        return $query;
    }

    public function getSrcAttribute()
    {
        $builder = new UrlBuilder("flypaper.imgix.net");
        return $builder->createURL($this->source, []);
    }

    public function getLikeCountAttribute()
    {
        return $this->likes()->count();
    }

    public function getDownloadCountAttribute()
    {
        return $this->downloads()->count();
    }

    public function getUserLikedAttribute()
    {
        if (!Auth::check()) return false;

        $user = Auth::user();
        return $this->likes()
            ->where('paper_id', '=', $this->id)
            ->where('user_id', '=', $user->id)
            ->count();
    }


}
