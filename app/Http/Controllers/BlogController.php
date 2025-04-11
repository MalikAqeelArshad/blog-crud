<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    // Show all blogs with filters
    public function index(Request $request)
    {
        $blogs = Blog::with(['user', 'likes'])
            ->visibleToUser()
            ->search($request->search)
            ->filterByAuthor($request->author)
            ->filterByDate($request->date)
            ->latest()
            ->paginate(10);

        return Inertia::render('Blogs/Index', [
            'blogs' => $blogs,
            'filters' => $request->only(['search', 'author', 'date']),
        ]);
    }

    // Show create form
    public function create()
    {
        return $this->checkVerifiedEmail() ?: Inertia::render('Blogs/Create');
    }

    // Store a new blog
    public function store(Request $request)
    {
        $this->checkVerifiedEmail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'is_public' => 'required|boolean',
        ]);

        auth()->user()->blogs()->create($validated);

        return redirect()->route('blogs.index')->with('success', 'Blog created!');
    }

    // Show edit form
    public function edit(Blog $blog)
    {
        if ($this->checkUserAuth($blog)) {
            return redirect()->route('blogs.index');
        }
        return Inertia::render('Blogs/Edit', ['blog' => $blog]);
    }

    // Update blog
    public function update(Request $request, Blog $blog)
    {
        if ($this->checkUserAuth($blog)) {
            return redirect()->route('blogs.index');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'is_public' => 'required|boolean',
        ]);

        $blog->update($validated);

        return redirect()->route('blogs.index')->with('success', 'Blog updated!');
    }

    // Delete blog
    public function destroy(Blog $blog)
    {
        if ($this->checkUserAuth($blog)) {
            return redirect()->route('blogs.index');
        }

        $blog->delete();

        return redirect()->route('blogs.index')->with('success', 'Blog deleted!');
    }

    // Helper function to check if the user has a verified email
    private function checkVerifiedEmail()
    {
        if (!auth()->user()->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }
    }

    // Helper function to check if the current user owns the blog
    private function checkUserAuth(Blog $blog)
    {
        return !auth()->user()->hasVerifiedEmail() || $blog->user_id !== auth()->id();
    }
}
