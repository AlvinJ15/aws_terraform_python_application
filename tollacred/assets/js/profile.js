
window.addEventListener("DOMContentLoaded", async () => {
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