import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CircularProgress, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import api from '../api';
import Filters from './common/Filters';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [sources] = useState(['NewsAPI', 'The Guardian', 'NY Times']);

  useEffect(() => {
    fetchNews();
  }, [search, source, date]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/news', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          search: search,
          source: source,
          date: date,
        }
      });
      setNews(response.data.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        search={search}
        setSearch={setSearch}
        source={source}
        setSource={setSource}
        date={date}
        setDate={setDate}
        sources={sources}
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
    </Container>
  );
};

export default NewsList;
