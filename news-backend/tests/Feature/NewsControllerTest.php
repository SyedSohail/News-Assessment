<?php

namespace Tests\Unit;

use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NewsControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_fetch_and_store_news_successfully()
    {
        Http::fake([
            'newsapi.org/*' => Http::sequence()->push(['articles' => [['title' => 'News 1', 'url' => 'http://example.com/news1', 'description' => 'Description 1']]]),
            'content.guardianapis.com/*' => Http::sequence()->push(['response' => ['results' => [['webTitle' => 'Guardian News', 'webUrl' => 'http://guardian.com/news', 'fields' => ['trailText' => 'Description Guardian']]]]]),
            'api.nytimes.com/*' => Http::sequence()->push(['results' => [['title' => 'NY Times News', 'url' => 'http://nytimes.com/news', 'abstract' => 'Abstract NY Times']]]),
        ]);

        $response = $this->get('/api/news/fetch');

        $response->assertStatus(200);
        $this->assertCount(3, News::all());
    }

    public function test_get_news()
    {
        News::factory()->count(3)->create();

        $response = $this->get('/api/news?per_page=2&page=1');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json()['data']);
    }

    public function test_get_news_by_source()
    {
        News::factory()->create(['source' => 'NewsAPI']);
        News::factory()->create(['source' => 'The Guardian']);
        News::factory()->create(['source' => 'NY Times']);

        $response = $this->get('/api/news/source/NewsAPI');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json()['data']);
    }

    public function test_delete_all_news()
    {
        News::factory()->count(5)->create();

        $response = $this->delete('/api/news/delete-all');

        $response->assertStatus(200);
        $this->assertCount(0, News::all());
    }

    public function test_show_news()
    {
        $newsItem = News::factory()->create();

        $response = $this->get('/api/news/' . $newsItem->id);

        $response->assertStatus(200);
        $this->assertJson($response->getContent());
    }
}
