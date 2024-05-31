// apiManager.js
import { getApiToken } from './AuthManager';
const API_BASE_URL = `https://api.tollaniscred.com/${import.meta.env.VITE_ENV}`;
//export const API_TOKEN = getApiToken();
//api token should be taken by getCookie in another  method/file
const apiManager = {
    // get method
    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': await getApiToken(),
                    },
                });
            return response.json();
        } catch (error) {
            console.error(`got error in the request GET a ${endpoint}:`, error);
            throw error;
        }
    },

    //  post method
    post: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': await getApiToken(),
                },
                body: JSON.stringify(data),
                //body: (data instanceof FormData) ? data : JSON.stringify(data),
            });
            return response.json();
        } catch (error) {
            console.error(`got an error in the request POST a ${endpoint}:`, error);
            throw error;
        }
    },

    // delete method
    delete: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': await getApiToken(),
                }
            });
            return response.json();

        } catch (error) {
            console.error(`got an error in the request DELETE a ${endpoint}:`, error);
            throw error;
        }
    },

    put: async (endpoint, data, headers) => {
        try {
            const options = {
                method: 'PUT',
                headers: headers ?? {
                    'Content-Type': 'application/json',
                    'Authorization': await getApiToken(),
                },
                body: (data instanceof FormData) ? data : JSON.stringify(data),
            }

            const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
            return response.json();

        } catch (error) {
            console.error(`got an error in the request PUT a ${endpoint}:`, error);
            throw error;
        }
    },

    blank: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': await getApiToken(),
                }
            });
            return response.json();

        } catch (error) {
            console.error(`got an error in the request DELETE a ${endpoint}:`, error);
            throw error;
        }
    },

    default: async (endpoint) => {
        try {
            const response = await fetch(`endpoint`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': await getApiToken(),
                }
            });
            return response.json();

        } catch (error) {
            console.error(`got an error in the request DELETE a ${endpoint}:`, error);
            throw error;
        }
    },
    // opions method
    options: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'OPTIONS',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': await getApiToken(),
                },
                body: (data instanceof FormData) ? data : JSON.stringify(data),
            });
            return response.json();

        } catch (error) {
            console.error(`got an error in the request DELETE a ${endpoint}:`, error);
            throw error;
        }
    },
    postNoJson: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': await getApiToken(),
                },
                body: (data),
            });
            return response.json();
        } catch (error) {
            console.error(`got an error in the request POST a ${endpoint}:`, error);
            throw error;
        }
    },
};

export default apiManager;
