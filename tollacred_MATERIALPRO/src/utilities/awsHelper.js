
const AwsHelper = {

  uploadFile: async (url, data, tags) => {
    const urlEncodedTags = Object.keys(tags)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(tags[key]))
      .join("&");

    const headers = new Headers();
    headers.append("x-amz-tagging", urlEncodedTags);

    return fetch(url, {
      method: "PUT",
      body: data,
      headers
    });
  }
}
export default AwsHelper