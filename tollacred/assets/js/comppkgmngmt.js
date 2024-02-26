// Function to get a list of all compliance packages associated with organization_id
function getAllCompliancePackages(organizationId) {
    var endpoint = `dev/organizations/${organizationId}/compliancePackages`;
    
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Process the data and populate the table
            populateCompliancePackageTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error (replace with your actual error handling logic)
            alert("Error fetching compliance packages. Please try again.");
        });
}

// Function to create a new compliance package
function createCompliancePackage(organizationId, requestBody) {
    var createEndpoint = `dev/organizations/${organizationId}/compliancePackages`;

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
        alert("Compliance package created successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error (replace with your actual error handling logic)
        alert("Error creating compliance package. Please try again.");
    });
}

// Function to get a single compliance package with package_id
function getSingleCompliancePackage(organizationId, packageId) {
    var endpoint = `dev/organizations/${organizationId}/compliancePackages/${packageId}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Process the data and display or use it as needed
            console.log('Single Compliance Package:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error (replace with your actual error handling logic)
            alert("Error fetching single compliance package. Please try again.");
        });
}

// Function to update a compliance package with package_id
function updateCompliancePackage(organizationId, packageId, updatedData) {
    var updateEndpoint = `dev/organizations/${organizationId}/compliancePackages/${packageId}`;

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
        alert("Compliance package updated successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error (replace with your actual error handling logic)
        alert("Error updating compliance package. Please try again.");
    });
}

// Function to delete a single compliance package with package_id
function deleteCompliancePackage(organizationId, packageId) {
    var deleteEndpoint = `dev/organizations/${organizationId}/compliancePackages/${packageId}`;

    // Make a DELETE request using fetch API
    fetch(deleteEndpoint, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Delete Success:', data);
        // Display success message or handle as needed
        alert("Compliance package deleted successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error (replace with your actual error handling logic)
        alert("Error deleting compliance package. Please try again.");
    });
}

// Function to populate the compliance package table with data
function populateCompliancePackageTable(data) {
    var tableBody = document.getElementById("compliancePackageTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Iterate through the data and add rows to the table
    data.forEach(compliancePackage => {
        var row = tableBody.insertRow();
        var cellId = row.insertCell(0);
        var cellName = row.insertCell(1);
        var cellDescription = row.insertCell(2);
        var cellCategory = row.insertCell(3);

        cellId.textContent = compliancePackage.id || "";
        cellName.textContent = compliancePackage.name || "";
        cellDescription.textContent = compliancePackage.description || "";
        cellCategory.textContent = compliancePackage.category || "";
    });
}

