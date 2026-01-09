import { api } from './api';

export const authService = {
  login: async (email, senha) => {
    // Chama a rota POST /api/usuarios/login definida no seu backend
    const response = await api.post('/usuarios/login', { email, senha });
    return response; // Espera-se { mensagem: '...', usuario: { id, nome... } }
  },

  register: async (userData) => {
    // Chama a rota POST /api/usuarios definida no seu backend
    // userData deve ser { nome, email, senha, avatar }
    const response = await api.post('/usuarios', userData);
    return response;
  }
};