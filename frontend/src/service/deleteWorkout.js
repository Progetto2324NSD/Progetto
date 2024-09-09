import axios from "../api_vespe/axiosConfig";

// Funzione per eliminare un allenamento
export const deleteWorkout = async (id) => {
    try {
        const response = await axios.delete(`/api/workouts/${id}`);
        
        // Verifica che la risposta sia OK
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to delete workout');
        }
    } catch (error) {
        console.error('Error in deleteWorkout:', error.message);
        throw new Error('Failed to delete workout');
    }
};