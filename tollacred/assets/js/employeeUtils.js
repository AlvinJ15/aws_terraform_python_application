
async function createEmployee(data){
    let organizationId = localStorage.getItem('organization_id');
    let createEndpoint = `organizations/${organizationId}/employees`;
    let response = await makeRequest('POST', createEndpoint, data);
    if(response){
        alert('Employee Info Created');
    }
    else {
        alert('Error Creating Employee');
    }
    return response;
}

async function filterEmployees(filters){
    let organizationId = localStorage.getItem('organization_id');
    let getEndpoint = `organizations/${organizationId}/employees`;
    filters["filters"] = true;
    getEndpoint = buildUrl(getEndpoint, filters);
    let response = await makeRequest('GET', getEndpoint);
    if(!response) {
        alert('Error Retrieving Employees');
    }
    return response;

}


async function updateEmployee(employee_id, data){
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `organizations/${organizationId}/employees/${employee_id}`;
    let response = await makeRequest('PUT', endpoint, data);
    if(response){
        alert('Employee Info Updated');
    }
    else {
        alert('Error Updating Info');
    }
}

async function loadEmployee(employeeId){
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `organizations/${organizationId}/employees/${employeeId}`;
    let response = await makeRequest('GET', endpoint)
    return response
}

function saveLocalEmployee(employee){
    localStorage.setItem('current_employee', JSON.stringify(employee));
}

function getLocalEmployee(){
    let employee = JSON.parse(localStorage.getItem('current_employee'));
    return employee;
}