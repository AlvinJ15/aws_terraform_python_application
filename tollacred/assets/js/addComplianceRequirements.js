window.addEventListener('DOMContentLoaded', async (event) => {
    let data = await executeBaseRequests();
    fillDocumentTypesTable(data.documentTypes);
    fillRolesTable(data.roles);
});

async function executeBaseRequests(page) {
    try {
        const [roles, documentTypes] = await Promise.all([
            loadRoles(),
            loadDocumentTypes()
        ]);
        return {roles, documentTypes}
        // Your code here after both responses are received
    } catch (error) {
        console.error("Error:", error);
    }
}

function fillDocumentTypesTable(data) {
    let tableBody = document.getElementById("documentTypesTableBody");
    tableBody.innerHTML = "";
    data.forEach(documentType => {
        let row = tableBody.insertRow();
        let cellCheck = row.insertCell(0);
        let cellName = row.insertCell(1);
        let cellDescription = row.insertCell(2);
        let cellCategory = row.insertCell(3);
        let cellExpiration = row.insertCell(4);
        let checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.value = documentType.id;
        checkBox.id = documentType.id;
        let label = document.createElement('label');
        label.setAttribute('for', documentType.id);
        cellCheck.appendChild(checkBox);
        cellCheck.appendChild(label);
        cellName.textContent = documentType.name || "";
        cellDescription.textContent = documentType.description;
        cellCategory.textContent = documentType.category;
        cellExpiration.textContent = documentType.expiration;
    });
}

function fillRolesTable(data) {
    let tableBody = document.getElementById("rolesTableBody");
    tableBody.innerHTML = "";
    data.forEach(role => {
        let row = tableBody.insertRow();
        let cellCheck = row.insertCell(0);
        let cellName = row.insertCell(1);
        let cellDescription = row.insertCell(2);
        let cellType = row.insertCell(3);
        let checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.value = role.role_id;
        checkBox.id = role.role_id;
        let label = document.createElement('label');
        label.setAttribute('for', role.role_id);
        cellCheck.appendChild(checkBox);
        cellCheck.appendChild(label);
        cellName.textContent = role.name || "";
        cellDescription.textContent = role.description;
        cellType.textContent = role.type;
    });
}

async function saveButtonAction(){
    let data = getCompliancePackageJson();
    let response = await createCompliancePackage(data);
    if (response){
        alert('CompliancePackage Created');
    }
    else {
        alert('Error Creating Compliance Package');
    }

}

function getCompliancePackageJson(){
    let packageName = document.getElementById('package-name').value;
    let rolesTable = document.getElementById('rolesTableBody');
    let rolesIdList = [];
    let selectedRoles = rolesTable.querySelectorAll('input[type="checkbox"]:checked');
    selectedRoles.forEach(roleCheckbox => {
       rolesIdList.push(roleCheckbox.value);
    });
    let documentsTable = document.getElementById('documentTypesTableBody');
    let documentsIdList = [];
    let selectedDocuments = documentsTable.querySelectorAll('input[type="checkbox"]:checked');
    selectedDocuments.forEach(documentCheckbox => {
       documentsIdList.push(documentCheckbox.value);
    });

    return {
        name: packageName,
        roles: rolesIdList,
        document_types: documentsIdList
    }
}
