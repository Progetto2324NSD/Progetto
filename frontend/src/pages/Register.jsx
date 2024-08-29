import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from "../api_vespe/axiosConfig";
import toast from "react-hot-toast";

//Stile
import 'bootstrap/dist/css/bootstrap.min.css';
import './stile/style.css';
import immagineLogin from '../utils/images/1.png';

//Componenti
import PasswordInput from '../components/PasswordInput';

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Caricamento
  const [loading, setLoading] = useState(false);

  //Hook per reindirizzare (DA RICORDARE PER LE ALTRE PAGINE)
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  function validatePassword(password) {
    // Regex per validare la password (CONTROLLARE SE LA STRINGA E' CORRETTA)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  }

  const submitHandler = async (e) => {

    e.preventDefault();

    //Caricamento a false, evito che in caso di errore rimanga inutilmente
    setLoading(false);

    //Verifico se i campi sono stati poplati
    if (!name || !email || !password) {
      toast.error("Compilare tutti i campi");
      return;
    }
  
    //Verifico che le password coincidono
    if (password !== confirmPassword) {
      toast.error("Le password non coincidono");
      return;
    }

    //Verifico che le mail sia valida
    if (!validateEmail(email)) {
      toast.error("Inserire un indirizzo mail valido");
      return;
    }

    /*
      Verifico che la password rispetti i parametri di sicurezza:
      - Almeno 8 caratteri;
      - Almeno una lettera minuscola;
      - Almeno una lettera maiuscola;
      - Almeno un numero;
      - Almeno un carattere speciale (!@#$%^&*(),.?":{}|<>);
    */
    if (!validatePassword(password)) {
      toast.error("Password non valida. Assicurati che contenga: \n - Almeno 8 caratteri \n - Almeno una lettera minuscola; \n - Almeno una lettera maiuscola; \n - Almeno un numero; \n - Almeno un carattere speciale ");
      return;
    }

    //Dati dell'utente da inviare (obs tutti)
    const userData = { 
      name, 
      email, 
      password 
    };

    try{
      // Chiamata API per la registrazione dell'utente
      const response = await axios.post('/user', userData, {
        withCredentials: true
      });

      localStorage.setItem('user', JSON.stringify(response.data));

      // Se la registrazione ha successo, mostra il caricamento
      // Mostra la rotellina di caricamento
      // Simula un ritardo per il caricamento di 1.5 secondi
      setLoading(true);  
      const loadingToast = toast.loading('Registrazione in corso...');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (response.status === 201) {
        toast.success("Registrazione avvenuta con successo", {
          id: loadingToast, // Aggiorna il toast di caricamento
        });
        // Reindirizzo alla dahboard (CONFRONTARSI PER AGGIUNGERE L'ETA' AL PRIMO ACCESSO(?))
        navigate('/Dashboard');
      }
    }catch(error){
      if (error.response && error.response.status === 400 && error.response.data.message === 'Utente già presente') {
        toast.error("L'utente è già registrato.");
      } else {
        toast.error("Errore durante la registrazione. Riprova più tardi.");
      }
    } finally {
      // Interrompi il caricamento
      setLoading(false);
    }

  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row border rounded-5 p-3 bg-white shadow box-area">
      <div className="col-md-6 right-box">
          <div className="row align-items-center">
            <div className="header-text mb-4">
              <h2>Registrati</h2>
              <p>Registrati per monitorare i tuoi allenamenti.</p>
            </div>

            <label className="form-label">Nome</label>
            <div className="input-group mb-3">
            <input 
              type="text" 
              className="form-control form-control-lg bg-light fs-6" 
              placeholder="Inserire il proprio nome"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <div className="input-group mb-3">
              <PasswordInput 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <label className="form-label">Conferma Password</label>
            <div className="input-group mb-3">
              {/* Verificare l'id del componente */}
              <PasswordInput
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group mb-3">
              <button 
                className="btn btn-lg btn-primary w-100 fs-6"
                onClick={submitHandler}
              >Registrati</button>

            </div>
            <div className="row">
              <small>Hai già un'account? <Link to="/"><a href="#">Accedi qui</a></Link></small>
            </div>
          </div>
        </div>
        <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
          <div className="featured-image mb-3">
            <img src={immagineLogin} className="img-fluid" alt="Login" />
          </div>
          <p className="text-white fs-2 be-verified-text">Registrati</p>
        </div>
      </div>
    </div>

  );
}

export default Register;
