import axios from '../api_vespe/axiosConfig';

export const getNoti = async () => {
    const response = await axios.get('notifiche/notifiche', {
        withCredentials: true,
    });
    return response.data;
  }
  
  export const deleteNoti = async (id) => {
    const response = await axios.delete(`/notifiche/notifiche/${id}`, {
        withCredentials: true,
    });
    return response.data;
  }

const notiService = {
    getNoti,
    deleteNoti,
};

export default notiService;

