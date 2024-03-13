async function loadDocumentTypes() {
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `organizations/${organizationId}/documents`;
    let response = await makeRequest('GET', endpoint)
    return response
}
