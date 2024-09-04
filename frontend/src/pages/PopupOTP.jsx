import React, { useEffect, useState } from 'react';
import "../pages/stile/style.css";
import { useNavigate } from 'react-router-dom';
import { MuiOtpInput } from 'mui-one-time-password-input';
import toast from 'react-hot-toast';
import { useTimer } from 'use-timer';
import axios from "../api_vespe/axiosConfig";

const PopupOTP = ({ isVisible, onClose, email }) => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const { time, start, reset, status } = useTimer({
        initialTime: 300000, // 5 minuti in millisecondi
        timerType: 'DECREMENTAL',
        autostart: false // Avvio manuale
    });

    useEffect(() => {
        if (isVisible) {
            start();
        } else {
            reset();
        }
    }, [isVisible, start, reset]);

    useEffect(() => {
        console.log("Stato timer:", status);
        console.log("Tempo rimanente:", time);
    }, [status, time]);

    const formatTime = (milliseconds) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleChange = (newValue) => {
        setOtp(newValue);
    };

    const submitHandler = async () => {
        try {
            const response = await axios.post('/user/verificaOTP', { otp, email }, {
                withCredentials: true
            });

            if (response.status === 200) {
                toast.success("OTP verificato con successo.");
                const loadingTime = 1500; // Ritardo di 1.5 secondi
                setTimeout(() => {
                    navigate('/ResetPassword', { state: { email } });
                }, loadingTime);
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message;

                switch (errorMessage) {
                    case 'Utente non trovato':
                        toast.error("Utente non trovato.");
                        break;
                    case 'OTP non valido':
                        toast.error("OTP non valido.");
                        break;
                    case 'OTP scaduto':
                        toast.error("OTP scaduto.");
                        break;
                    default:
                        toast.error("Errore durante l'accesso. Riprova più tardi.");
                }
            } else {
                toast.error("Errore durante l'accesso. Riprova più tardi.");
            }
        }
    };

    const handleClose = () => {
        setOtp('');
        onClose();
    };

    return (
        isVisible && (
            <div className="otp-modal-overlay">
                <div className="otp-modal">
                    <span className="close-icon" onClick={handleClose}>&times;</span>
                    <h3>Inserire il codice OTP ricevuto tramite mail</h3>
                    <div className="otp-input-container">
                        <MuiOtpInput 
                            value={otp} 
                            onChange={handleChange}
                            numInputs={4}
                        />
                    </div>
                    <div>
                        <button id="submit-btn" className="btn btn-lg btn-primary" onClick={submitHandler}>Invia</button>
                    </div>

                    {/* Visualizzazione del timer in minuti e secondi */}
                    {status === 'RUNNING' && (
                        <div>
                            <p>Codice OTP valido ancora per: {formatTime(time)}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default PopupOTP;

