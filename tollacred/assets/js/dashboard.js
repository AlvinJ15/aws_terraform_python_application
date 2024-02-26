async function saveVariableAndRedirect(url, organization_id) {
  let token = await getApiToken()
  localStorage.setItem("organization_id", organization_id);

  // 3. Redirect to the desired URL
  setTimeout(() => window.location.href = url, 200); // Delay to ensure saving is complete
}