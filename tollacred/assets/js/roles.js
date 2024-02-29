window.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadRoles(); // Wait for the function to finish
  } catch (error) {
    console.error("Error adding options Roles:", error);
  }
});
function populateRoleSelect(data) {
    let selectElement = document.getElementById("role");
    selectElement.innerHTML = "";

    data.forEach(role => {
        selectElement.appendChild(new Option(role.name, role.name))
    });
}

async function loadRoles() {
  let organizationId = localStorage.getItem('organization_id')
  let endpoint = `organizations/${organizationId}/roles`;
  let response = await makeRequest('GET', endpoint)
  populateRoleSelect(response);
}
