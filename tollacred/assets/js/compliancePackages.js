window.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadCompliancePackages(); // Wait for the function to finish
  } catch (error) {
    console.error("Error adding options CompliancePackages:", error);
  }
});
function populateCompliancePackageSelect(data) {
    let selectElement = document.getElementById("compliance-packages");
    selectElement.innerHTML = "";

    data.forEach(com_package => {
        selectElement.appendChild(new Option(com_package.name, com_package.package_id))
    });
}

async function loadCompliancePackages() {
  let organizationId = localStorage.getItem('organization_id')
  let endpoint = `dev/organizations/${organizationId}/compliancePackages`;
  let response = await makeRequest('GET', endpoint)
  populateCompliancePackageSelect(response);
}
