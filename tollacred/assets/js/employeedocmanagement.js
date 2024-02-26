// Employee Documents Management
window.addEventListener("DOMContentLoaded", async () => {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    try {
        let employeeDocuments = await loadEmployeeDocuments(employeeId)
        let documents_all = await loadAllDocumentTypes(employeeDocuments); // Wait for the function to finish
        let documents = await loadCompliancePackageDocuments(documents_all);
        let mandatoryDocuments = documents.mandatory;
        let nonMandatoryDocuments = documents.non_mandatory;
        populateMandatoryDocuments(mandatoryDocuments, employeeDocuments)
        populateNonMandatoryDocuments(nonMandatoryDocuments, employeeDocuments)
    } catch (error) {
        console.error("Error adding options Roles:", error);
    }
});

function createReviewButton(employeeDocument){
    let reviewButton = document.createElement("button");
    reviewButton.innerHTML = "Review";
    reviewButton.onclick = function() {
        downloadEmployeeDocument(employeeDocument);
    };
    return reviewButton;
}

function downloadEmployeeDocument(employeeDocument){
    alert(employeeDocument.s3_path);
}

let documentTypeSaved = null;
let employeeIdSaved = null
const fileInputMandatory = document.getElementById('fileNoMandatory');
fileInputMandatory.addEventListener('change', async (event) => {
    if (event.target.files.length > 0) {
        const selectedFile = event.target.files[0];
        let response = await uploadEmployeeDocument(documentTypeSaved, employeeIdSaved, selectedFile);
        if (response) {
            alert('Document Uploaded');
        }
        else {
            alert('Error when Uploading');
        }
    }
});

function createUploadButton(documentType, employeeId){
    let uploadButton = document.createElement("button");
    uploadButton.innerHTML = "Upload";
    uploadButton.onclick = async function() {
        documentTypeSaved = documentType;
        employeeIdSaved = employeeId;
        document.getElementById('fileNoMandatory').click();
    };
    return uploadButton;

}

async function uploadEmployeeDocument(documentType, employeeId, file){
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type_id', documentType.id);
    formData.append('status', 'Awaiting Approval');
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `dev/organizations/${organizationId}/employees/${employeeId}/documents`;
    return await makeRequest('POST', endpoint, formData, false)
}

async function loadEmployeeDocuments(employeeId){
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `dev/organizations/${organizationId}/employees/${employeeId}/documents`;
    let response = await makeRequest('GET', endpoint)
    return response
}

async function loadAllDocumentTypes() {
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `dev/organizations/${organizationId}/documents`;
    let response = await makeRequest('GET', endpoint)
    return response
}

async function loadCompliancePackageDocuments(all_documents){
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `dev/organizations/${organizationId}/employees/${employeeId}`;
    let response = await makeRequest('GET', endpoint)
    let packages = response.compliance_packages;
    let document_types = []
    packages.forEach(package => {
        document_types.push(...package.document_types)
    });
    const uniqueList = [...new Set(document_types)];
    let mandatory = []
    let non_mandatory = []
    all_documents.forEach(document => {
        if(uniqueList.indexOf(document.id) !== -1){
            mandatory.push(document);
        } else {
            non_mandatory.push(document);
        }
    })
    return {
        mandatory: mandatory,
        non_mandatory: non_mandatory
    }
}


function populateMandatoryDocuments(all_documents, employee_documents) {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    var tableBody = document.getElementById("employeeDocumentsTableMandatory");

    // Clear existing rows
    tableBody.innerHTML = "";

    let employeeDocumentsMap = new Map()
    employee_documents.forEach(document => {
        employeeDocumentsMap.set(document.document_type_id, document);
    });
    all_documents.forEach(documentType => {
        let row = tableBody.insertRow();
        let cellName = row.insertCell(0);
        let cellStatus = row.insertCell(1);
        let cellExpiry = row.insertCell(2);
        let cellApproval = row.insertCell(3);
        let cellAction = row.insertCell(4);

        cellName.textContent = documentType.name;
        if (employeeDocumentsMap.has(documentType.id)){
            let employeeDocument = employeeDocumentsMap.get(documentType.id);
            cellStatus.textContent = employeeDocument.status;
            cellExpiry.textContent  = employeeDocumentsMap.get(documentType.id).expiry_date || "";
            cellApproval.textContent = employeeDocumentsMap.get(documentType.id).approver_id
            cellAction.appendChild(createReviewButton(employeeDocument));
        }
        else {
            cellStatus.textContent = "Not Uploaded";
            cellApproval.textContent = "";
            cellExpiry.textContent = ""
            cellAction.appendChild(createUploadButton(documentType, employeeId))
        }
    });
}

function populateNonMandatoryDocuments(all_documents, employee_documents) {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    var tableBody = document.getElementById("employeeDocumentsTableNonMandatory");

    // Clear existing rows
    tableBody.innerHTML = "";

    let employeeDocumentsMap = new Map()
    employee_documents.forEach(document => {
        employeeDocumentsMap.set(document.document_type_id, document);
    });
    all_documents.forEach(documentType => {
        let row = tableBody.insertRow();
        let cellName = row.insertCell(0);
        let cellStatus = row.insertCell(1);
        let cellApproval = row.insertCell(2);
        let cellAction = row.insertCell(3);

        cellName.textContent = documentType.name;
        if (employeeDocumentsMap.has(documentType.id)){
            let employeeDocument = employeeDocumentsMap.get(documentType.id);
            cellStatus.textContent = employeeDocument.status;
            cellApproval.textContent  = employeeDocumentsMap.get(documentType.id).expiry_date || "";
            cellAction.appendChild(createReviewButton(employeeDocument));
        }
        else {
            cellStatus.textContent = "Not Uploaded";
            cellApproval.textContent = "";
            cellAction.appendChild(createUploadButton(documentType, employeeId))
        }
    });
}

const tabs = document.querySelectorAll('.tab');
const tables = document.querySelectorAll('table');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));  // Remove active state from all tabs
    tab.classList.add('active');  // Set clicked tab as active

    const targetTableId = tab.dataset.targetTable;  // Get target table ID
    const targetTable = document.getElementById(targetTableId);  // Select target table

    tables.forEach(table => table.style.display = 'none');  // Initially hide all tables
    targetTable.style.display = 'table';  // Show the target table
  });
});