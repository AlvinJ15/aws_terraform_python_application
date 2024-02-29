// Base URL for API requests
const baseURL = `https://api.tollaniscred.com/${ENV}`;

async function makeRequest(method, url, data = null, is_json=true) {
    showLoading();
    try {
        let headers = {}
        if (is_json){
            headers = {
                Authorization: await getApiToken(),
                'Content-Type': 'application/json',
            }
        }else {
            headers = {
                Authorization: await getApiToken(),
            }
        }

        let api_url = `${baseURL}/${url}`
        const response = await fetch(api_url,{
            method:method,
            headers: headers,
            body: (data && is_json) ? JSON.stringify(data) : data
        });
        if(response.status === 200 || response.status === 201){
            hideLoading();
            return response.json();
        }
        if(response.status === 401) {
            deleteCookie('API_TOKEN');
            alert('Session token expired');
            hideLoading();
            redirectToLogin();
        }
        hideLoading();
        console.log(response);
        return null;
    } catch (error) {
        hideLoading();
        handleRequestError(url, error);
        throw error;
    }
}

// Function to handle errors and log relevant information
function handleRequestError(url, error) {
    console.error(`Error making request to ${url}: ${error.message}`);

    if (error.response) {
        // The request was made and the server responded with a status code
        console.error(`Request failed with status code ${error.response.status}`);
        console.error('Response data:', error.response.data);
    } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from the server');
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
    }

    // Additional logging or monitoring can be added here
}
