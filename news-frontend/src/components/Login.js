import React, { useState, useContext } from 'react';
import { TextField, Button, InputAdornment, IconButton, Box, Typography, Alert } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const validationSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password should be at least 6 characters long').required('Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      const response = await api.post('/login', values);
      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/newsList');
    } catch (error) {
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 4, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', width: 400 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Typography variant="h5" fontWeight="bold">Welcome Back</Typography>
          <Typography variant="body2" color="textSecondary">Log in to your account</Typography>
        </Box>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                margin="normal"
                variant="outlined"
                error={Boolean(values.email && <ErrorMessage name="email" />)}
                helperText={<ErrorMessage name="email" />}
              />
              <Field
                as={TextField}
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end" aria-label="toggle password visibility">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                margin="normal"
                variant="outlined"
                error={Boolean(values.password && <ErrorMessage name="password" />)}
                helperText={<ErrorMessage name="password" />}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                color="primary"
                sx={{ backgroundColor: '#4A00E0', marginTop: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          )}
        </Formik>
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#4A00E0', marginLeft: 5 }}>Register</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
