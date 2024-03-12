let currentRole;
let lastModalElement;
async function createrole() {
    let documentName = document.getElementById("role-name").value;
    let documentDescription = document.getElementById("role-description").value;
    let documentCategory = document.querySelector('input[name="role-type"]:checked').value;

    // Create JSON object
    let jsonRequestBody = {
        "name": documentName,
        "description": documentDescription,
        "type": documentCategory,
    };

    let organizationId = localStorage.getItem('organization_id');
    let endpoint = `organizations/${organizationId}/roles`;
    let response = await makeRequest('POST', endpoint, jsonRequestBody);
    if (response){
        alert('Role Created.')
        window.location.href = 'organizationroles.html'
    }
    else {
        console.error('Error:');
        // Handle error (replace with your actual error handling logic)
        alert("Error creating Role.");
    }
}

function cancelCreation(){
    window.location.href = 'organizationroles.html'
}

async function getList() {
    let organizationId = localStorage.getItem('organization_id');
    let endpoint = `organizations/${organizationId}/roles`;
    let response = await makeRequest('GET', endpoint);
    if (response){
        populateTable(response);
    }
    else {
        console.error('Error:');
        // Handle error (replace with your actual error handling logic)
        alert("Error fetching document types. Please try again.");
    }
}

function createEditButtons(role, editCell) {
    let deleteButton = document.createElement("button");

    // Set attributes for "Delete" button
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteRole(role);
    };

    // Append buttons to the cell
    editCell.appendChild(createUpdateButtonTable(role));
    editCell.appendChild(deleteButton);

    return editCell;
}

function createUpdateButtonTable(role){
    let openModalBtn = document.createElement("button");
    openModalBtn.innerHTML = "Update";
    openModalBtn.onclick = function() {
        currentRole = role;
        fillCurrentRoleData(currentRole)
        lastModalElement = document.getElementById("modal-update");
        const modalContainer = document.getElementById('modal-container');
        modalContainer.classList.add('active');
        lastModalElement.classList.add('active');
    };
    return openModalBtn;
}

function fillCurrentRoleData(role){
    document.getElementById('role-name').value = role.name;
    document.getElementById('role-description').value = role.description;
    if (role.type === 'Clinical') {
        document.getElementById('clinical').checked = true;
        document.getElementById('non-clinical').checked = false;
    }
    else{
        document.getElementById('clinical').checked = false;
        document.getElementById('non-clinical').checked = true;
    }
}

async function deleteRole(role){
    let organizationId = localStorage.getItem('organization_id');
    let endpoint = `organizations/${organizationId}/roles/${role.role_id}`;
    let response = await makeRequest('DELETE', endpoint);
    if (response){
        alert('Role Deleted');
    }
    else {
        console.error('Error:');
        // Handle error (replace with your actual error handling logic)
        alert("Error fetching document types. Please try again.");
    }
}

async function modalUpdateBtn(){
    let documentName = document.getElementById("role-name").value;
    let documentDescription = document.getElementById("role-description").value;
    let documentCategory = document.querySelector('input[name="role-type"]:checked').value;

    // Create JSON object
    let jsonRequestBody = {
        "name": documentName,
        "description": documentDescription,
        "type": documentCategory,
    };

    let organizationId = localStorage.getItem('organization_id');
    let endpoint = `organizations/${organizationId}/roles/${currentRole.role_id}`;
    let response = await makeRequest('PUT', endpoint, jsonRequestBody);
    if (response){
        alert('Role Updated.')
        closeModalBtn();
    }
    else {
        console.error('Error:');
        // Handle error (replace with your actual error handling logic)
        alert("Error creating Role.");
    }
}


function populateTable(data) {
    let tableBody = document.getElementById("roleTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Iterate through the data and add rows to the table
    data.forEach(role => {
        let row = tableBody.insertRow();
        let cellName = row.insertCell(0);
        let cellDescription = row.insertCell(1);
        let cellType = row.insertCell(2);
        let cellAction = row.insertCell(3)
        cellName.textContent = role.name || "";
        cellDescription.textContent = role.description || "";
        cellType.textContent = role.type || "";
        createEditButtons(role, cellAction)
    });
}


function getSingleDocument(documentId) {
    // Replace with your actual endpoint
    let endpoint = `https://tollanis.jetbrains.space/p/tollacred/repositories/tollacredapp/files/develop/src/tests/json_data/expected/document_types_management/expected_get_single_handler.json`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Process the data and display or use it as needed
            console.log('Single Document:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error (replace with your actual error handling logic)
            alert("Error fetching single document. Please try again.");
        });
}

function deleteDocument(documentId) {
    // Replace with your actual endpoint
    let deleteEndpoint = 'https://tollanis.jetbrains.space/p/tollacred/repositories/tollacredapp/files/develop/src/tests/json_data/expected/document_types_management/expected_delete_single_handler.json';

    // Make a DELETE request using fetch API
    fetch(deleteEndpoint, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Delete Success:', data);
        // Display success message or handle as needed
        alert("Document deleted successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error (replace with your actual error handling logic)
        alert("Error deleting document. Please try again.");
    });
}

function closeModalBtn() {
    const modalContainer = document.getElementById('modal-container');
    lastModalElement.classList.remove('active');
    modalContainer.classList.remove('active');
}
