<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;

class NewsController extends Controller
{
    public function fetchAndStoreNews()
    {
        $newsFromAPIs = [];

        $this->fetchNewsFromAPI(
            "https://newsapi.org/v2/top-headlines",
            ['country' => 'us', 'apiKey' => env('NEWS_API')],
            'NewsAPI',
            $newsFromAPIs,
            'articles'
        );

        $this->fetchNewsFromAPI(
            "https://content.guardianapis.com/search",
            ['api-key' => env('GUARDIAN_API'), 'show-fields' => 'all'],
            'The Guardian',
            $newsFromAPIs,
            'results',
            'response'
        );

        $this->fetchNewsFromAPI(
            "https://api.nytimes.com/svc/topstories/v2/home.json",
            ['api-key' => env('NYTIMES_API')],
            'The New York Times',
            $newsFromAPIs,
            'results'
        );

        $this->storeNews($newsFromAPIs);

        return response()->json(['message' => 'News fetched and stored successfully'], 200);
    }

    private function fetchNewsFromAPI($url, $queryParams, $source, &$newsFromAPIs, $articleKey, $responseKey = null)
    {
        try {
            $client = new Client();
            $response = $client->get($url, ['query' => $queryParams]);
            $data = json_decode($response->getBody()->getContents());

            Log::info("{$source} API Response:", (array) $data);

            $articles = $responseKey ? $data->{$responseKey}->{$articleKey} : $data->{$articleKey};
            if (!empty($articles)) {
                $newsFromAPIs = array_merge($newsFromAPIs, $this->formatNews($articles, $source));
            }
        } catch (\Exception $e) {
            Log::error("Error fetching {$source} data: " . $e->getMessage());
        }
    }

    private function storeNews($newsFromAPIs)
    {
        foreach ($newsFromAPIs as $newsItem) {
            Log::info('Storing News Item:', $newsItem);

            $categoryName = $newsItem['category'] ?? 'General';
            $category = Category::firstOrCreate(['name' => $categoryName]);

            News::updateOrCreate(
                ['url' => $newsItem['url']],
                array_merge($newsItem, ['category_id' => $category->id])
            );
        }
    }

    private function formatNews($articles, $source)
    {
        $formattedNews = [];

        foreach ($articles as $article) {
            $title = 'No Title';
            $description = 'No Description Available';
            $url = null;
            $publishedAt = now()->toString();
            $imageUrl = 'default_image_url.jpg';
            $category = 'General';

            switch ($source) {
                case 'NewsAPI':
                    $title = $article->title ?? $title;
                    $description = $article->description ?? $description;
                    $url = $article->url ?? $url;
                    $publishedAt = isset($article->publishedAt) ? \Carbon\Carbon::parse($article->publishedAt) : $publishedAt;
                    $imageUrl = $article->urlToImage ?? $imageUrl;
                    $category = $article->category ?? $category;
                    break;

                case 'The Guardian':
                    $title = $article->webTitle ?? $title;
                    $description = $article->fields->trailText ?? $description;
                    $url = $article->webUrl ?? $url;
                    $publishedAt = isset($article->webPublicationDate) ? \Carbon\Carbon::parse($article->webPublicationDate) : $publishedAt;
                    $imageUrl = $article->fields->thumbnail ?? $imageUrl;
                    $category = $article->sectionName ?? $category;
                    break;

                case 'NY Times':
                    $title = $article->title ?? $title;
                    $description = $article->abstract ?? $description;
                    $url = $article->url ?? $url;
                    $publishedAt = isset($article->published_date) ? \Carbon\Carbon::parse($article->published_date) : $publishedAt;
                    $imageUrl = $article->media[0]->{'media-metadata'}[0]->url ?? $imageUrl;
                    $category = $article->section ?? $category;
                    break;

                default:
                    break;
            }

            $formattedNews[] = [
                'title' => $title,
                'description' => $description,
                'url' => $url,
                'source' => $source,
                'published_at' => $publishedAt,
                'image_url' => $imageUrl,
                'category' => $category,
            ];
        }

        return $formattedNews;
    }


    public function getNews(Request $request)
    {
        $query = News::query();

        if ($search = $request->get('search', '')) {
            $query->where('title', 'like', '%' . $search . '%');
        }
        if ($source = $request->get('source', '')) {
            $query->where('source', $source);
        }
        if ($date = $request->get('date', '')) {
            $query->whereDate('published_at', $date);
        }
        if ($category = $request->get('category', '')) {
            $query->where('category_id', $category);
        }

        return response()->json($query->paginate($request->get('per_page', 10), ['*'], 'page', $request->get('page', 1)));
    }

    public function show($id)
    {
        return response()->json(News::findOrFail($id));
    }

    public function getCategories()
    {
        return response()->json(Category::all());
    }
}
