// Function to get a list of all employees associated with organization_id
async function getAllEmployees(organizationId) {
    let endpoint = `dev/organizations/${organizationId}/employees`;
    let response = await makeRequest('GET', endpoint)
    populateEmployeeTable(response);
}

// Function to create a new employee
async function createEmployee() {
    let organizationId = localStorage.getItem('organization_id');
    let createEndpoint = `dev/organizations/${organizationId}/employees`;
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
    let deleteEndpoint = `dev/organizations/${organizationId}/employees/${employeeId}`;
    let response = await makeRequest('DELETE', deleteEndpoint)
    if(response){
        alert('Employee Deleted.')
    }
    else{
        alert('Error Deleting Employee')
    }
}

async function manageEmployee(employeeId) {
    let organizationId = localStorage.getItem("organization_id");
    window.location.href = `profile.html?employee_id=${employee_id=employeeId}`
}

// Function to create "Manage" and "Delete" buttons
function createEditButtons(employeeId) {
    var editCell = document.createElement("td");
    var manageButton = document.createElement("button");
    var deleteButton = document.createElement("button");

    // Set attributes for "Manage" button
    manageButton.innerHTML = "Manage";
    manageButton.onclick = function() {
        manageEmployee(employeeId);
    };

    // Set attributes for "Delete" button
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteEmployee(employeeId);
    };

    // Append buttons to the cell
    editCell.appendChild(manageButton);
    editCell.appendChild(deleteButton);

    return editCell;
}

// Function to populate the employee table with data
function populateEmployeeTable(data) {
    var tableBody = document.getElementById("employeeTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    let id_names_map = new Map()
    data.forEach(employee => {
        id_names_map.set(employee.employee_id, employee.profile.first_name);
    });
    data.forEach(employee => {
        let row = tableBody.insertRow();
        let cellStaffMember = row.insertCell(0);
        let cellRole = row.insertCell(1);
        let cellAssigned = row.insertCell(2);
        let cellCompliancePackages = row.insertCell(3);
        let cellCompliance = row.insertCell(4);
        let cellTags = row.insertCell(5);
        let cellSignedOff = row.insertCell(6);
        let cellActive = row.insertCell(7);

        cellStaffMember.textContent = `${employee.profile.first_name} ${employee.profile.last_name}`  || "";
        cellRole.textContent = employee.profile.role || "";
        cellAssigned.textContent = id_names_map.get(employee.assignee_id, "");
        cellCompliancePackages.textContent = employee.compliance_tags || "";
        cellCompliance.textContent = employee.status || "";
        cellTags.textContent = employee.user_tags || "";
        cellSignedOff.textContent = employee.signedOff || "";
        cellActive.textContent = employee.active || "";

        // Add "Manage" and "Delete" buttons under the "Edit" column
        let editCell = createEditButtons(employee.employee_id);
        row.appendChild(editCell);
    });
}

const submitButton = document.getElementById('save-button');
const form = document.getElementById('staff-form');



function getAddStaffJson(){
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;

  // Validate input
    let isValid = true;
    let errorMessage = '';

    if (firstName === '') {
        errorMessage += 'Please enter a first name.\n';
        isValid = false;
    }

    if (lastName === '') {
        errorMessage += 'Please enter a last name.\n';
        isValid = false;
    }

    if (!isValid) {
        // Display error message
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.textContent = errorMessage;
        form.insertBefore(errorDiv, submitButton);
        return;
    }

  // Create JSON object
    return {
        profile: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            role: role,
            country: 'United States'
        }
    };
}