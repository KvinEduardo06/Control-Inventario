import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL_PUBLIC;

export const CambiarContraseña = async (empleadoData) => {
    try {
        // Extraer el token del objeto empleadoData si necesitas usarlo en la URL
        const { token, ...dataSinToken } = empleadoData;
        
        // Usar el token en la URL
        const response = await axios.post(`${BASE_URL}usuario/confirmar-cuenta/${token}/`, dataSinToken);
        return response.data;
    } catch (error) {
        throw error;
    }
};