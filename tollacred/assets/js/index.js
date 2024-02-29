const CODE_LOCAL = 'c97df63d-8058-4a7b-9e92-d65b26378942'

let loadingScreen;
window.addEventListener("DOMContentLoaded", async () => {
    const body = document.body;
    loadingScreen = createLoadingScreen();
    body.appendChild(loadingScreen);

    // Function to show the loading screen

    let token = await getApiToken()
    if (!token) {
        redirectToLogin();
    }
});

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
        const CLIENT_ID = '7593fortb60sr1uj283op0icda';
        const CLIENT_SECRET = 'ie32n7dqdrfls1j66fklokfrj25kq0kfkbc9e0i102k3dbq42jd';
        const COGNITO_DOMAIN = 'https://tollacred.auth.us-east-1.amazoncognito.com';

        const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
        const encodedCredentials = btoa(credentials);
        // console.log(encodedCredentials)
        const body = {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code: CODE,
            redirect_uri: 'https://app-dev.tollaniscred.com/dashboard.html',
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

function createLoadingScreen() {
  const loadingScreen = document.createElement('div');
  loadingScreen.id = 'loading-screen';
  loadingScreen.classList.add('hidden');

  const loadingIcon = document.createElement('div');
  loadingIcon.classList.add('loading-icon');
  loadingIcon.style.animation = 'spin 2s linear infinite'; // Add animation style directly

  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.style.animation = 'spin 2s linear infinite reverse'; // Add animation style directly

  loadingIcon.appendChild(spinner);
  loadingScreen.appendChild(loadingIcon);

  const loadingText = document.createElement('p');
  loadingText.textContent = 'Loading...';
  loadingScreen.appendChild(loadingText);

  return loadingScreen;
}

function redirectToLogin(){
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        window.location.href = `dashboard.html?code=${CODE_LOCAL}`
    } else {
        window.location.href = 'https://tollacred.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=7593fortb60sr1uj283op0icda&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fapp-dev.tollaniscred.com%2Fdashboard.html'
    }
}
    function showLoading() {
        loadingScreen.classList.add('show'); // Add the hidden class
    }

    // Function to hide the loading screen
    function hideLoading() {
        loadingScreen.classList.remove('show'); // Remove the hidden class
    }