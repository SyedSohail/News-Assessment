import React, { useState } from 'react';
import { TextField, Button, InputAdornment, IconButton, Box, Typography, Alert } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Person } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import api from './../api'; 
import { useNavigate, Link } from 'react-router-dom'; 

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password should be at least 6 characters long').required('Password is required'),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (values) => {
    try {
      const response = await api.post('/register', values);
      console.log('Registration successful', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/newsList');
    } catch (error) {
      console.error('Error registering:', error);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 4, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', width: 400 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Create an Account</Typography>
          <Typography variant="body2" color="textSecondary">Sign up to get started</Typography>
        </Box>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, touched, errors }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                margin="normal"
                variant="outlined"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && <ErrorMessage name="name" />}
              />

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
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && <ErrorMessage name="email" />}
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
                      <IconButton onClick={handleClickShowPassword} edge="end" aria-label="toggle password visibility">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                margin="normal"
                variant="outlined"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && <ErrorMessage name="password" />}
              />

              <Button fullWidth variant="contained" type="submit" color="primary" sx={{ backgroundColor: '#4A00E0', marginTop: 2 }}>
                Register
              </Button>
            </Form>
          )}
        </Formik>

        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Typography variant="body2">
            Already have an account? 
            <Link to="/login" style={{ textDecoration: 'none', color: '#4A00E0', marginLeft: 5 }}>Login</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
