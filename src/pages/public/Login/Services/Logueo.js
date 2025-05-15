import axios from 'axios';

const BASE_URL =
    import.meta.env.VITE_API_URL;

export const Logueo = async() => {
    try {
        const response = await axios.post(`${BASE_URL}usuario/login/`);
        console.log(response.data);

        return response.data;
        //Poner un console de data

    } catch (error) {
        throw error;
    }
};