window.addEventListener("DOMContentLoaded", async () => {
    try {
        let response = await loadRoles();
        populateRoleSelect(response);
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
