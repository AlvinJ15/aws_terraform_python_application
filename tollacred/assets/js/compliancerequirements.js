let currentCompliancePackage;
let lastModalElement;
// Function to get a list of all compliance packages associated with organization_id
window.addEventListener('DOMContentLoaded', (event) => {
    getAllCompliancePackages();
});

async function getAllCompliancePackages() {
    let data = await loadCompliancePackages();
    if (data){
        populateCompliancePackageTable(data);
    }
    else {
        console.error('Error:');
        // Handle error (replace with your actual error handling logic)
        alert("Error fetching compliance packages. Please try again.");
    }
}

// Function to populate the compliance package table with data
function populateCompliancePackageTable(data) {
    let tableBody = document.getElementById("compliancePackageTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    // Iterate through the data and add rows to the table
    data.forEach(compliancePackage => {
        let row = tableBody.insertRow();
        let cellId = row.insertCell(0);
        let cellName = row.insertCell(1);
        let cellCreation = row.insertCell(2);
        let cellAction = row.insertCell(3)

        cellId.textContent = compliancePackage.package_id || "";
        cellName.textContent = compliancePackage.name || "";
        cellCreation.textContent = compliancePackage.creation_date || "";
        createEditButtons(compliancePackage, cellAction);
    });
}

function createEditButtons(compliancePackage, editCell) {
    let deleteButton = document.createElement("button");

    // Set attributes for "Delete" button
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteCompliancePackageBtn(compliancePackage);
    };

    // Append buttons to the cell
    editCell.appendChild(createUpdateButtonTable(compliancePackage));
    editCell.appendChild(deleteButton);

    return editCell;
}

function createUpdateButtonTable(compliancePackage){
    let openModalBtn = document.createElement("button");
    openModalBtn.innerHTML = "Update";
    openModalBtn.onclick = function() {
        currentCompliancePackage = compliancePackage;
        fillCurrentCompliancePackage(currentCompliancePackage)
        lastModalElement = document.getElementById("modal-update");
        const modalContainer = document.getElementById('modal-container');
        modalContainer.classList.add('active');
        lastModalElement.classList.add('active');
    };
    return openModalBtn;
}

function fillCurrentCompliancePackage(compliancePackage){
    document.getElementById('package-name').value = compliancePackage.name;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(check => {
        check.checked = false;
    });
    compliancePackage.roles.forEach(roleId => {
        document.getElementById(roleId).checked = true;
    });
    compliancePackage.document_types.forEach(documentId => {
        document.getElementById(documentId).checked = true;
    });
}

async function modalUpdateBtn(){
    let jsonRequestBody = getCompliancePackageJson();
    let response = await updateCompliancePackage(currentCompliancePackage.package_id, jsonRequestBody);
    if (response){
        alert('CompliancePackage Updated.')
        closeModalBtn();
    }
    else {
        console.error('Error:');
        // Handle error (replace with your actual error handling logic)
        alert("Error updating CompliancePackage.");
    }
}

async function deleteCompliancePackageBtn(compliancePackage){
    if (confirm('Are you sure you want to remove this package?') === true) {
        let response = await deleteCompliancePackage(compliancePackage.package_id);
        if (response){
            alert('compliancePackage Deleted');
            location.reload();
        }
        else {
            console.error('Error:');
            // Handle error (replace with your actual error handling logic)
            alert("Error deleting compliancePackage. Please try again.");
        }
    }
}

function closeModalBtn() {
    const modalContainer = document.getElementById('modal-container');
    lastModalElement.classList.remove('active');
    modalContainer.classList.remove('active');
}


