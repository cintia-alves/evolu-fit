const API_URL = 'http://192.168.0.5:3000/api'; 

export const api = {
  post: async (endpoint, body) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.erro || 'Erro na requisição');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};