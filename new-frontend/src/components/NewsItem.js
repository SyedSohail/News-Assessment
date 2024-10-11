import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Typography, CardMedia, CircularProgress } from '@mui/material';
import Navbar from './Navbar';
import api from './../api';

const NewsItem = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await api.get(`/newsitem/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Navbar />
        <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '50px' }} />
      </Container>
    );
  }

  if (!news) {
    return (
      <Container>
        <Navbar />
        <Typography variant="h5" color="error" align="center" sx={{ marginTop: '20px' }}>
          News item not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <Card sx={{ marginTop: '20px' }}>
        <CardMedia
          component="img"
          alt={news.title}
          height="300"
          image={news.image_url || 'default-image-url.jpg'}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {news.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {news.description}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Source: {news.source || 'Unknown'}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Published at: {new Date(news.published_at).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewsItem;
