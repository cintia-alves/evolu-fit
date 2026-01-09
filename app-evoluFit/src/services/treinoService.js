import { api } from './api';

export const treinoService = {
    create: async (dados) => {
        return await api.post('/treinos', dados);
    },
    update: async (id, dados) => {
        return await api.put(`/treinos/${id}`, dados);
    },
    updateExercises: async (treinoId, exerciciosIds) => {
        return await api.put(`/treinos/${treinoId}/exercicios`, { exerciciosIds });
    },
    delete: async (id) => {
        return await api.delete(`/treinos/${id}`);
    },
    concluir: async (id) => {
        return await api.put(`/treinos/${id}/concluir`, {});
    },
    updateExerciseData: async (treinoExercicioId, data) => {
        // Seria necessário uma rota específica no back para atualizar series/reps de um item específico
        // Por enquanto vamos focar em "Finalizar Treino" marcando como concluído
    }
};