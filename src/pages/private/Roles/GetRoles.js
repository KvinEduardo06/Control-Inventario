import axios from 'axios';

// Obtener la URL base desde las variables de entorno
const BASE_URL = import.meta.env.VITE_API_URL;

export const obtenerRoles = async () => {
    try {
        // Obtener el token de autenticación del localStorage
        const token = localStorage.getItem('apiToken');
        
        if (!token) {
            throw new Error("No se encontró el token de autenticación");
        }
        
        // Configurar los headers con el token Bearer
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        
        // Realizar la petición al endpoint de roles
        const response = await axios.get(`${BASE_URL}rol/`, config);
        
        // console.log("Respuesta de roles:", response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error al obtener roles:", error);
        throw error;
    }
};

