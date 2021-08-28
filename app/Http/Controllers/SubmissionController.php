<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\PaperTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Imgix\UrlBuilder;

class SubmissionController extends Controller
{

    public $user;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function inspect_upload(Request $request)
    {
        $source = $request->input('source');
        $builder = new UrlBuilder("flypaper.imgix.net");

        $url = $builder->createURL($source, []);

        $size = getimagesize($url);

        $width = $size && isset($size[0]) ? $size[0] : '';
        $height = $size && isset($size[1]) ? $size[1] : '';

        return response()->json([
            'width' => $width,
            'height' => $height,
        ]);        
    }

    public function submit_paper(Request $request)
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

}