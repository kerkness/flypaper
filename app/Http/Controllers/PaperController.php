<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\PaperDownload;
use App\Models\PaperLike;
use App\Models\PaperTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Imgix\UrlBuilder;


class PaperController extends Controller
{

    public $user;
    public $limit = 36;
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

    public function get_limit(Request $request)
    {
        $limit = intval($request->input('limit', $this->limit));

        return $limit;
    }

    public function fetch(Request $request)
    {
        $offset = $request->input('offset', 0);
        $limit = $this->get_limit($request);
        $sort = $request->input('sort', 'created_at');
        $search = $request->input('search', '');
        $winWidth = $request->input('width');
        $winHeight = $request->input('height');
        $mosaic = $request->input('mosaic', false);

        // Validate sort methods
        if (!in_array($sort, $this->valid_sort)) {
            $sort = 'created_at';
        }

        if ($request->has('sort') && $request->input('sort') === 'featured') {
            $search = 'featured';
        }
 
        // dd(is_object($request->user()) && $request->user()->exists());
        $papers = Paper::query()
            ->withLikeCount()
            ->withDownloadCount()
            ->withPermissions($request->user())
            ->withSearch($search)
            ->limit($limit)
            ->offset($offset)
            ->withOrderBy($sort, 'DESC')
            ->get();


        $count = Paper::query()
            ->withPermissions($request->user())
            ->withSearch($search)
            ->count();

        // Loop over paper and pre-calculate image ratio
        $papers = collect($papers->toArray())->map(function($paper) use ($winWidth, $winHeight, $mosaic) {
            $maxWidth = $mosaic ? $winWidth / 3 : $winWidth;
            $maxHeight = $mosaic ? $winHeight / 2 : $winHeight;
            $paper['scale'] = $this->calculateAspectRatioFit($paper['width'], $paper['height'], $maxWidth, $maxHeight);
            $builder = new UrlBuilder("flypaper.imgix.net");
            $paper['scaled_url'] = $builder->createURL($paper['source'], ['w' => $paper['scale']['width']]);
            return $paper;
        });

        return response()->json([
            'user' => is_object($request->user()),
            'papers' => $papers, 
            'total' => $count
        ]);
    }

    public function calculateAspectRatioFit($srcWidth, $srcHeight, $maxWidth, $maxHeight) {

        $ratio = min(($maxWidth - 8) / $srcWidth, $maxHeight / $srcHeight);
    
        return [
            'width' => $srcWidth * $ratio, 'height' => $srcHeight * $ratio
        ];
    }

    public function random(Request $request)
    {
        $limit = $this->get_limit($request);
       
        $papers = Paper::query()
        ->withLikeCount()
        ->withDownloadCount()
        ->withApproved()
        ->withSearch($request->input('search', ''))
        ->inRandomOrder()
        ->limit($limit)
        ->get();

        return response()->json($papers);
    }

    public function fetch_liked(Request $request)
    {
        if (!$request->user()) {
            return response()->json(["error" => "Unauthorized"], 401);
        }

        $offset = $request->input('offset', 0);
        $limit = $this->get_limit($request);
       
        $papers = Paper::query()
            ->withLikeCount()
            ->withDownloadCount()
            ->withPermissions($request->user())
            ->withLiked($request->user())
            ->limit($limit)
            ->offset($offset)
            ->orderBy('created_at', 'DESC')
            ->get();

            $count = Paper::query()
            ->withPermissions($request->user())
            ->withLiked($request->user())
            ->count();


        return response()->json([
            'papers' => $papers, 
            'total' => $count
        ]);
    }

    public function sync_paper(Request $request) {

        $files = $request->input('files');
        $category = $request->input('category');

        if ($category === 'featured') {

            $papers = Paper::query()
            ->withLikeCount()
            ->withDownloadCount()
            ->withPermissions($request->user())
            ->withSearch('featured')
            ->whereNotIn('filename', $files)
            ->get();


        }
        if ($category === 'likes') {

            $papers = Paper::query()
            ->withLikeCount()
            ->withDownloadCount()
            ->withPermissions($request->user())
            ->withLiked($request->user())
            ->whereNotIn('filename', $files)
            ->get();

        }

        if (!$papers) {
            $papers = [];
        }

        return response()->json($papers);
    }

    public function random_image(Request $request)
    {
        $paper = Paper::query()
        ->withApproved()
        ->withSearch($request->input('search', ''))
        ->inRandomOrder()
        ->first();

        $w = $request->input('w', 2056);

        $builder = new UrlBuilder("flypaper.imgix.net");
        $url = $builder->createURL($paper->source, ['w' => $w]);

        return response()->stream(function() use ($url) {
            echo file_get_contents($url);
        }, 200, ['Content-Type' => $paper->mime_type]);
    }

    public function render_image(Request $request, $paper_id)
    {
        $paper = Paper::find($paper_id);

        $w = $request->input('w', 2056);

        // dd($paper);

        if (!$paper) {
            abort(404, 'Paper not found');
        }

        $builder = new UrlBuilder("flypaper.imgix.net");
        $url = $builder->createURL($paper->source, [
            'w' => $w,
            'txt' => 'FlyPaper by ' . $paper->user->name .' - flypaper.theflyingfabio.com',
            'txt-size' => 22,
            'txt-color' => 'FFFFFF'
        ]);

        return response()->stream(function() use ($url) {
            echo file_get_contents($url);
        }, 200, ['Content-Type' => $paper->mime_type]);
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
        if ($request->has('featured') && $request->user()->can('publish paper')) {
            $paper->featured = $request->input('featured') ? 1 : 0;
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
        $paper->filename = $this->uniqueFilename($request->input('filename'));
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

        // Ensure Get unique FileName

        $paper->save();

        // Add tags
        $tagged = $this->add_tags($request->input('tags'), $paper->id);

        $paper->refresh();

        $paper = Paper::query()->find($paper->id);

        return response()->json($paper);
    }

    public function uniqueFilename($filename) {
        $count = DB::table('papers')->where('filename', $filename)->count();
        return $count > 0 ? $this->uniqueFilename($count . '-' . $filename) : $filename;
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
