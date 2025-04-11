<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Blog;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    // Store a like
    public function store(Request $request, Blog $blog)
    {
        $this->checkVerifiedEmail();

        Like::firstOrCreate([
            'user_id' => auth()->id(),
            'blog_id' => $blog->id,
        ]);

        return redirect()->route('blogs.index')->withSuccess('Like added successfully!');
    }

    // Remove a like
    public function destroy(Request $request, Blog $blog)
    {
        $this->checkVerifiedEmail();

        Like::where(['user_id' => auth()->id(), 'blog_id' => $blog->id])->delete();

        return redirect()->route('blogs.index')->withSuccess('Like removed successfully!');
    }

    // Common function to check if the user has a verified email
    private function checkVerifiedEmail()
    {
        if (!auth()->user()->hasVerifiedEmail()) {
            return response()->json(['error' => 'Email not verified'], 403);
        }
    }
}
