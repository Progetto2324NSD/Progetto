import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../service/userService';  // Importa la funzione

//Stile
import 'bootstrap/dist/css/bootstrap.min.css';
import './stile/style.css';
import immagineLogin from '../utils/images/1.png';

//Componenti
import PasswordInput from '../components/PasswordInput';
import toast from "react-hot-toast";


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Inizializzo con l'Hook il caricamento
  const [loading, setLoading] = useState(false);

  //Hook per reindirizzare (DA RICORDARE PER LE ALTRE PAGINE)
  const navigate = useNavigate();

  //Confrontarsi sul Validate email per il login(PER ME SERVE)
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const submitHandler = async(e) => {
    
    e.preventDefault();

    //Caricamento a false, evito che in caso di errore rimanga inutilmente
    setLoading(false);

    //Verifico se i campi sono stati popolati
    if (!email || !password) {
      toast.error("Compilare tutti i campi");
      return;
    }

    //Verifico che le mail sia valida
    if (!validateEmail(email)) {
      toast.error("Inserire un indirizzo mail valido");
      return;
    }

    //Dati dell'utente da inviare
    const userData = { 
      email, 
      password 
    };

    try{
      const response = await loginUser(userData);  // Usa la funzione esterna

      localStorage.setItem('user', JSON.stringify(response.data));

      // Se la registrazione ha successo, mostra il caricamento
      // Mostra la rotellina di caricamento
      // Simula un ritardo per il caricamento di 1.5 secondi
      setLoading(true);  
      const loadingToast = toast.loading('Accesso in corso...');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (response.status === 200) {
        toast.success("Accesso avvenuto con successo", {
          id: loadingToast, // Aggiorna il toast di caricamento
        });
        // Reindirizzo alla dashboard (CONFRONTARSI PER AGGIUNGERE L'ETA' AL PRIMO ACCESSO(?))
        navigate('/Dashboard');
      }
    }catch(error){
      
      setLoading(false);

      if(error.response) {
        if(error.response.status === 401){
          const errorMessage = error.response.data.message;

          if(errorMessage === 'Utente non presente nel database') {
            toast.error("Utente non presente nel database.");
        } else if (errorMessage === 'Email o password non validi') {
            toast.error("Email o password non validi.");
        } else {
            toast.error("Errore durante l'accesso. Riprova più tardi.");
        }
        }else{
          toast.error("Errore durante l'accesso. Riprova più tardi.");
        }
      }

      /*
      if (error.response && error.response.status === 401 && error.response.data.message === 'TESTO ERRORE') {
        toast.error("Utente non presente nel database");
      } else {
        toast.error("Errore durante la registrazione. Riprova più tardi.");
      }
      */
    } finally {
      // Interrompi il caricamento
      setLoading(false);
    }

  }


  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">

      <div className="row border rounded-5 p-3 bg-white shadow box-area">
        <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
          <div className="featured-image mb-3">
            <img src={immagineLogin} className="img-fluid" alt="Login" />
          </div>
          <p className="text-white fs-2 be-verified-text">Accedi</p>
        </div>

        <div className="col-md-6 right-box">
          <div className="row align-items-center">
            <div className="header-text mb-4">
              <h2>Login</h2>
              <p>Accedi per monitorare i tuoi allenamenti.</p>
            </div>

            <label className="form-label">Email</label>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control form-control-lg bg-light fs-6" 
                placeholder="Inserire la propria email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                />
            </div>

            <label className="form-label">Password</label>
            <div className="input-group mb-1">
              <PasswordInput 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group mb-5 d-flex justify-content-between">
              <div className="forgot">
                <small> <Link to="/forgotPassword"><a href="#">Password dimenticata?</a></Link></small>
              </div>
            </div>
            <div className="input-group mb-3">
              <button 
                className="btn btn-lg btn-primary w-100 fs-6"
                onClick={submitHandler}
              >Login</button>
            </div>
            <div className="row">
              <small>Non hai un account? <Link to="/Register"><a href="#">Registrati qui</a></Link></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

