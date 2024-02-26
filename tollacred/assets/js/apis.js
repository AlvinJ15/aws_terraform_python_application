// Base URL for API requests
const baseURL = 'https://1ojxaw0pa6.execute-api.us-east-1.amazonaws.com';

async function makeRequest(method, url, data = null, is_json=true) {
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
            return response.json();
        }
        return null;
    } catch (error) {
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

// Documents
async function getDocuments(organizationId) {
    return makeRequest('GET', `organizations/${organizationId}/documents`);
}

async function createDocument(organizationId, documentData) {
    return makeRequest('POST', `organizations/${organizationId}/documents`, documentData);
}

async function getDocument(organizationId, documentId) {
    return makeRequest('GET', `organizations/${organizationId}/documents/${documentId}`);
}

async function updateDocument(organizationId, documentId, documentData) {
    return makeRequest('UPDATE', `organizations/${organizationId}/documents/${documentId}`, documentData);
}

// Compliance Packages
async function getCompliancePackages(organizationId) {
    return makeRequest('GET', `organizations/${organizationId}/compliancePackages`);
}

async function createCompliancePackage(organizationId, packageData) {
    return makeRequest('POST', `organizations/${organizationId}/compliancePackages`, packageData);
}

async function getCompliancePackage(organizationId, packageId) {
    return makeRequest('GET', `organizations/${organizationId}/compliancePackages/${packageId}`);
}

async function updateCompliancePackage(organizationId, packageId, packageData) {
    return makeRequest('UPDATE', `organizations/${organizationId}/compliancePackages/${packageId}`, packageData);
}

// Questionnaires
async function getQuestionnaires(organizationId) {
    return makeRequest('GET', `organizations/${organizationId}/questionnaires`);
}

async function createQuestionnaire(organizationId, questionnaireData) {
    return makeRequest('POST', `organizations/${organizationId}/questionnaires`, questionnaireData);
}

async function getQuestionnaire(organizationId, questionnaireId) {
    return makeRequest('GET', `organizations/${organizationId}/questionnaires/${questionnaireId}`);
}

async function updateQuestionnaire(organizationId, questionnaireId, questionnaireData) {
    return makeRequest('UPDATE', `organizations/${organizationId}/questionnaires/${questionnaireId}`, questionnaireData);
}

// Roles
async function getRoles(organizationId) {
    return makeRequest('GET', `organizations/${organizationId}/roles`);
}
