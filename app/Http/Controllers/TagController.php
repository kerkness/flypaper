<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\PaperTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Imgix\UrlBuilder;

class TagController extends Controller
{

    public $user;
    public $limit = 60;
    public $valid_sort = [
        'label',
        'slug',
    ];

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function get_limit(Request $request)
    {
        $limit = intval($request->input('limit', $this->limit));

        return $limit < 20 ? $limit : 20;
    }

    public function fetch(Request $request)
    {
        $offset = $request->input('offset', 0);
        $limit = $this->get_limit($request);

        $sort = $request->input('sort', 'label');

        if (!in_array($sort, $this->valid_sort)) {
            $sort = 'label';
        }
 
        $tags = Tag::query()
            ->withPaperCount()
            ->limit($limit)
            ->offset($offset)
            ->orderBy($sort, 'ASC')
            ->get();


        $count = Tag::query()
            ->count();


        return response()->json([
            'tags' => $tags, 
            'total' => $count
        ]);
    }
}