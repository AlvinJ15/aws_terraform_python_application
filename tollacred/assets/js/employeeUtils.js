
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