function createDocument() {
    // Get values from form
    var organizationId = document.getElementById("organization-id").value;
    var documentName = document.getElementById("document-name").value;
    var documentDescription = document.getElementById("document-description").value;
    var documentCategory = document.querySelector('input[name="document-category"]:checked').value;
    var documentExpiration = document.getElementById("document-expiration").value;

    // Create JSON object
    var jsonRequestBody = {
        "organization_id": organizationId,
        "name": documentName,
        "description": documentDescription,
        "category": documentCategory,
        "expiration_months": documentExpiration
    };

    // Convert JSON to string
    var jsonString = JSON.stringify(jsonRequestBody);

    // Replace these URLs with your actual endpoints
    var createEndpoint = 'https://tollanis.jetbrains.space/p/tollacred/repositories/tollacredapp/files/develop/src/tests/json_data/body_request/document_types_management/body_create_handler.json';
    var expectedResponseEndpoint = 'https://tollanis.jetbrains.space/p/tollacred/repositories/tollacredapp/files/develop/src/tests/json_data/expected/document_types_management/expected_create_handler.json';

    // Make a POST request using fetch API
    fetch(createEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonString,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);

        // Display success message (replace with your actual handling logic)
        alert("Document created successfully!");

        // Optionally, you can reset the form after saving.
        document.getElementById("save-button").disabled = true;
        document.getElementById("organization-id").value = "";
        document.getElementById("document-name").value = "";
        document.getElementById("document-description").value = "";
        document.querySelector('input[name="document-category"]:checked').checked = false;
        document.getElementById("document-expiration").value = "";
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle error (replace with your actual error handling logic)
        alert("Error creating document. Please try again.");
    });

    // For demonstration purposes, you can log the endpoints
    console.log('Body Request Endpoint:', createEndpoint);
    console.log('Expected Response Endpoint:', expectedResponseEndpoint);
}
function getList() {
    var organizationId = document.getElementById("organizationIdInput").value;

    // Replace with your actual endpoint
    var endpoint = `https://tollanis.jetbrains.space/p/tollacred/repositories/tollacredapp/files/develop/src/tests/json_data/expected/document_types_management/expected_get_all_handler.json`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Process the data and populate the table
            populateTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error (replace with your actual error handling logic)
            alert("Error fetching document types. Please try again.");
        });
}

function populateTable(data) {
    var tableBody = document.getElementById("documentTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Iterate through the data and add rows to the table
    data.forEach(documentType => {
        var row = tableBody.insertRow();
        var cellName = row.insertCell(0);
        var cellDescription = row.insertCell(1);
        var cellCategory = row.insertCell(2);
        var cellExpires = row.insertCell(3);

        cellName.textContent = documentType.name || "";
        cellDescription.textContent = documentType.description || "";
        cellCategory.textContent = documentType.category || "";
        cellExpires.textContent = documentType.expires || "";
    });
}


function getSingleDocument(documentId) {
    // Replace with your actual endpoint
    var endpoint = `https://tollanis.jetbrains.space/p/tollacred/repositories/tollacredapp/files/develop/src/tests/json_data/expected/document_types_management/expected_get_single_handler.json`;

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

function updateDocument(documentId, updatedData) {
    // Replace with your actual endpoint and update the request body accordingly
    var updateEndpoint = 'https://tollanis.jetbrains.space/p/tollacred/repositories/tollacredapp/files/develop/src/tests/json_data/body_request/document_types_management/body_update_handler.json';

    // Make a PUT request using fetch API
    fetch(updateEndpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Update Success:', data);
        // Display success message or handle as needed
        alert("Document updated successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error (replace with your actual error handling logic)
        alert("Error updating document. Please try again.");
    });
}

function deleteDocument(documentId) {
    // Replace with your actual endpoint
    var deleteEndpoint = 'https://tollanis.jetbrains.space/p/tollacred/repositories/tollacredapp/files/develop/src/tests/json_data/expected/document_types_management/expected_delete_single_handler.json';

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
