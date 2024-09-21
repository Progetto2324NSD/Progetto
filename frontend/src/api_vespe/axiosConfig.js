import axios from 'axios';

// Crea un'istanza di Axios
const instance = axios.create({
  //URL per le API (RICORDARSI DI CAMBIARLO PER IL DEPLOTMENT)
  baseURL: 'https://progettobackend.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});


export default instance;
