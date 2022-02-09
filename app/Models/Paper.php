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
        'preview',
        'render',
        // 'like_count',
        // 'download_count',
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

    public function scopeWithLikeCount($query)
    {
        return $query->withCount('likes');
    }

    public function scopeWithDownloadCount($query)
    {
        return $query->withCount('downloads');
    }

    public function scopeWithApproved($query)
    {
        return $query->where('approved', '=', 1);
    }

    public function scopeWithPermissions( $query, User $user = null )
    {
        if ( is_object($user) && $user->hasRole(['god', 'editor']) ) {
            return $query;
        }

        $query->where('approved', '=', 1);

        if ( is_object($user) ) {
            $query->orWhere('user_id', '=', $user->id);
        }

        return $query;

    }

    public function scopeWithSearch($query, $search)
    {
        if ($search === 'featured') {
            return $query->where('featured', '=', 1);
        }

        if (substr( $search, 0, 6 ) === "liked:") {
            $username = substr($search, 6);
            $user = User::query()->where('name', $username)->first();
            if ($user) {
                $query->withLiked($user);
            }
            $search = null;
        }

        if ($search) {
            return $query->whereHas('tags', function($query) use ($search) {
                $query->where('slug', 'like', '%'.strtolower($search).'%')
                    ->orWhere('label', 'like', '%'.strtolower($search).'%');
            })->orWhereHas('user', function($query) use ($search) {
                $query->where('name', '=', $search);
            })->orWhere('category', '=', $search);    
        }
        return $query;
    }

    public function scopeWithLiked($query, User $user)
    {
        if (! $user) return $query;

        return $query->whereHas('likes', function($query) use ($user) {
            $query->where('user_id', '=', $user->id);
        });
    }

    public function scopeWithOrderBy($query, $sort, $dir)
    {
        if($sort !== 'created_at') {
            return $query->orderBy($sort, $dir)->orderBy('created_at', 'DESC');
        }

        return $query->orderBy('created_at', 'DESC');
    }

    public function getSrcAttribute()
    {
        $builder = new UrlBuilder("flypaper.imgix.net");
        return $builder->createURL($this->source, []);
    }

    public function getPreviewAttribute()
    {
        $builder = new UrlBuilder("flypaper.imgix.net");
        return $builder->createURL($this->source, ['w' => 1024]);
    }

    public function getRenderAttribute()
    {
        return url('/render/' . $this->id);
    }


    // public function getLikeCountAttribute()
    // {
    //     return $this->likes()->count();
    // }

    // public function getDownloadCountAttribute()
    // {
    //     return $this->downloads()->count();
    // }

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
