import axios from "../api_vespe/axiosConfig";

//Chiamata API per la registrazione del workout
export const registerWorkout = async (workoutData) => {
    try {
        const response = await axios.post('/workout', workoutData, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per la mostrare i workout in base alla data inserita
export const showWorkout = async (date) => {
    try {
        const response = await axios.get(`/workout/show-workout?date=${date}`, {
            withCredentials: true
        });
        return response.data; // Restituisce solo i dati dell'API
    } catch (error) {
        throw error; // Gestione degli errori
    }
};


//Chiamata API per il percorso dell'ultimo workout
export const lastWorkout = async () => {
    try {
        const response = await axios.get('/workout/last-workout', {
            withCredentials: true
        });
        return response.data; // Restituisce solo i dati dell'API
    } catch (error) {
        throw error; // Gestione degli errori
    }
};