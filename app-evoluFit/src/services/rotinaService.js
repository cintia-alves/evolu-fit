import { api } from './api';

export const rotinaService = {
  create: async (nome, usuarioId) => {
    return await api.post('/rotinas', { nome, usuario_id: usuarioId });
  },
  getByUser: async (usuarioId) => {
    return await api.get(`/rotinas/usuario/${usuarioId}`);
  },
  ativar: async (rotinaId, usuarioId) => {
    return await api.put(`/rotinas/${rotinaId}/ativar`, { usuario_id: usuarioId });
  },
  update: async (id, nome) => {
    return await api.put(`/rotinas/${id}`, { nome });
  },
  delete: async (id) => {
    return await api.delete(`/rotinas/${id}`);
  }
};