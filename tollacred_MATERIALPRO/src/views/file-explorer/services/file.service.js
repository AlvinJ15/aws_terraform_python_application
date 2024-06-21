import apiManager from '@/config/ApiManager.js';


const FileService = {

    getFiles: async (organizationId, path) => {
        try {
            return await apiManager.get(`organizations/${organizationId}/files?path=${path}`)
        } catch (error) {
            console.error('my error', error)
        }
    },

    getSingleFile: async (organizationId, file_name) => {
        try {
            return await apiManager.get(`organizations/${organizationId}/files/${file_name}`)
        } catch (error) {
            console.error('my error', error)
        }
    },

}

export default FileService

