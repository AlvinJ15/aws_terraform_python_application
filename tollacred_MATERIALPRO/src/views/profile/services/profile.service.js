
import apiManager from '@/config/ApiManager';
import {getApiToken} from "@/config/AuthManager.js";

export const downloadDocumentService = async (endpoint) => {

  try {
      const response = await apiManager.get('organizations/'+endpoint)
      const url =  await response.download_url
      Object.assign(document.createElement('a'), {
        target: '_blank',
        rel: 'noopener noreferrer',
        href: url,
      }).click();
      URL.revokeObjectURL(url);
  }
  catch (error) {
      console.error('my error', error)
  }
}

export const updateStateDocument = async (endpoint ,review) => {

  try {
    const formData = new FormData()
    formData.append('status', review)
    return await apiManager.put('organizations/'+endpoint,formData,{
        'Authorization': await getApiToken(),
    })
  } catch (error) {
    console.error('my error', error)
  }

}
