import React, { useEffect, useState } from 'react';
import "../pages/stile/style.css";
import { useNavigate } from 'react-router-dom';
import otpService from '../service/otpService';
import { MuiOtpInput } from 'mui-one-time-password-input';
import toast from 'react-hot-toast';
import { useTimer } from 'use-timer';

//AGGIUSTARE IL CODICE E LA FORMATTAZIONE. IMPLEMENTARE IL NUMERO MASSIMO DI INVIO DI OTP PER GIORNO

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

    const handleChange = (newValue) => {
        setOtp(newValue);
    };

    const submitHandler = async () => {
        try {
            const response = await otpService.verificaOtp({ otp, email });

            // Avvia il timer quando OTP viene verificato con successo
            reset();
            start();


            toast.success("OTP verificato con successo");
            //AGGIUNGERE FUNZIONE GRAFICA DI CARICAMENTO DI 2/3 SECONDI PER POI REINDIRIZZARE VERSO LA PAGINA DI CAMBIO PASSWORD
            setTimeout(() => {
                navigate('/ResetPassword');
            }, 1500); // 1500 ms = 1,5 secondi
        } catch (error) {
            //RI-VERIFICARE SE GLI ERRORI VENGONO STAMPATI CORRETTAMENTE
            toast.error(error.message || "Errore durante la verifica dell'OTP.");
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

                    {/*SISTEMARE IL TIMER NON IN SECONDI MA MINUTI E SECONDI E LA FORMATTAZIONE*/}
                    {status === 'RUNNING' && (
                        <div>
                            <p>Codice OTP valido ancora per: {time} secondi </p>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default PopupOTP;
