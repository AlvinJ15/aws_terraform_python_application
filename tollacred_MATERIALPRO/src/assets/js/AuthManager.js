// apiManager.js

const API_BASE_URL = "https://api.tollaniscred.com/dev/";
const API_TOKEN = 'eyJraWQiOiJGZmU0aXMrOXJmRkVPUytpd2dMMGhrVkpyOHZLMmtIZ1BUb3JHbVhWRGFNPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiQzBKLVhBR0NXQW9rVVE1WVJrQktOQSIsInN1YiI6ImUzMjIzNDgwLWIzN2UtNDkxMS04YzI0LTIxNzdkMjZhMjRjMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9ZMndDM25sVUkiLCJjb2duaXRvOnVzZXJuYW1lIjoiZTMyMjM0ODAtYjM3ZS00OTExLThjMjQtMjE3N2QyNmEyNGMwIiwib3JpZ2luX2p0aSI6ImQwOTI3MDIwLTY0MDMtNGYzNy05YzlhLTZiOGVlOTkzMjhiYiIsImF1ZCI6Ijc1OTNmb3J0YjYwc3IxdWoyODNvcDBpY2RhIiwiZXZlbnRfaWQiOiJlMmM5NDIyNy05ZTg4LTQwZWYtYjQyOC0wMzUxNDZmZjQ0NjEiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxMjkxMjE3NiwiZXhwIjoxNzEyOTk4NTc2LCJpYXQiOjE3MTI5MTIxNzYsImp0aSI6Ijg5ODBhOGQwLTZkM2QtNGI0ZC05OGQwLTIyOGY5ZmY3Mjg5YiIsImVtYWlsIjoiYWx2aW4uY2h1bmdhQHRvbGxhbmlzLmNvbSJ9.Pa6MSunM3BJ9kojGBYz8Hodv6gxMgx63i4XNR9vmgT1VvQxYKwIKF-IOb1bDWQu0UHaVp9ckzmFh9UesNDakSnoxXM8HskJJu0CVzu7rSpiCFXtnMfgE48QJ5bjpiv-50zG7Gx7KgGwYHTFms2Iv8CuXERRrwIpfmi8HWd-i5glm_GpNevoSwnRZxTAt3HbR2TM2gJqINW326f9-C5n-9cEzocqsOm5_oJwrdy8Vr7gc1H84Q9KCj_DLkAg3TULeI8eMtyVssewRx8t6qz5E1OfpWSLVF8MlAwGjJgONOk6k0GXuSabrNplOy6anw2nJMFmzYk_A6A6CUhG4fzJdmA';
//api token should be taken by getCookie in another  method/file
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

async function tokenExist(){
    let token = await getApiToken();
    return token !== null;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return undefined; // Cookie not found
}

function setCookie(name, value, options = {}) {
    // Encode the value for safe cookie storage
    const encodedValue = encodeURIComponent(value);

    // Build the cookie string with optional parameters
    let cookieString = `${name}=${encodedValue}`;

    // Set expiration time (optional)
    if (options.expires) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + options.expires * 1000);
        cookieString += `; expires=${expirationDate.toUTCString()}`;
    }

    // Set path (optional)
    if (options.path) {
        cookieString += `; path=${options.path}`;
    }

    // Set domain (optional)
    if (options.domain) {
        cookieString += `; domain=${options.domain}`;
    }

    // Set secure flag (optional)
    if (options.secure) {
        cookieString += `; secure`;
    }

    // Set SameSite attribute (optional)
    if (options.sameSite) {
        cookieString += `; SameSite=${options.sameSite}`;
    }

    // Write the cookie to the document
    document.cookie = cookieString;
}

function deleteCookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
async function getApiToken() {
    if (getCookie('API_TOKEN') === undefined) {
        const CODE = new URLSearchParams(window.location.search).get('code');
        const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
        const encodedCredentials = btoa(credentials);
        // console.log(encodedCredentials)
        const body = {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code: CODE,
            redirect_uri: REDIRECT_URI,
        };

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${encodedCredentials}`,
        };

        let response = await makeTokenRequest('POST', `${COGNITO_DOMAIN}/oauth2/token`, body, headers);
        if (response == null) {
            alert('Error retrieving the API TOKEN');
            return undefined;
        }
        setCookie('API_TOKEN', response.id_token, {
            expires: 86400,
            path: '/'
        })
    }
    return getCookie('API_TOKEN');
}

async function makeTokenRequest(method, url, data = null, headers = null, is_json = true) {
    try {
        const urlSearchParams = new URLSearchParams(data);
        const bodyString = urlSearchParams.toString();

        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: bodyString
        });
        if (response.status === 200 || response.status === 201) {
            return response.json();
        }
        console.log(response);
        return null;
    } catch (error) {
        handleRequestError(url, error);
        throw error;
    }
}
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
};

export default apiManager;
export default tokenExist;
