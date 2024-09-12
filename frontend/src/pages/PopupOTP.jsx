import React, { useEffect, useState } from 'react';
import "../pages/stile/style.css";
import { useNavigate } from 'react-router-dom';
import { MuiOtpInput } from 'mui-one-time-password-input';
import toast from 'react-hot-toast';
import { verificaOTP } from '../service/userService';
 
 
const PopupOTP = ({ isVisible, onClose, email }) => {
    const [otp, setOtp] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(300000); // 5 minuti in millisecondi
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (isVisible) {
            timer = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 1000; // Decrementa di 1 secondo
                });
            }, 1000);
        } else {
            clearInterval(timer);
            setTimeRemaining(300000); // Reset del tempo
        }

        return () => clearInterval(timer); // Pulisce l'intervallo al dismount
    }, [isVisible]);

    const formatTime = (milliseconds) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleChange = (newValue) => {
        console.log('Nuovo valore OTP:', newValue);
        setOtp(newValue);
    };
 
    const submitHandler = async () => {
        try {
            const response = await verificaOTP(otp, email);

            if (response.status === 200) {
                toast.success("OTP verificato con successo.");
                const loadingTime = 1500;
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
                    {timeRemaining > 0 && (
                        <div className="otp-timer">
                            <p>Codice OTP valido ancora per: {formatTime(timeRemaining)}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default PopupOTP;

