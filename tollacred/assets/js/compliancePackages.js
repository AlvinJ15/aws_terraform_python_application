async function loadCompliancePackages() {
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `organizations/${organizationId}/compliancePackages`;
    let response = await makeRequest('GET', endpoint)
    return response
}

async function createCompliancePackage(data){
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `organizations/${organizationId}/compliancePackages`;
    let response = await makeRequest('POST', endpoint, data)
    return response
}

async function updateCompliancePackage(packageId, data){
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `organizations/${organizationId}/compliancePackages/${packageId}`;
    let response = await makeRequest('PUT', endpoint, data)
    return response
}

async function deleteCompliancePackage(packageId){
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `organizations/${organizationId}/compliancePackages/${packageId}`;
    let response = await makeRequest('DELETE', endpoint)
    return response
}