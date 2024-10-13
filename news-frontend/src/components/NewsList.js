import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CircularProgress, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import api from '../api';
import Filters from './common/Filters';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', source: '', date: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sources = ['NewsAPI', 'The Guardian', 'NY Times'];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [filters, page]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/news', {
        params: {
          search: filters.search,
          source: filters.source,
          date: filters.date,
          category: filters.category,
          page,
        }
      });

      const newArticles = response.data.data;
      setNews(prevNews => deduplicateNews([...prevNews, ...newArticles]));
      
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deduplicateNews = (newsArray) => {
    const uniqueArticles = new Map();
    newsArray.forEach(article => {
      uniqueArticles.set(article.id, article);
    });
    return Array.from(uniqueArticles.values());
  };

  const handleScroll = useCallback(() => {
    const isBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1;
    
    if (isBottom && !loading && page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, totalPages, page]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (loading && page === 1) {
    return (
      <Container>
        <Navbar />
        <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '50px' }} />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <Typography variant="h4" gutterBottom sx={{ marginTop: '20px', textAlign: 'center' }}>
        Latest News
      </Typography>
      <Filters
        filters={filters}
        setFilters={setFilters}
        sources={sources}
        categories={categories}
      />
      <Grid container spacing={4}>
        {news.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
              {item.image_url ? (
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image_url}
                  alt={item.title}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <CardMedia
                  component="div"
                  height="180"
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'grey.200' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No Image Available
                  </Typography>
                </CardMedia>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {item.title || "No Title"}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description?.slice(0, 100) || "No Description Available"}...
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Source: {item.source || "Unknown"}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Published at: {new Date(item.published_at).toLocaleDateString() || "N/A"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to={`/news/${item.id}`} 
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />}
    </Container>
  );
};

export default NewsList;