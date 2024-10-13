import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true);
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || isRedirecting) {
    return <div>Loading...</div>;
  }

  return user ? children : null;
};

export default PrivateRoute;
