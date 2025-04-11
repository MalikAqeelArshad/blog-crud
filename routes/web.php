<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\User;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\LikeController;

Route::get('/verify-email/{id}', function ($id) {
    $user = User::findOrFail($id);
    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        return redirect()->route('dashboard')->with('status', 'Email verified!');
    }
    return redirect()->route('dashboard')->with('status', 'Email already verified!');
})->middleware('auth')->name('verify.email');

Route::post('/check-email', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    return response()->json([
        'exists' => User::where('email', $request->email)->exists(),
    ]);
})->name('check.email');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('/blogs', BlogController::class);

    Route::post('/blogs/{blog}/like', [LikeController::class, 'store'])->name('likes.store');
    Route::delete('/blogs/{blog}/like', [LikeController::class, 'destroy'])->name('likes.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
