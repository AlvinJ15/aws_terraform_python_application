import apiManager from '@/config/ApiManager';


const EmployeeService = {

    getEmployee: async (organizationId, employeeId) => {
        try {
            return await apiManager.get(`organizations/${organizationId}/employees/${employeeId}`)
        } catch (error) {
            console.error('my error', error)
        }
    },

    getEmployeeDocuments: async (organizationId, employeeId) => {
        try {
            return await apiManager.get(`organizations/${organizationId}/employees/${employeeId}/documents`)
        } catch (error) {
            console.error('my error', error)
        }
    },

    deleteEmployeedocument: async (organizationId, employeeId, documentId) => {
        try {
            return await apiManager.delete(`organizations/${organizationId}/employees/${employeeId}/documents/${documentId}`)
        } catch (error) {
            console.error('my error', error)
        }
    }
}

export default EmployeeService

