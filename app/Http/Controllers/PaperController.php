<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\PaperDownload;
use App\Models\PaperLike;
use App\Models\PaperTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;


class PaperController extends Controller
{

    public $user;
    public $limit = 4;
    public $valid_sort = [
        'created_at',
        'likes_count',
        'downloads_count',
    ];

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function fetch(Request $request)
    {
        $offset = $request->input('offset', 0);

        $sort = $request->input('sort', 'created_at');

        // Validate sort methods
        if (!in_array($sort, $this->valid_sort)) {
            $sort = 'created_at';
        }

        // dd(is_object($request->user()) && $request->user()->exists());
        $papers = Paper::query()
            ->withLikeCount()
            ->withDownloadCount()
            ->withPermissions($request->user())
            ->withSearch($request->input('search', ''))
            ->limit($this->limit)
            ->offset($offset)
            ->orderBy($sort, 'DESC')
            ->get();


        $count = Paper::query()
            ->withPermissions($request->user())
            ->withSearch($request->input('search', ''))
            ->count();


        return response()->json([
            'user' => is_object($request->user()),
            'papers' => $papers, 
            'total' => $count
        ]);
    }

    public function browse_paper(Request $request)
    {
        // Get a token
        $token = '';

        if (Auth::check()) {
            $user = Auth::user();
            $token = $user->createToken('app')->plainTextToken;
        }

        return view('flypaper', [
            'user' => Auth::check() ? Auth::user() : [],
            'serverless' => getenv('UPPY_SERVERLESS'),
            'token' => $token,
        ]);
    }

    public function record_download(Request $request, $paper_id)
    {
        $user = Auth::user();
        $result = PaperDownload::firstOrCreate(['user_id' => $user->id, 'paper_id' => $paper_id]);

        return response()->json(['recorded']);
    }

    public function record_like(Request $request, $paper_id)
    {
        $user = Auth::user();
        $result = PaperLike::firstOrCreate(['user_id' => $user->id, 'paper_id' => $paper_id]);

        return response()->json(['liked']);
    }

    public function record_unlike(Request $request, $paper_id)
    {
        $user = Auth::user();
        $like = PaperLike::firstOrCreate(['user_id' => $user->id, 'paper_id' => $paper_id]);

        if ($like) $like->delete();

        return response()->json($like);
    }

    public function delete_paper(Request $request, $paper_id)
    {
        $user = $request->user();

        $paper = Paper::withPermissions($user)
            ->where('id', '=', $paper_id)->first();

        if (!$paper->exists()) {
            abort(401, 'Unauthorized delete');
        }

        $affected = $paper->delete();

        return response()->json($affected, 200);        
    }

    public function update_paper(Request $request, $paper_id)
    {
        $user = $request->user();

        $paper = Paper::withPermissions($user)
            ->where('id', '=', $paper_id)->first();

        if (!$paper->exists()) {
            abort(401, 'Unauthorized delete');
        }

        if ($request->has('category')) {
            $paper->category = $request->input('category');
        }
        if ($request->has('approved') && $request->user()->can('publish paper')) {
            $paper->approved = $request->input('approved') ? 1 : 0;
        }

        $paper->save();

        if ($request->has('tags')) {
            $this->clear_tags($paper->id);
            $this->add_tags($request->input('tags'), $paper->id);    
        }

        $paper->refresh();
        $paper = Paper::query()->find($paper->id);

        return response()->json($paper, 200);

    }

    public function create_paper(Request $request)
    {
        $user = Auth::user();

        $paper = new Paper();
        $paper->filename = $request->input('filename');
        $paper->source = $request->input('source');
        $paper->mime_type = $request->input('mime_type');
        $paper->width = $request->input('width');
        $paper->height = $request->input('height');
        $paper->size = $request->input('size');
        $paper->category = $request->input('category');
        $paper->user_id = $user->id;

        if ($user->can('publish paper')) {
            $paper->approved = 1;
        }

        $paper->save();

        // Add tags
        $tagged = $this->add_tags($request->input('tags'), $paper->id);

        $paper->refresh();

        $paper = Paper::query()->find($paper->id);

        return response()->json($paper);
    }

    public function add_tags( $tags, $paper_id )
    {
        return collect($tags)->each(function($tag_label, $index) use ($paper_id) {

            $slug = Str::slug($tag_label, "-");

            $tag = Tag::firstOrCreate(['slug' => $slug], ['slug' => $slug, 'label' => $tag_label]);

            return PaperTag::firstOrCreate(['tag_id' => $tag->id, 'paper_id' => $paper_id]);

        });
    }

    public function clear_tags( $paper_id )
    {
        PaperTag::where('paper_id', '=', $paper_id)->delete();
    }

}
