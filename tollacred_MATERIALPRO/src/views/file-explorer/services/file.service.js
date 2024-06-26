import apiManager from '@/config/ApiManager.js';


const FileService = {

    getFiles: async (organizationId, path) => {
        try {
            return await apiManager.get(`organizations/${organizationId}/files?path=${path}`)
        } catch (error) {
            console.error('my error', error)
        }
    },

    getSingleFile: async (organizationId, path) => {
        const file_name = path.split('/').pop();
        try {
            return await apiManager.get(`organizations/${organizationId}/files/${file_name}?path=${path}`)
        } catch (error) {
            console.error('my error', error)
        }
    },

    uploadFile: async (organizationId, path, data) => {
        try {
            return await apiManager.post(`organizations/${organizationId}/files?path=${path}`, data)
        } catch (error) {
            console.error('my error', error)
        }
    },

    editFile: async (organizationId, data, fileName) => {
        try {
            return await apiManager.put(`organizations/${organizationId}/files/${fileName}`, data)
        } catch (error) {
            console.error('my error', error)
        }
    },

    deleteFile: async (organizationId, data, fileName) => {
        try {
            return await apiManager.delete(`organizations/${organizationId}/files/${fileName}`, data)
        } catch (error) {
            console.error('my error', error)
        }
    },
}

export default FileService

