async function createDocument() {
    // Get values from form
    let organizationId = localStorage.getItem('organization_id');
    let documentName = document.getElementById("document-name").value;
    let documentDescription = document.getElementById("document-description").value;
    let documentCategory = document.querySelector('input[name="document-category"]:checked').value;
    let documentExpiration = document.getElementById("document-expiration").value;

    // Create JSON object
    let jsonRequestBody = {
        "name": documentName,
        "description": documentDescription,
        "category": documentCategory,
        "expiration": documentExpiration
    };

    let endpoint = `organizations/${organizationId}/documents`;
    let response = await makeRequest('POST', endpoint, jsonRequestBody);
    if (response){
        alert('Document Type Created!');
        history.back();
    }
    else {
        console.error('Error:');
        // Handle error (replace with your actual error handling logic)
        alert("Error creating document types. Please try again.");
    }
}
async function getList() {
    let organizationId = localStorage.getItem('organization_id');
    let endpoint = `organizations/${organizationId}/documents`;
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

function populateTable(data) {
    let tableBody = document.getElementById("documentTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Iterate through the data and add rows to the table
    data.forEach(documentType => {
        let row = tableBody.insertRow();
        let cellName = row.insertCell(0);
        let cellDescription = row.insertCell(1);
        let cellCategory = row.insertCell(2);
        let cellExpires = row.insertCell(3);

        cellName.textContent = documentType.name || "";
        cellDescription.textContent = documentType.description || "";
        cellCategory.textContent = documentType.category || "";
        cellExpires.textContent = documentType.expiration || "";
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
