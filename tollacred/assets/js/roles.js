
async function loadRoles() {
  let organizationId = localStorage.getItem('organization_id')
  let endpoint = `organizations/${organizationId}/roles`;
  let response = await makeRequest('GET', endpoint);
  return response;
}
