window.addEventListener("DOMContentLoaded", async () => {
    const employeeId = new URLSearchParams(window.location.search).get('employee_id');
    try {
        let response = await loadRoles();
        populateRoleSelect(response);
        const saveButton = document.getElementById("save_button");
        saveButton.addEventListener("click", () => {
            let data = getEmployeeJson();
            updateEmployee(employeeId, data);
        });
        await retrieveEmployeeInformation(employeeId)
    } catch (error) {
        console.error("Error adding options Employee:", error);
    }
});

function getEmployeeJson() {
    let birthday = document.getElementById('date-of-birth').value
    if (birthday) {
        birthday += ' 00:00:00'
    }
    return {
        role_id: document.getElementById('role').value,
        profile: {
            gender: document.getElementById('gender').value,
            title: document.getElementById('title').value,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            grade: document.getElementById('grade').value,
            medicalCategory: document.getElementById('medical-category').value,
            specialty: document.getElementById('speciality').value,
            date_of_birth: birthday,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            country: document.getElementById('country').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
        }
    };
}

async function setEmployeeIdQueryParameter() {
    // Get the current user ID from the URL query parameters
    const userId = new URLSearchParams(window.location.search).get('employee_id');

    // Select all `a` elements within the `ul`
    const links = document.querySelectorAll('.a');

    // Add the query parameter to each link's `href` attribute
    links.forEach(link => {
        const currentHref = link.href;
        const newHref = currentHref.includes('?') ? currentHref + '&employee_id=' + userId : currentHref + '?employee_id=' + userId;
        link.href = newHref;
    });
}

async function retrieveEmployeeInformation(employeeId) {
    let response = await loadEmployee(employeeId)
    fillFormulary(response);
}

function fillFormulary(response) {
    document.getElementById('role').value = response.role_id;
    // Title
    document.getElementById('candidate-name').text = `${response.profile.first_name} ${response.profile.last_name}`
    document.getElementById('gender').value = response.profile.gender;
    document.getElementById('title').value = response.profile.title;
    document.getElementById('first-name').value = response.profile.first_name;
    document.getElementById('last-name').value = response.profile.last_name;
    document.getElementById('grade').value = response.profile.grade;
    document.getElementById('medical-category').value = response.profile.medical_category;
    document.getElementById('speciality').value = response.profile.specialty;
    const dateString = response.profile.date_of_birth;
    document.getElementById('date-of-birth').value = dateString ? dateString.split(" ")[0] : null;
    document.getElementById('email').value = response.profile.email;
    document.getElementById('address').value = response.profile.address;
    document.getElementById('country').value = response.profile.country;
    document.getElementById('city').value = response.profile.city;
    document.getElementById('state').value = response.profile.state;
    document.getElementById('zip').value = response.profile.zip;
}