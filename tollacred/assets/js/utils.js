function buildUrl(baseUrl, params) {
  let queryString = "";
  for (const key in params) {
    if (queryString.length > 0) {
      queryString += "&";
    }
    queryString += `${key}=${params[key]}`;
  }
  return baseUrl + "?" + queryString;
}