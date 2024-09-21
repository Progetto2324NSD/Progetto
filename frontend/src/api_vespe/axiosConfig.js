import axios from 'axios';

// Crea un'istanza di Axios
const instance = axios.create({
  //URL per le API (RICORDARSI DI CAMBIARLO PER IL DEPLOTMENT)
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});


export default instance;
