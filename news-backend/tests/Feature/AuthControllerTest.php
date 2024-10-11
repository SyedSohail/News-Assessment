<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_registration()
    {
        $response = $this->post('/api/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(201);
        $this->assertCount(1, User::all());
    }

    public function test_user_login_success()
    {
        User::factory()->create([
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->post('/api/login', [
            'email' => 'john@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $this->assertArrayHasKey('token', $response->json());
    }

    public function test_user_login_failed()
    {
        $response = $this->post('/api/login', [
            'email' => 'unknown@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    public function test_get_authenticated_user()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/api/user');

        $response->assertStatus(200);
        $this->assertArrayHasKey('user', $response->json());
    }

    public function test_user_logout()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->post('/api/logout');

        $response->assertStatus(200);
        $this->assertCount(0, $user->tokens);
    }
}
