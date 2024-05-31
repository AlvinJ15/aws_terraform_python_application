
import apiManager from '@/config/ApiManager';
import {useParams} from "react-router-dom";


const MessageService  = {

  getMessages: async (organizationId, conversationId, page=1) => {
    try {
      return await apiManager.get(`organizations/${organizationId}/conversations/${conversationId}/messages?page=${page}`)
    } catch (error) {
      console.error('my error', error)
    }
  },

  createMessage: async (organizationId, conversationId, messageData) => {
    try {
      return await apiManager.post(`organizations/${organizationId}/conversations/${conversationId}/messages`, messageData)
    } catch (error) {
      console.error('my error', error)
    }
  }
}
export default MessageService;