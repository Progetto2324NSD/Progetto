import axios from 'axios';

const verificaOtp = async ({ otp, email }) => {
    try {
        const response = await axios.post('http://localhost:5000/user/verificaOTP', { otp, email });
        return response.data; // Ritorna i dati della risposta
    } catch (error) {
        // Controlla se l'errore è un errore di risposta del server
        if (error.response) {
            // Se la risposta contiene un messaggio di errore
            const message = error.response.data?.message || 'Errore sconosciuto';
            throw new Error(message);
        } else if (error.request) {
            // Se la richiesta è stata effettuata ma senza risposta
            throw new Error('Problema con la richiesta, per favore riprova.');
        } else {
            // Altri errori
            throw new Error('Si è verificato un errore durante la verifica dell\'OTP.');
        }
    }
};

const otpService = { verificaOtp };

export default otpService;
