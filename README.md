# News and Authentication API

## Overview

This project consists of two separate APIs: **News API** and **Authentication API**. Both APIs are designed to work together to provide a complete solution for managing news articles and user authentication. Each API is containerized using Docker, allowing for easy deployment and management.

## Features

### News API

- **Fetch News Articles**: Pulls news articles from various sources (NewsAPI, The Guardian, NY Times).
- **Store News Articles**: Saves fetched articles in the database.
- **Get News Articles**: Retrieve paginated news articles.

### Authentication API

- **User Registration**: Allows new users to register with a name, email, and password.
- **User Login**: Authenticates users and provides a JWT token for secure access.
- **Get Authenticated User**: Retrieves information about the currently logged-in user.
- **User Logout**: Logs out the user and invalidates their token.

Prerequisites
Docker
Docker Compose
Make sure you have Docker and Docker Compose installed on your machine. You can download them from the Docker website.

Running the Projects
News API
Navigate to the News API directory:

bash
cd news-backend
Build and run the Docker container:

bash
docker compose up --build
Access the API:

The News API will be running at http://localhost:8000. You can use tools like Postman or curl to make requests to the API.

API Endpoints:

Fetch and store news: POST /api/news/fetch
Get news articles: GET /api/news?per_page=2&page=1
User registration: POST /api/register
User login: POST /api/login
User logout: POST /api/logout

Running the Frontend Projects
Navigate to the News Frontend directory:

bash
cd news-frontend
Build and run the Docker container:

bash
docker compose up --build

The News Frontend will be running at http://localhost:3000.
