import React, { useState, useEffect } from "react";

//Import React
import { Link } from 'react-router-dom';

//Immagini
import immagineForgot from "../utils/images/forgotPass.png";

//Libreria
import toast from "react-hot-toast";

// Importa il componente `PopupOTP` dalla directory corrente (`./PopupOTP`).
import PopOTP from "./PopupOTP";

// Funzione che invia la richiesta
import { resetPassword } from "../service/userService"; 

function Forgot() {
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);    
    const [attemptsLeft, setAttemptsLeft] = useState(5);

    // Funzione per gestire il limite giornaliero di invii
    const checkResetAttempts = (email) => {
        const storedData = localStorage.getItem(email);
        const currentDate = new Date().toDateString();

        if (storedData) {
            const { count, lastRequestDate } = JSON.parse(storedData);
            
            // Se la data è quella corrente, controlliamo il numero di tentativi rimanenti
            if (lastRequestDate === currentDate) {
                setAttemptsLeft(5 - count);
                if (count >= 5) {
                    toast.error("Hai raggiunto il limite giornaliero di 5 richieste.");

                    // Disabilita il bottone
                    setIsSubmitting(true); 
                    return false; 
                }
            } else {
                localStorage.setItem(email, JSON.stringify({ count: 0, lastRequestDate: currentDate }));
                setAttemptsLeft(5);
            }
        } else {
            localStorage.setItem(email, JSON.stringify({ count: 0, lastRequestDate: currentDate }));
            setAttemptsLeft(5);
        }
        // Permetti invio
        return true; 
    };

    // Funzione per aggiornare i tentativi nel localStorage
    const updateResetAttempts = (email) => {
        const storedData = localStorage.getItem(email);
        const { count, lastRequestDate } = JSON.parse(storedData);
        const newCount = count + 1;

        localStorage.setItem(email, JSON.stringify({ count: newCount, lastRequestDate }));
        setAttemptsLeft(5 - newCount); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkResetAttempts(email)) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await resetPassword(email);  
    
            if (response.status === 200) {
                let countdown = 3;
                const countdownToast = toast.loading(`Email inviata con successo. \n Il pop-up si aprirà tra: ${countdown} secondi...`, {
                    duration: 3000,
                });

                const interval = setInterval(() => {
                    countdown -= 1;
                    toast.loading(`Email inviata con successo. \n Il pop-up si aprirà tra: ${countdown} secondi...`, {
                        id: countdownToast,
                    });
                }, 1000);

                setTimeout(() => {
                    clearInterval(interval);

                    toast.dismiss(countdownToast);

                    setShowModal(true);  
                    setIsSubmitting(false); 
                }, 3000);

                updateResetAttempts(email);

            } else {
                toast.error("Errore durante l'invio dell'email.");
                setIsSubmitting(false); 
            }
        } catch (error) {
            console.error("Errore durante il reset della password:", error);
            const errorMessage = error.response?.data?.message || "Errore durante il reset della password. Verifica la tua email e riprova.";
            toast.error(errorMessage);
            setIsSubmitting(false); 
        }
    }

    useEffect(() => {
        if (email) {
            checkResetAttempts(email);
        }
    }, [email]);

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row border rounded-5 p-3 bg-white shadow box-area">
                <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
                    <div className="featured-image mb-3">
                        <img src={immagineForgot} className="img-fluid" alt="Login" />
                    </div>
                    <p className="text-white fs-2 be-verified-text">Reset Password</p>
                </div>

                <div className="col-md-6 right-box">
                    <div className="row align-items-center">
                        <div className="header-text mb-4">
                            <h2>Password dimenticata?</h2>
                            <p>Inserisci la mail per richiedere il reset della password.</p>
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

                        <div className="input-group mb-5 d-flex justify-content-between">
                            <div className="forgot">
                                <small>Accedi qui <Link to="/"><a href="#">Login</a></Link></small>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <button 
                                className="btn btn-lg btn-primary w-100 fs-6"
                                onClick={handleSubmit}
                                disabled={isSubmitting} 
                            >
                                Reset
                            </button>
                        </div>
                        <div className="row">
                            <small>Non hai un account? <Link to="/Register"><a href="#">Registrati qui</a></Link></small>
                        </div>
                    </div>
                </div>
            </div>
            <PopOTP
                isVisible={showModal}
                onClose={() => setShowModal(false)}
                email={email}
            />  
        </div>
    );
}

export default Forgot;

