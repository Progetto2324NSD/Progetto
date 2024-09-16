import axios from "../api_vespe/axiosConfig";

//Chiamata API per il reset della password
export const resetPassword = async (email) => {
    try {
        const response = await axios.post('/user/reset-password', { email });
        return response;
    } catch (error) {
        console.error("Errore durante il reset della password:", error);
        throw error;  // Propaga l'errore affinché possa essere gestito dal chiamante
    }
};

//Chiamata API per il login dell'utente
export const loginUser = async (userData) => {
    try {
        const response = await axios.post('https://progetto.onrender.com/user/login', userData, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error("Errore durante l'accesso:", error);
        throw error;  // Propaga l'errore affinché possa essere gestito dal chiamante
    }
};


//Chiamata API per il controllo dell'OTP
export const verificaOTP = async (otp, email) => {
    try {
        const response = await axios.post('/user/verificaOTP', { otp, email }, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error("Errore durante la verifica dell'OTP:", error);
        throw error;  // Propaga l'errore affinché possa essere gestito dal chiamante
    }
};

//Chiamata API per la registrazione dell'utente
export const registerUser = async (userData) => {
    try {
        const response = await axios.post('/user', userData, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  // Propaga l'errore per essere gestito nel componente chiamante
    }
};

//Chiamata API per il cambio della password
export const cambiaPassword = async (email, password) => {
    try {
        const response = await axios.post('/user/cambia-password', { email, password }, { 
            withCredentials: true });
        return response;
    } catch (error) {
        throw error;  // Propaga l'errore per essere gestito nel componente chiamante
    }
};

//Chiamata API per la creazione dell'utente
export const createUser = async (name, email, password) => {
    try {
        const response = await axios.post('/user/', { name, email, password}, { 
            withCredentials: true });
        return response;
    } catch (error) {
        throw error;  // Propaga l'errore per essere gestito nel componente chiamante
    }
};

//Chiamata API per richiedere la data
export const getData = async () => {
    try {
        const response = await axios.get('/user/data', { 
            withCredentials: true });
        return response;
    } catch (error) {
        throw error;  // Propaga l'errore per essere gestito nel componente chiamante
    }
};

//Chiamata API per l'invio della mail dell'OTP
export const mailOTP = async(email) => {
    try {
        const response = await axios.post('/user/reset-password', { email}, { 
            withCredentials: true });
        return response;
    } catch (error) {
        throw error;  // Propaga l'errore per essere gestito nel componente chiamante
    }
};

//Funzione per effettuare il logout
export const logout = async() => {
    try {
       const response = await axios.post('/user/logout', {},  { 
            withCredentials: true });
        return response;
    } catch (error) {
        throw error;  // Propaga l'errore per essere gestito nel componente chiamante
    }
};

export const auth = async() => {
    try{
        const response = await axios.get('/user/auth', {
            withCredentials: true
        });
        return response;
    }catch(error){
        throw error;
    }
};