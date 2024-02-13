const axios = require('axios');

// Base URL for API requests
const baseURL = 'https://p4u9i76s6f.execute-api.us-east-1.amazonaws.com';

// Function to handle common request logic
async function makeRequest(method, url, data = null) {
    try {
        const response = await axios({
            method,
            url: `${baseURL}/${url}`,
            data
        });
        return response.data;
    } catch (error) {
        handleRequestError(url, error);
        throw error;
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

// Example Usage:
const organizationId = 'your_organization_id';

//add function to get documents
getDocuments(organizationId)
    .then(console.log)
    .catch(console.error);
} 
