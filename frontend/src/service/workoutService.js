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


//Chiamata API per eliminare un allenamento
export const deleteWorkout = async (id) => {
    try {
        const response = await axios.delete(`/workout/delete-workout${id}`);
        return response.data; // Assicurati di gestire correttamente la risposta
    } catch (error) {
        console.error("Errore durante l'eliminazione dell'allenamento", error);
        throw error; // Rilancia l'errore in modo che venga gestito nel componente
    }
};

//Chiamata API per la creazione del workout
export const createWorkout = async(workout) => {
    try {
        const response = await axios.post('/workout/', workout, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per indicare il tempo di allenamento nel giorno corrente
export const timeDayWorkout = async() => {
    try {
        const response = await axios.get('/workout/time-oggi', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per indicare la distanza percorsa nel giorno corrente
export const distanceDayWorkout = async() => {
    try {
        const response = await axios.get('/workout/distance-oggi', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per indicare gli allenamenti svolti nel giorno corrente
export const numDayWorkout = async() => {
    try {
        const response = await axios.get('/workout/num-oggi', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per indicare la velocità media allenamento nel giorno corrente
export const avgDayWorkout = async() => {
    try {
        const response = await axios.get('/workout/avg-oggi', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per indicare il grafico dei tipi di workouts
export const graficoAllenamenti = async() => {
    try {
        const response = await axios.get('/workout/tipo-allenamenti', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per indicare il grafico del tempo di workout mese x mese workoudei tipi dts
export const graficoTempo = async() => {
    try {
        const response = await axios.get('/workout/tempo-allenamenti', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per indicare il grafico dei tipi di workouts in base alla velocità
export const graficoVelocita = async() => {
    try {
        const response = await axios.get('/workout/velocita-allenamenti', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per indicare il grafico dei tipi di workouts in base alla distanza percorsa
export const graficoDistanza = async() => {
    try {
        const response = await axios.get('/workout/distanza-allenamenti', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};

//Chiamata API per il calcolo punteggio per monitorare la qualità degli allenamenti dell'utente mensilmente
export const calcolaPunteggio = async() => {
    try {
        const response = await axios.get('/workout/allenamento', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;  
    }
};


