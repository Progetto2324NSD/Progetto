import React, { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "../../api_vespe/axiosConfig";
import immagineForgot from "../../utils/images/forgotPass.png";
import toast from "react-hot-toast";
import PopOTP from "../../components/PopupOTP";

function Forgot() {
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Nuovo stato per gestire il bottone

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Imposta il bottone come disabilitato e avvia il finto caricamento
        setIsSubmitting(true);

        try {
            const response = await axios.post('/user/reset-password', { email });
    
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
                    toast.dismiss(countdownToast);  // Rimuove il toast del countdown
                    setShowModal(true);  // Mostra il popup per inserire l'OTP
                    setIsSubmitting(false); // Riabilita il bottone
                }, 3000);
            } else {
                toast.error("Errore durante l'invio dell'email.");
                setIsSubmitting(false); // Riabilita il bottone anche in caso di errore
            }
        } catch (error) {
            console.error("Errore durante il reset della password:", error);
            const errorMessage = error.response?.data?.message || "Errore durante il reset della password. Verifica la tua email e riprova.";
            toast.error(errorMessage);
            setIsSubmitting(false); // Riabilita il bottone in caso di errore
        }
    }

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
                                disabled={isSubmitting} // Disabilita il bottone se isSubmitting è true
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
