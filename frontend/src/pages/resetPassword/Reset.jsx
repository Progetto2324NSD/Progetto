import React from "react";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

//Componenti
import PasswordInput from "../../components/PasswordInput";

//Stile
import "../stile/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import immagineReset from '../../utils/images/reset.png';


function Reset() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const submitHandler = async (e) => {

        e.preventDefault();
    
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
