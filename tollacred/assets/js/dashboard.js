async function saveVariableAndRedirect(url, organization_id, organization_name) {
  let token = await getApiToken()
  localStorage.setItem("organization_id", organization_id);
  localStorage.setItem("organization_name", organization_name);
  // 3. Redirect to the desired URL
  setTimeout(() => window.location.href = url, 200); // Delay to ensure saving is complete
}

function goBack() {
  history.back();
}