<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\PaperDownload;
use App\Models\PaperLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class PaperController extends Controller
{

    public $user;

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

        $papers = Paper::query()
            ->where('approved', '=', 1)
            ->withCurrentUser()
            ->limit(4)
            ->offset($offset)
            ->orderBy('created_at', 'DESC')
            ->get();


        $count = Paper::query()
            ->where('approved', '=', 1)
            ->withCurrentUser()
            ->count();


        return response()->json(['papers' => $papers, 'total' => $count]);
    }

    public function browse_paper(Request $request)
    {
        return view('flypaper', [
            'user' => Auth::check() ? Auth::user() : [],
            'serverless' => getenv('UPPY_SERVERLESS'),
        ]);
    }

    public function record_download(Request $request, $paper_id)
    {
        if (!Auth::check()) return;

        $user = Auth::user();
        $result = PaperDownload::firstOrCreate(['user_id' => $user->id, 'paper_id' => $paper_id]);

        return response()->json(['recorded']);
    }

    public function record_like(Request $request, $paper_id)
    {
        if (!Auth::check()) return;

        $user = Auth::user();
        $result = PaperLike::firstOrCreate(['user_id' => $user->id, 'paper_id' => $paper_id]);

        return response()->json(['liked']);
    }

    public function record_unlike(Request $request, $paper_id)
    {
        if (!Auth::check()) return;

        $user = Auth::user();
        $like = PaperLike::firstOrCreate(['user_id' => $user->id, 'paper_id' => $paper_id]);

        if ($like) $like->delete();

        return response()->json($like);
    }
}
