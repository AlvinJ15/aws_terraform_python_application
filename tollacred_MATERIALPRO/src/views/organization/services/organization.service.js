
import apiManager from '@/config/ApiManager';

const NAME_ENTITY = 'organizations';

const OrganizationService = {
  getAll: async () => {
    try {
      return await apiManager.get(NAME_ENTITY);
    } catch (error) {
      throw error;
    }
  },

  get: async (organizationId) => {
    try {
      return await apiManager.get(`${NAME_ENTITY}/${organizationId}`);
    } catch (error) {
      throw error;
    }
  },

  update: async (endpoint, data, headers) => {
    try {
      return await apiManager.put(`${NAME_ENTITY}/${endpoint}`, data, headers);
    } catch (error) {
      throw error;
    }
  },
  create: async (endpoint, data) => {

    //let dataSend = (data instanceof FormData) ? data : JSON.stringify(data)
    try {
      return await apiManager.post(`${NAME_ENTITY}/${endpoint}`, data);
    } catch (error) {
      throw error;
    }
  },
  //more functions

  delete: async (endpoint) => {
    try {
      return await apiManager.delete(`${NAME_ENTITY}/${endpoint}`);
    } catch (error) {
      throw error;
    }
  },
  createNoJson: async (endpoint, data, headers) => {
    try {
      return await apiManager.postNoJson(`${NAME_ENTITY}/${endpoint}`, data, headers);
    } catch (error) {
      throw error;
    }
  },
  getDocuments: async (organizationId) => {
    try {
        return await apiManager.get(`organizations/${organizationId}/documents`)
    } catch (error) {
        console.error('my error', error)
    }
  },
};

export default OrganizationService;