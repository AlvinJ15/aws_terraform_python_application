
window.addEventListener("DOMContentLoaded", async () => {
    let organization_id = localStorage.getItem("organization_id");
    await getOrganizationDetails(organization_id);
})

async function getOrganizationDetails(organization_id){
    let endpoint = `organizations/${organization_id}`;
    let response = await makeRequest('GET', endpoint);
    if(response){
        fillOrganizationFields(response);
    }
    else {
        alert('Error Retrieving organization Info');
    }
}

function fillOrganizationFields(organization){
    document.getElementById('organization-id').value = organization.id;
    document.getElementById('organization-type').value = organization.type;
    document.getElementById('organization-name').value = organization.name;
    document.getElementById('organization-legal-name').value = organization.legal_name;
    document.getElementById('country').value = organization.country;
    document.getElementById('postcode-zip').value = organization.zip;
    document.getElementById('Address-line-1').value = organization.address1;
    document.getElementById('Address-line-2').value = organization.address2;
    document.getElementById('City').value = organization.city;
    document.getElementById('state-province').value = organization.state;
}