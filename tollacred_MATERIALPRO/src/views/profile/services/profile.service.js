
import apiManager from '@/config/ApiManager';
import {getApiToken} from "@/config/AuthManager.js";

export const downloadDocumentService = async (endpoint) => {

  try {
      const response = await apiManager.get('organizations/'+endpoint)
      const url =  await response.download_url
      const link = document.createElement('a')
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
    return await apiManager.get('organizations/'+endpoint,formData,{
        'Authorization': await getApiToken(),
    })
  } catch (error) {
    console.error('my error', error)
  }

}
