
import apiManager from '@/config/ApiManager';

const NAME_ENTITY = 'staff';

const staffService = {
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

  create: async (endpoint, data) => {
      try {
          return await apiManager.post(`${NAME_ENTITY}/${endpoint}`, data);
      } catch (error) {
          throw error;
      }
  },
    //more functions
};

export default staffService;