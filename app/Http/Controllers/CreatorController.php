<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PaperDownload;
use App\Models\PaperLike;
use App\Models\PaperTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Imgix\UrlBuilder;


class CreatorController extends Controller
{

    public $user;
    public $limit = 60;
    public $valid_sort = [
        'name',
        'papers_count',
    ];

    public function get_limit(Request $request)
    {
        $limit = intval($request->input('limit', $this->limit));

        return $limit < 20 ? $limit : 20;
    }

    public function fetch(Request $request)
    {
        $offset = $request->input('offset', 0);
        $limit = $this->get_limit($request);

        $sort = $request->input('sort', 'name');

        // Validate sort methods
        if (!in_array($sort, $this->valid_sort)) {
            $sort = 'name';
        }
 
        // dd(is_object($request->user()) && $request->user()->exists());
        $users = User::query()
            ->hasPapers()
            ->limit($limit)
            ->offset($offset)
            ->orderByRaw($sort, 'ASC')
            ->get();


        $count = User::query()
            ->hasPapers()
            ->count();


        return response()->json([
            'creators' => $users, 
            'total' => $count
        ]);
    }

}
