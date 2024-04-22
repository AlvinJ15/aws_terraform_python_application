// employeeModule.js

import { apiManager } from '../ApiManager';

export const employeeModule = {
    CustomServiceGet: async (endpoint, body) => {
        try {
            return await apiManager.get(endpoint, body);
        } catch (error) {
            throw error;
        }
    },
    CustomServicePost: async (endpoint, body) => {
        try {
            return await apiManager.get(endpoint, body);
        } catch (error) {
            throw error;
        }
    },
    createEmployee: async (postData) => {
        try {
            return await apiManager.post('posts', postData);
        } catch (error) {
            throw error;
        }
    },
    getEmployees: async () => {
        try {
            //const employees = await apiManager.getEmployees();
            //return employees;
            return await apiManager.get('users');
        } catch (error) {
            throw error;
        }
    },

    getEmployeeById: async (employeeId) => {
        try {
            return await apiManager.getEmployeeById(employeeId);
        } catch (error) {
            console.error(`not foundID ${employeeId}:`, error);
            throw error;
        }
    },
    //more functions
};
