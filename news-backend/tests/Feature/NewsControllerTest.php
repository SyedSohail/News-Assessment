<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NewsControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function authenticate()
    {
        $token = $this->user->createToken('TestToken')->plainTextToken;
        $this->withHeaders(['Authorization' => 'Bearer ' . $token]);
    }

    public function test_get_news()
    {
        $this->authenticate();

        News::factory()->count(3)->create();

        $response = $this->get('/api/news?per_page=2&page=1');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json()['data']);
        
        $this->assertEquals(3, $response->json()['total']);
        $this->assertEquals(1, $response->json()['current_page']);
    }

    public function test_get_news_by_source()
    {
        $this->authenticate();

        News::factory()->create(['source' => 'NewsAPI']);
        News::factory()->create(['source' => 'The Guardian']);
        News::factory()->create(['source' => 'NY Times']);

        $response = $this->get('/api/news?source=NewsAPI');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json()['data']);
    }

    public function test_show_news()
    {
        $this->authenticate();

        $newsItem = News::factory()->create();

        $response = $this->get('/api/newsitem/' . $newsItem->id);

        $response->assertStatus(200);
        $this->assertJson($response->getContent());
        $this->assertEquals($newsItem->id, $response->json()['id']);
    }

}
