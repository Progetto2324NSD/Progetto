import axios from 'axios';

// Crea un'istanza di Axios
const instance = axios.create({
  baseURL: 'https://progetto.onrender.com/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Aggiungi un'interceptor di richiesta
instance.interceptors.request.use(
  (config) => {
    // Ottieni il token dal localStorage
    const token = localStorage.getItem('authToken');

    // Se il token esiste, aggiungilo all'intestazione Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
