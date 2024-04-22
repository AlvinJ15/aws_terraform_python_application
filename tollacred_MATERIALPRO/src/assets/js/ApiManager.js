// apiManager.js

const API_BASE_URL = `https://api.tollaniscred.com/${import.meta.env.VITE_ENV}/`;
const API_TOKEN = 'eyJraWQiOiJGZmU0aXMrOXJmRkVPUytpd2dMMGhrVkpyOHZLMmtIZ1BUb3JHbVhWRGFNPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiQzBKLVhBR0NXQW9rVVE1WVJrQktOQSIsInN1YiI6ImUzMjIzNDgwLWIzN2UtNDkxMS04YzI0LTIxNzdkMjZhMjRjMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9ZMndDM25sVUkiLCJjb2duaXRvOnVzZXJuYW1lIjoiZTMyMjM0ODAtYjM3ZS00OTExLThjMjQtMjE3N2QyNmEyNGMwIiwib3JpZ2luX2p0aSI6ImQwOTI3MDIwLTY0MDMtNGYzNy05YzlhLTZiOGVlOTkzMjhiYiIsImF1ZCI6Ijc1OTNmb3J0YjYwc3IxdWoyODNvcDBpY2RhIiwiZXZlbnRfaWQiOiJlMmM5NDIyNy05ZTg4LTQwZWYtYjQyOC0wMzUxNDZmZjQ0NjEiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxMjkxMjE3NiwiZXhwIjoxNzEyOTk4NTc2LCJpYXQiOjE3MTI5MTIxNzYsImp0aSI6Ijg5ODBhOGQwLTZkM2QtNGI0ZC05OGQwLTIyOGY5ZmY3Mjg5YiIsImVtYWlsIjoiYWx2aW4uY2h1bmdhQHRvbGxhbmlzLmNvbSJ9.Pa6MSunM3BJ9kojGBYz8Hodv6gxMgx63i4XNR9vmgT1VvQxYKwIKF-IOb1bDWQu0UHaVp9ckzmFh9UesNDakSnoxXM8HskJJu0CVzu7rSpiCFXtnMfgE48QJ5bjpiv-50zG7Gx7KgGwYHTFms2Iv8CuXERRrwIpfmi8HWd-i5glm_GpNevoSwnRZxTAt3HbR2TM2gJqINW326f9-C5n-9cEzocqsOm5_oJwrdy8Vr7gc1H84Q9KCj_DLkAg3TULeI8eMtyVssewRx8t6qz5E1OfpWSLVF8MlAwGjJgONOk6k0GXuSabrNplOy6anw2nJMFmzYk_A6A6CUhG4fzJdmA';
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
                        'Authorization': `${API_TOKEN}`,
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
                    'Authorization': `${API_TOKEN}`,
                },
                body: JSON.stringify(data),
            });
            return response.json();
        } catch (error) {
            console.error(`got an error in the request POST a ${endpoint}:`, error);
            throw error;
        }
    },

};

export default apiManager;
