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



// Funzione per eliminare un allenamento
export const deleteWorkout = async (id) => {
    try {
        const response = await axios.delete(`/workout/delete-workout${id}`);
        return response.data; // Assicurati di gestire correttamente la risposta
    } catch (error) {
        console.error("Errore durante l'eliminazione dell'allenamento", error);
        throw error; // Rilancia l'errore in modo che venga gestito nel componente
    }
};