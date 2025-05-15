import axios from 'axios';

import.meta.env.VITE_API_URL;

const BASE_URL = import.meta.env.VITE_API_URL_PUBLIC;

export const GetUser = async() => {
    try {
        const token = localStorage.getItem('apiToken');
        // console.log(token);

        const response = await axios.get(`${BASE_URL}usuario/perfil/`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        // console.log("User data:", response.data);
        // console.log(response);

        return response.data;
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        throw error;
    }
};