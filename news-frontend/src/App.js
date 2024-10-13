import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import { Container } from '@mui/material';
import NewsList from './components/NewsList';
import NewsItem from './components/NewsItem';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Container>
            <Routes>
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/newsList" 
                element={
                  <PrivateRoute>
                    <NewsList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/news/:id" 
                element={
                  <PrivateRoute>
                    <NewsItem />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
