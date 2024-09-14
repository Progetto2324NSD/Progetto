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
    const [isSubmitting, setIsSubmitting] = useState(false); // Stato per gestire il bottone
    const [attemptsLeft, setAttemptsLeft] = useState(5); // Stato per tenere traccia degli invii rimanenti

    // Funzione per gestire il limite giornaliero di invii
    const checkResetAttempts = (email) => {
        const storedData = localStorage.getItem(email);
        const currentDate = new Date().toDateString(); // Otteniamo solo la data corrente (senza ora)

        if (storedData) {
            const { count, lastRequestDate } = JSON.parse(storedData);
            
            // Se la data è quella corrente, controlliamo il numero di tentativi rimanenti
            if (lastRequestDate === currentDate) {
                setAttemptsLeft(5 - count);
                if (count >= 5) {
                    toast.error("Hai raggiunto il limite giornaliero di 5 richieste.");
                    // Disabilita il bottone
                    setIsSubmitting(true); 
                    // Limite raggiunto, blocca invio
                    return false; 
                }
            } else {
                // Se la data è diversa, resettiamo il conteggio per il nuovo giorno
                localStorage.setItem(email, JSON.stringify({ count: 0, lastRequestDate: currentDate }));
                setAttemptsLeft(5);
            }
        } else {
            // Nessun dato salvato, inizializziamo per questa email
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

        // Aggiorna i dati nel localStorage
        localStorage.setItem(email, JSON.stringify({ count: newCount, lastRequestDate }));
        // Aggiorna tentativi rimanenti
        setAttemptsLeft(5 - newCount); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkResetAttempts(email)) {
            // Se il limite è stato raggiunto, blocchiamo l'invio
            return;
        }

        setIsSubmitting(true);

        try {
            // Usa la funzione di servizio esterna
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
                    // Rimuove il toast del countdown
                    toast.dismiss(countdownToast);  
                    // Mostra il popup per inserire l'OTP
                    setShowModal(true);  
                    // Riabilita il bottone
                    setIsSubmitting(false); 
                }, 3000);

                // Aggiorna il numero di tentativi
                updateResetAttempts(email);

            } else {
                toast.error("Errore durante l'invio dell'email.");
                // Riabilita il bottone anche in caso di errore
                setIsSubmitting(false); 
            }
        } catch (error) {
            console.error("Errore durante il reset della password:", error);
            const errorMessage = error.response?.data?.message || "Errore durante il reset della password. Verifica la tua email e riprova.";
            toast.error(errorMessage);
            // Riabilita il bottone in caso di errore
            setIsSubmitting(false); 
        }
    }

    // Controlla i tentativi rimanenti al montaggio del componente
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
                                // Disabilita il bottone se isSubmitting è true
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

