import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const crearEmpleado = async (empleadoData) => {
    try {
        const token = localStorage.getItem('apiToken'); // Obtén el token del localStorage
        const response = await axios.post(
            `${BASE_URL}empleado/`,
            empleadoData,
            {
                headers: {
                    Authorization: `Bearer ${token}` // Añade el token en los headers
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        
        throw error;
    }
};
