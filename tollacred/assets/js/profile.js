
window.addEventListener("DOMContentLoaded", async () => {
    setEmployeeTitle();
    setEmployeeIdQueryParameter();
});

async function setEmployeeIdQueryParameter() {
    // Get the current user ID from the URL query parameters
    const userId = new URLSearchParams(window.location.search).get('employee_id');

    // Select all `a` elements within the `ul`
    const links = document.querySelector('.profile_links').querySelectorAll('a');

    // Add the query parameter to each link's `href` attribute
    links.forEach(link => {
      const currentHref = link.href;
      const newHref = currentHref.includes('?') ? currentHref + '&employee_id=' + userId : currentHref + '?employee_id=' + userId;
      link.href = newHref;
    });
}

function setEmployeeTitle() {
    let employee = getLocalEmployee();
    let titleElement = document.getElementById('profile-title');
    titleElement.innerHTML = `Welcome to the profile of ${employee.profile.first_name} ${employee.profile.last_name}`;
}