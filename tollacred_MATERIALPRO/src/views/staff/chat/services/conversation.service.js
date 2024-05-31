import apiManager from '@/config/ApiManager';


const ConversationService = {

    getAllConversations: async (organizationId, page=1) => {
        try {
            return await apiManager.get(`organizations/${organizationId}/conversations?page=${page}`)
        } catch (error) {
            console.error('my error', error)
        }
    },

    getSingleConversation: async (organizationId, conversationId) => {
        try {
            return await apiManager.get(`organizations/${organizationId}/conversations/${conversationId}`)
        } catch (error) {
            console.error('my error', error)
        }
    },

    deleteConversation: async (organizationId, conversationId) => {
        try {
            return await apiManager.delete(`organizations/${organizationId}/conversations/${conversationId}`)
        } catch (error) {
            console.error('my error', error)
        }
    },

    getUserConversation: async (organizationId, userId) => {
        try {
            return await apiManager.get(`organizations/${organizationId}/employees/${userId}/conversations/`)
        } catch (error) {
            console.error('my error', error)
        }
    },

    createUserConversation: async (organizationId, userId, data) => {
        try {
            return await apiManager.post(`organizations/${organizationId}/employees/${userId}/conversations/`, data)
        } catch (error) {
            console.error('my error', error)
        }
    },

    updateUserConversation: async (organizationId, userId, data) => {
        try {
            return await apiManager.put(`organizations/${organizationId}/employees/${userId}/conversations/`, data)
        } catch (error) {
            console.error('my error', error)
        }
    }
}

export default ConversationService

