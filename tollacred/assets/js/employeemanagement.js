// Function to get a list of all employees associated with organization_id
let currentEmployee;
let lastModalElement;
async function executeBaseRequests(page) {
    try {
        let organizationId = localStorage.getItem('organization_id')
        let endpoint = `organizations/${organizationId}/employees?page=${page}`;
        const [response, adminList] = await Promise.all([
            makeRequest('GET', endpoint),
            loadAdministrators()
        ]);
        return {response, adminList}
        // Your code here after both responses are received
    } catch (error) {
        console.error("Error:", error);
    }
}
async function getAllEmployees(page) {
    let data = await executeBaseRequests(page)
    populateEmployeeTable(data.response, data.adminList);
}

// Function to create a new employee
async function createEmployeeBtn() {
    let data = getAddStaffJson();
    let existingEmail = await filterEmployees({
        email: data.profile.email
    });
    if (existingEmail !== null && existingEmail.length > 0) {
        if(confirm(`There's already exist an employee with the email ${data.profile.email}\nDo you want to continue?`)){
            let response = await createEmployee(data);
            if(response !== null) {
                window.location.href = 'staff.html'
            }
        }
    }
    else{
        let response = await createEmployee(data);
        if(response !== null) {
            window.location.href = 'staff.html'
        }
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

async function manageEmployee(employee) {
    saveLocalEmployee(employee);
    window.location.href = `profile.html?employee_id=${employee.employee_id}`
}

// Function to create "Manage" and "Delete" buttons
function createEditButtons(employee) {
    let editCell = document.createElement("td");
    let manageButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    let editButton = document.createElement("button");

    // Set attributes for "Edit" button
    editButton.innerHTML = "Edit";
    editButton.onclick = function () {
        editStaffButtonClick(employee);
    }
    // Set attributes for "Manage" button
    manageButton.innerHTML = "Manage";
    manageButton.onclick = function() {
        manageEmployee(employee);
    };

    // Set attributes for "Delete" button
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        if(confirm('Are you sure you want to delete this Employee?')){
            deleteEmployee(employee.employee_id);
        }
    };

    // Append buttons to the cell
    editCell.appendChild(editButton);
    editCell.appendChild(manageButton);
    editCell.appendChild(deleteButton);

    return editCell;
}

// Function to populate the employee table with data
async function populateEmployeeTable(data, adminList) {
    let tableBody = document.getElementById("employeeTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    data.forEach(employee => {
        let row = tableBody.insertRow();
        let cellStaffMember = row.insertCell(0);
        cellStaffMember.onclick = function () {
            manageEmployee(employee);
        }
        let cellRole = row.insertCell(1);
        let cellAssigned = row.insertCell(2);
        let cellCompliancePackages = row.insertCell(3);
        let cellSpecialty = row.insertCell(4);
        let cellCompliance = row.insertCell(5);
        let cellTags = row.insertCell(6);
        let cellSignedOff = row.insertCell(7);
        let cellNotes = row.insertCell(8);

        cellStaffMember.textContent = `${employee.profile.first_name} ${employee.profile.last_name}`  || "";
        cellRole.textContent = employee.role ? employee.role.name : "";
        let assignedSelect = document.createElement('select');
        assignedSelect.style.width = 'auto';
        fillDropDown(adminList, assignedSelect);
        cellAssigned.appendChild(assignedSelect);
        if (employee.assignee_id){
            assignedSelect.value = employee.assignee_id;
        } else {
            assignedSelect.value = "";
        }
        assignedSelect.addEventListener('change', function(event) {
            const selectedOption = event.target.value
            updateEmployee(employee.employee_id, {assignee_id: selectedOption});
        });
        cellCompliancePackages.innerHTML = employee.compliance_packages_names.join(', ') || "";
        cellSpecialty.textContent = employee.profile.specialty;
        cellCompliance.textContent = employee.status || "";
        if (employee.compliance_tags){
            cellTags.innerHTML = employee.compliance_tags.split(',').join(', ') || "";
        }
        cellSignedOff.textContent = "";
        cellNotes.textContent = employee.notes;

        // Add "Manage" and "Delete" buttons under the "Edit" column
        let editCell = createEditButtons(employee);
        row.appendChild(editCell);
    });
}

const submitButton = document.getElementById('save-button');
const form = document.getElementById('staff-form');



function getAddStaffJson(){
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const role_id = document.getElementById('role').value;

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
        role_id: role_id,
        profile: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            country: 'United States'
        }
    };
}

function editStaffButtonClick(employee) {
    const modalContainer = document.getElementById('modal-container');
    lastModalElement = document.getElementById("modal-single-staff");
    modalContainer.classList.add('active');
    lastModalElement.classList.add('active');
    currentEmployee = employee;
    fillEditStaffButtonClick(employee);
}

function fillEditStaffButtonClick(employee){
    document.getElementById('compliance').value = employee.status;
    document.getElementById('compliance-tags').value = employee.compliance_tags;
    document.getElementById('notes').value = employee.notes || '';
}

async function updateTagsEmployee() {
    let data = {
        status: document.getElementById('compliance').value,
        compliance_tags: document.getElementById('compliance-tags').value,
        notes: document.getElementById('notes').value
    };
    let response = await updateEmployee(currentEmployee.employee_id, data);
}

function closeModalBtn() {
    const modalContainer = document.getElementById('modal-container');
    lastModalElement.classList.remove('active');
    modalContainer.classList.remove('active');
}