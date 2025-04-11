<?php

namespace App\Models;

use App\Models\User;
use App\Models\Like;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['user_id', 'title', 'description', 'is_public'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function scopeVisibleToUser($query)
    {
        return $query->where(function ($q) {
            $q->where('is_public', true)
            ->orWhere('user_id', auth()->id());
        });
    }

    public function scopeSearch($query, $search)
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%');
            });
        }
    }

    public function scopeFilterByAuthor($query, $author)
    {
        if ($author) {
            $query->whereHas('user', function ($q) use ($author) {
                $q->where('name', 'like', '%' . $author . '%');
            });
        }
    }

    public function scopeFilterByDate($query, $date)
    {
        if ($date) {
            $query->whereDate('created_at', $date);
        }
    }

}
