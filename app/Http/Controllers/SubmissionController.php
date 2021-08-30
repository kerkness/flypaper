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


}