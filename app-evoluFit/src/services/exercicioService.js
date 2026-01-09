import { api } from './api';

export const exercicioService = {
  getGrupos: async () => {
    return await api.get('/exercicios/grupos');
  },
  getByGrupo: async (grupoId) => {
    return await api.get(`/exercicios/grupo/${grupoId}`);
  },
  getAll: async () => {
    return await api.get('/exercicios');
  }
};