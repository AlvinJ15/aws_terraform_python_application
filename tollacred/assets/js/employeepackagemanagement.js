// Employee Documents Management
window.addEventListener("DOMContentLoaded", async () => {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    try {
        let employee = await loadEmployee(employeeId)
        localStorage.setItem('current_employee', JSON.stringify(employee));
        populateEmployeePackages(employee.compliance_packages);
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

function getFileName(path) {
  const parts = path.split('/'); // Split the path into an array of path segments
  return parts[parts.length - 1]; // Access the last element (filename)
}

async function downloadEmployeeDocument(employeeDocument) {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `dev/organizations/${organizationId}/employees/${employeeId}/documents/${employeeDocument.document_id}`;
    let response =  await makeRequest('GET', endpoint);
    // Get the download URL from the API call (replace with your actual API call logic)

    const downloadUrl = response.download_url

    // Create a new anchor element (link)
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Set the download attribute to force download behavior
    link.setAttribute("download", getFileName(response.s3_path)); // Change the filename if needed

    // Simulate a click on the link to trigger download
    link.click();
}

async function createEmployeePackage() {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    let organizationId = localStorage.getItem('organization_id');
    let updateEndpoint = `dev/organizations/${organizationId}/employees/${employeeId}`;
    let data = getAddEmployeePackageJson();
    let response = await makeRequest('PUT', updateEndpoint, data)
    if(response !== null){
        alert('Compliance Package Added !!!')
        location.reload();
    } else {
        alert('Error Adding the Compliance Package.')
    }
}

function getAddEmployeePackageJson(){
    let employee = JSON.parse(localStorage.getItem('current_employee'));
    const new_package_id = document.getElementById('compliance-packages').value;
    let packages = [];
    employee.compliance_packages.forEach(current_package => {
        packages.push(current_package.package_id)
    })
    packages.push(new_package_id)
  // Create JSON object
    return {
        compliance_packages: packages
    };
}

async function loadEmployee(employeeId){
    let organizationId = localStorage.getItem('organization_id')
    let endpoint = `dev/organizations/${organizationId}/employees/${employeeId}`;
    let response = await makeRequest('GET', endpoint)
    return response
}

function populateEmployeePackages(packages) {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    let tableBody = document.getElementById("packagesTableBody");

    // Clear existing rows
    tableBody.innerHTML = "";

    packages.forEach(each_package => {
        let row = tableBody.insertRow();
        let cellId = row.insertCell(0);
        let cellName = row.insertCell(1);
        let cellAction = row.insertCell(2);

        cellName.textContent = each_package.name;
        cellId.textContent = each_package.package_id;
        cellName.textContent  = each_package.name || "";
        cellAction.appendChild(createDeleteButton(each_package.package_id));
    });
}
function createDeleteButton(package_id){
    let uploadButton = document.createElement("button");
    uploadButton.innerHTML = "Delete";
    uploadButton.onclick = async function() {
        deleteEmployeeCompliancePackage(package_id);
    };
    return uploadButton;
}

async function deleteEmployeeCompliancePackage(packageIdDeleted) {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    let organizationId = localStorage.getItem('organization_id');
    let updateEndpoint = `dev/organizations/${organizationId}/employees/${employeeId}`;
    let employee = JSON.parse(localStorage.getItem('current_employee'));
    let packages = [];
    employee.compliance_packages.forEach(current_package => {
        packages.push(current_package.package_id)
    })
    packages = packages.filter(function (package_id) {
        return package_id !== packageIdDeleted;
    });
    let data = {
        compliance_packages: packages
    };

    let response = await makeRequest('PUT', updateEndpoint, data)
    if(response !== null){
        alert('Compliance Package Deleted !!!')
        location.reload();
    } else {
        alert('Error Deleting the Compliance Package.')
    }
}
/*
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
});*/