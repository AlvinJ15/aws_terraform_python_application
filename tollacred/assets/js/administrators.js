function fillDropDown(data, selectElement) {
    selectElement.innerHTML = "";
    data.forEach(admin => {
        selectElement.appendChild(new Option(`${admin.first_name} ${admin.last_name}`, admin.admin_id))
    });
}

async function loadAdministrators() {
  let organizationId = localStorage.getItem('organization_id')
  let endpoint = `organizations/${organizationId}/administrators`;
  let response = await makeRequest('GET', endpoint);
  if (!response){
      alert('Failed retrieving administrator list');
  }
  return response;
}
