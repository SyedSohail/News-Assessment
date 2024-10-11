<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    public function fetchAndStoreNews()
    {
        $newsFromAPIs = [];

        $newsAPIResponse = Http::get('https://newsapi.org/v2/top-headlines?country=us&', [
            'apiKey' => env('NEWS_API'),
            'country' => "us",
        ]);

        Log::info('NewsAPI Response:', $newsAPIResponse->json());

        if ($newsAPIResponse->successful()) {
            $newsFromAPIs = array_merge($newsFromAPIs, $this->formatNews($newsAPIResponse->json()['articles'], 'NewsAPI'));
        }

        $guardianResponse = Http::get('https://content.guardianapis.com/search', [
            'api-key' => env('GUARDIAN_API'),
            'show-fields' => 'headline,trailText,webUrl,thumbnail'
        ]);

        Log::info('The Guardian Response:', $guardianResponse->json());

        if ($guardianResponse->successful()) {
            $newsFromAPIs = array_merge($newsFromAPIs, $this->formatNews($guardianResponse->json()['response']['results'], 'The Guardian'));
        }

        $nyTimesResponse = Http::get('https://api.nytimes.com/svc/topstories/v2/home.json', [
            'api-key' => env('NYNEW_API_KEY'),
        ]);

        Log::info('NY Times Response:', $nyTimesResponse->json());

        if ($nyTimesResponse->successful()) {
            $newsFromAPIs = array_merge($newsFromAPIs, $this->formatNews($nyTimesResponse->json()['results'], 'NY Times'));
        }

        foreach ($newsFromAPIs as $newsItem) {
            Log::info('Storing News Item:', $newsItem);

            News::updateOrCreate(
                ['url' => $newsItem['url']],
                $newsItem
            );
        }

        return response()->json(['message' => 'News fetched and stored successfully'], 200);
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

            switch ($source) {
                case 'NewsAPI':
                    $title = $article['title'] ?? $title;
                    $description = $article['description'] ?? $description;
                    $url = $article['url'] ?? $url;
                    $publishedAt = isset($article['publishedAt']) ? \Carbon\Carbon::parse($article['publishedAt']) : $publishedAt;
                    $imageUrl = $article['urlToImage'] ?? $imageUrl;
                    break;

                case 'The Guardian':
                    $title = $article['webTitle'] ?? $title;
                    $description = $article['fields']['trailText'] ?? $description;
                    $url = $article['webUrl'] ?? $url;
                    $publishedAt = isset($article['webPublicationDate']) ? \Carbon\Carbon::parse($article['webPublicationDate']) : $publishedAt;
                    $imageUrl = $article['fields']['thumbnail'] ?? $imageUrl;
                    break;

                case 'NY Times':
                    $title = $article['title'] ?? $title;
                    $description = $article['abstract'] ?? $description;
                    $url = $article['url'] ?? $url;
                    $publishedAt = isset($article['published_date']) ? \Carbon\Carbon::parse($article['published_date']) : $publishedAt;
                    $imageUrl = $article['media'][0]['media-metadata'][0]['url'] ?? $imageUrl;
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
            ];
        }

        return $formattedNews;
    }

    public function getNews(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $news = News::paginate($perPage, ['*'], 'page', $page);
        return response()->json($news);
    }

    public function show($id)
    {
        $newsItem = News::find($id);

        if (!$newsItem) {
            return response()->json(['message' => 'News item not found'], 404);
        }

        return response()->json($newsItem);
    }
}
