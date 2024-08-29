import React from "react";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "../api_vespe/axiosConfig";

//Componenti
import PasswordInput from "../components/PasswordInput";

//Stile
import "./stile/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import immagineReset from '../utils/images/reset.png';
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";


function Reset() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation(); 
    const email = location.state?.email;

    function validatePassword(password) {
        // Regex per validare la password (CONTROLLARE SE LA STRINGA E' CORRETTA)
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return regex.test(password);
    }

    const submitHandler = async (e) => {

        try{
            e.preventDefault();

            if (password !== confirmPassword) {
                toast.error("Le password non coincidono");
                return;
            }

            if (!validatePassword(password)) {
                toast.error("Password non valida. Assicurati che contenga: \n - Almeno 8 caratteri \n - Almeno una lettera minuscola; \n - Almeno una lettera maiuscola; \n - Almeno un numero; \n - Almeno un carattere speciale ");
                return;
            }

            const response = await axios.post('/user/cambia-password', { email, password }, { withCredentials: true});

            if (response.status === 200) {
                toast.success("Password aggiornata con successo");
                setTimeout(() => {
                    navigate('/Dashboard');
                }, 1500); // 1500 ms = 1,5 secondi
            }
        }catch(error){
            toast.error("Errore durante la registrazione. Riprova più tardi.");
        }
    
    }

    return (

    <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row border rounded-5 p-3 bg-white shadow box-area">
            <div className="col-md-6 right-box">
                <div className="row align-items-center">
                    <div className="header-text mb-4">
                        <h2>Cambia Password</h2>
                        <p>Compila i campi per aggiornare la password dell'account.</p>
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
                        >Cambia Password</button>

                        </div>
                        <div className="row">
                        <small>Ti ricordi la password? <Link to="/"><a href="#">Accedi qui</a></Link></small>
                        </div>
                </div>
            </div>
            <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
          <div className="featured-image mb-3">
            <img src={immagineReset} className="img-fluid" alt="Login" />
          </div>
          <p className="text-white fs-2 be-verified-text">Password</p>
        </div>
        </div>
    </div>
    );
}

export default Reset;
