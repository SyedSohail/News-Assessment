<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'url',
        'source',
        'author',
        'image_url',
        'published_at',
    ];

    // Optionally, you can define a mutator for published_at if you need to format it
    protected $dates = [
        'published_at',
    ];

    // If you want to cast any attributes, you can do it here
    protected $casts = [
        'published_at' => 'datetime',
    ];
}
