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
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(201);
        $this->assertCount(1, User::all());
        $this->assertEquals('John Doe', User::first()->name);
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
        $this->assertNotEmpty($response->json('token'));
    }

    public function test_user_login_failed()
    {
        $response = $this->post('/api/login', [
            'email' => 'unknown@example.com',
            'password' => 'wrongpassword',
        ]);
    
        $response->assertStatus(401);
        $this->assertEquals('Invalid credentials', $response->json('message'));
    }

    public function test_get_authenticated_user()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/api/user');

        $response->assertStatus(200);
        $this->assertArrayHasKey('user', $response->json());
        $this->assertEquals($user->id, $response->json('user.id'));
    }

    public function test_user_logout()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->post('/api/logout');

        $response->assertStatus(200);
        $this->assertCount(0, $user->tokens);
    }

    public function test_user_registration_validation()
    {
        $response = $this->post('/api/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
            'password_confirmation' => '1234'
        ]);

        $response->assertStatus(422);
        $this->assertArrayHasKey('errors', $response->json());
        $this->assertCount(3, $response->json('errors'));
        $this->assertEquals('The name field is required.', $response->json('errors.name.0'));
        $this->assertEquals('The email must be a valid email address.', $response->json('errors.email.0'));
        $this->assertEquals('The password must be at least 8 characters.', $response->json('errors.password.0'));
    }
}
