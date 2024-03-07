window.addEventListener('DOMContentLoaded', (event) => {
    getAllEmployeeReferences();

});
async function getAllEmployeeReferences() {
    let organizationId = localStorage.getItem('organization_id')
    let employee_id = new URLSearchParams(window.location.search).get('employee_id');
    let endpoint = `organizations/${organizationId}/employees/${employee_id}/references`;
    let response = await makeRequest('GET', endpoint)
    populateEmployeeReferencesTable(response);
}

// Function to create a new employee
async function createEmployee() {
    let organizationId = localStorage.getItem('organization_id');
    let createEndpoint = `organizations/${organizationId}/employees`;
    let data = getAddStaffJson();
    let response = await makeRequest('POST', createEndpoint, data)
    if(response !== null){
        alert('Employee Created !!!')
        window.location.href = 'staff.html'
    } else {
        alert('Error Creating the Employee.')
    }
}

// Function to delete a single employee with employee_id
async function deleteEmployee(employeeId) {
    let organizationId = localStorage.getItem("organization_id");
    let deleteEndpoint = `organizations/${organizationId}/employees/${employeeId}`;
    let response = await makeRequest('DELETE', deleteEndpoint)
    if(response){
        alert('Employee Deleted.')
    }
    else{
        alert('Error Deleting Employee')
    }
}

// Function to create "Manage" and "Delete" buttons
function createReferenceButtons(reference) {
    let editCell = document.createElement("td");
    let manageButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // Set attributes for "Manage" button
    manageButton.innerHTML = "Dowmload";
    manageButton.onclick = function() {
        downloadReferenceDocument(reference);
    };

    // Append buttons to the cell
    editCell.appendChild(manageButton);

    return editCell;
}

// Function to populate the employee table with data
function populateEmployeeReferencesTable(data) {
    var tableBody = document.getElementById("tableEmployeeReferences");

    // Clear existing rows
    tableBody.innerHTML = "";

    data.forEach(reference => {
        let row = tableBody.insertRow();
        let cellName = row.insertCell(0);
        let cellEmail = row.insertCell(1);
        let cellStatus = row.insertCell(2);
        let cellUploaded = row.insertCell(3);
        let cellUpdated = row.insertCell(4);

        cellName.textContent = reference.referee_name;
        cellEmail.textContent = reference.referee_email;
        cellStatus.textContent = reference.status;
        cellUploaded.textContent = reference.created_date
        cellUpdated.textContent = reference.completion_date

        if (reference.s3_path){
            let downloadCell = createReferenceButtons(reference);
            row.appendChild(downloadCell);
        }
    });
}

async function downloadReferenceDocument(reference) {
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `organizations/${organizationId}/employees/${reference.employee_id}/references/${reference.reference_id}`;
    let response =  await makeRequest('GET', endpoint);
    // Get the download URL from the API call (replace with your actual API call logic)

    const downloadUrl = response.download_url

    // Create a new anchor element (link)
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Set the download attribute to force download behavior
    //link.setAttribute("download", getFileName(response.s3_path)); // Change the filename if needed

    // Simulate a click on the link to trigger download
    link.click();
}

async function createEmployeeReference() {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    let organizationId = localStorage.getItem('organization_id');
    let createEndpoint = `organizations/${organizationId}/employees/${employeeId}/references`;
    let data = getAddEmployeeReferenceJson();
    let response = await makeRequest('POST', createEndpoint, data)
    if(response !== null){
        alert('Employe Reference Added !!!')
        location.reload();
    } else {
        alert('Error Adding the Employe reference.')
    }
}

function getAddEmployeeReferenceJson(){
    return {
        referee_name: document.getElementById('referee-name').value,
        referee_email: document.getElementById('referee-email').value,
        referee_phone: document.getElementById('referee-phone').value
    }
}

function goToAddEmployeeReference(){
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    window.location.href = `addemployeereference.html?employee_id=${employeeId}`
}
