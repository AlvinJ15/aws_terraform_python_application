// apiManager.js

//api token should be taken by getCookie in another  method/file
import ApiManager from "@/config/ApiManager.js";
import {useParams} from "react-router-dom";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;


function redirectToLogin() {
    window.location.href = LOGIN_URL
}

export function getCookie(name) {
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

export async function deleteCookie(name) {
    const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const encodedCredentials = btoa(credentials);

    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    /*return await fetch(LOGOUT_URL,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedCredentials}`,
        }
    });*/
}

export async  function getApiToken() {
    if (getCookie('API_TOKEN') === undefined) {
        const CODE = new URLSearchParams(window.location.search).get('code');
        if (CODE){
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
        //console.log(response);
        return null;
    } catch (error) {
        //handleRequestError(url, error);
        throw error;
    }
}

const authManager = {
    async tokenExist() {
        let token = await getApiToken();
        return token !== undefined;
    },

    getUserId(){
        return getCookie('LOGGED_USER_ID');
    },

    async setUserId(currentUser) {
        setCookie('LOGGED_USER_ID', currentUser.employee_id, {
            expires: 86400,
            path: '/'
        })
    }
};

export default authManager;
