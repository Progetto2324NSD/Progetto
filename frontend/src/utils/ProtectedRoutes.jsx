import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from '../api_vespe/axiosConfig';

const ProtectedRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const checkAuth = async () => {
      try {
        const response = await axios.get('/user/auth', {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser(response.data); // I dati dell'utente sono già in response.data
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Errore durante la verifica del token:', error);
        setUser(null);
      } finally {
        setLoading(false); // Imposta lo stato di caricamento su false
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div></div>; // Mostra un loader o simile mentre si verifica il token
  }

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
