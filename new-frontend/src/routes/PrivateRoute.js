import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); // Assuming `loading` is provided by AuthContext
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false); // State to track redirection

  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true); // Set redirection state
      navigate('/'); // Redirect to login if the user is not logged in
    }
  }, [user, loading, navigate]);

  if (loading || isRedirecting) {
    return <div>Loading...</div>; // Optionally render a loading spinner or message
  }

  return user ? children : null; // Only render children if the user is logged in
};

export default PrivateRoute;
