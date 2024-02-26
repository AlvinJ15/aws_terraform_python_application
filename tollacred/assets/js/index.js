// const axios = require('axios');
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

function removeCookie(name) {
  // Set the expiration date to a past date to effectively remove the cookie
  setCookie(name, "", { expires: -1 });
}

async function getApiToken() {
    if (getCookie('API_TOKEN') === undefined) {
        const CODE = new URLSearchParams(window.location.search).get('code');
        const CLIENT_ID = '7f07uqm098keq2i3k3ljg83hq9';
        const CLIENT_SECRET = '1gf2no0tbm8f7tk54s76l3v29jf4c4qvcsrpt5h3a38sfsgmep5n';
        const COGNITO_DOMAIN = 'https://tollacred.auth.us-east-1.amazoncognito.com';

        const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
        const encodedCredentials = btoa(credentials);
        // console.log(encodedCredentials)
        const body = {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code: CODE,
            redirect_uri: 'https://aqqakr76zbjxtqxw36d2fjluue0vkpkz.lambda-url.us-east-1.on.aws/',
        };

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${encodedCredentials}`,
        };

        await axios.post(`${COGNITO_DOMAIN}/oauth2/token`, body, {headers})
            .then(response => {
                console.log('Access token:', response.data.id_token);
                setCookie('API_TOKEN', response.data.id_token, {expires: 86400})
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    return getCookie('API_TOKEN');
}

async function test(){
    const api_token = await getApiToken(); // first time the token will be saved in the cookies, if the token expires we need to call removeCookie('API_TOKEN') and update the code for get a new token
    console.log('API_TOKEN = ', api_token)
}

test() // async execution
