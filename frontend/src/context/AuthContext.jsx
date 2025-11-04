import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import Loading from '../components/Loading';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app load, check if user is already logged in (via cookie)
    const checkUser = async () => {
      try {
        // We need a '/me' endpoint to verify the cookie
        const res = await axios.get('/api/auth/me');
        setAuthInfo(res.data);
      } catch (err) {
        setAuthInfo(null); // No valid session
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return <Loading />; // Show global loader while checking session
  }

  return (
    <AuthContext.Provider value={{ authInfo, setAuthInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};