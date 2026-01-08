import { api } from './api';

export const rotinaService = {
  create: async (nome, usuarioId) => {
    return await api.post('/rotinas', { 
      nome, 
      usuario_id: usuarioId 
    });
  },

  getByUser: async (usuarioId) => {
    return await api.get(`/rotinas/usuario/${usuarioId}`);
  }
};