/// Function to get a list of all questionnaires associated with organization_id
function getAllQuestionnaires(organizationId) {
    var endpoint = `organizations/${organizationId}/questionnaires`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Process the data and populate the table
            populateQuestionnaireTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error (replace with your actual error handling logic)
            alert("Error fetching questionnaires. Please try again.");
        });
}

// Function to create a new questionnaire
function createQuestionnaire(organizationId, requestBody) {
    var createEndpoint = `organizations/${organizationId}/questionnaires`;

    // Make a POST request using fetch API
    fetch(createEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Display success message or handle as needed
        alert("Questionnaire created successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error (replace with your actual error handling logic)
        alert("Error creating questionnaire. Please try again.");
    });
}

// Function to get a single questionnaire with questionnaire_id
function getSingleQuestionnaire(organizationId, questionnaireId) {
    var endpoint = `organizations/${organizationId}/questionnaires/${questionnaireId}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Process the data and display or use it as needed
            console.log('Single Questionnaire:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error (replace with your actual error handling logic)
            alert("Error fetching single questionnaire. Please try again.");
        });
}

// Function to update a questionnaire with questionnaire_id
function updateQuestionnaire(organizationId, questionnaireId, updatedData) {
    var updateEndpoint = `organizations/${organizationId}/questionnaires/${questionnaireId}`;

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
        alert("Questionnaire updated successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error (replace with your actual error handling logic)
        alert("Error updating questionnaire. Please try again.");
    });
}

// Function to delete a single questionnaire with questionnaire_id
function deleteQuestionnaire(organizationId, questionnaireId) {
    var deleteEndpoint = `organizations/${organizationId}/questionnaires/${questionnaireId}`;

    // Make a DELETE request using fetch API
    fetch(deleteEndpoint, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Delete Success:', data);
        // Display success message or handle as needed
        alert("Questionnaire deleted successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error (replace with your actual error handling logic)
        alert("Error deleting questionnaire. Please try again.");
    });
}

// Function to populate the questionnaire table with data
function populateQuestionnaireTable(data) {
    var tableBody = document.getElementById("questionnaireTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Iterate through the data and add rows to the table
    data.forEach(questionnaire => {
        var row = tableBody.insertRow();
        var cellId = row.insertCell(0);
        var cellName = row.insertCell(1);
        var cellDescription = row.insertCell(2);
        var cellCategory = row.insertCell(3);

        cellId.textContent = questionnaire.id || "";
        cellName.textContent = questionnaire.name || "";
        cellDescription.textContent = questionnaire.description || "";
        cellCategory.textContent = questionnaire.category || "";
    });
}
