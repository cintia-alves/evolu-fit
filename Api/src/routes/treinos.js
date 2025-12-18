const { db } = require('../database/db');
const { json, parseBody, getParams, matchRoute } = require('../utils/http');

async function handleTreinos(req, res) {
    const url = req.url.replace('/api/treinos', '') || '/';
    const method = req.method;

    try {
        // GET /api/treinos/:id - Buscar treino com exercícios
        if (method === 'GET' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            
            const treino = db.prepare('SELECT * FROM treino WHERE id = ?').get(id);
            
            if (!treino) {
                return json(res, { erro: 'Treino não encontrado' }, 404);
            }
            
            const exercicios = db.prepare(`
                SELECT e.*, te.series, te.repeticoes, te.carga, te.ordem
                FROM exercicio e
                JOIN treino_exercicio te ON e.id = te.exercicio_id
                WHERE te.treino_id = ?
                ORDER BY te.ordem
            `).all(id);
            
            return json(res, { ...treino, exercicios });
        }

        // POST /api/treinos - Criar treino com exercícios
        if (method === 'POST' && url === '/') {
            const { nome, data, rotina_id, exercicios } = await parseBody(req);
            
            const inserirTreino = db.transaction(() => {
                const resultado = db.prepare(`
                    INSERT INTO treino (nome, data, rotina_id) VALUES (?, ?, ?)
                `).run(nome, data, rotina_id);
                
                const treinoId = resultado.lastInsertRowid;
                
                if (exercicios && exercicios.length > 0) {
                    const inserirExercicio = db.prepare(`
                        INSERT INTO treino_exercicio 
                        (treino_id, exercicio_id, series, repeticoes, carga, ordem) 
                        VALUES (?, ?, ?, ?, ?, ?)
                    `);
                    
                    exercicios.forEach((ex, index) => {
                        inserirExercicio.run(
                            treinoId,
                            ex.exercicio_id,
                            ex.series || 3,
                            ex.repeticoes || 12,
                            ex.carga || 0,
                            ex.ordem || index
                        );
                    });
                }
                
                return treinoId;
            });
            
            const treinoId = inserirTreino();
            
            return json(res, { 
                id: treinoId,
                mensagem: 'Treino criado!' 
            }, 201);
        }

        // PUT /api/treinos/:id/concluir - Marcar como concluído
        if (method === 'PUT' && matchRoute('/:id/concluir', url)) {
            const { id } = getParams('/:id/concluir', url);
            
            const resultado = db.prepare(`
                UPDATE treino 
                SET concluido = 1, atualizado_em = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(id);
            
            if (resultado.changes === 0) {
                return json(res, { erro: 'Treino não encontrado' }, 404);
            }
            
            return json(res, { mensagem: 'Treino concluído! 💪' });
        }

        // DELETE /api/treinos/:id - Remover
        if (method === 'DELETE' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            
            const resultado = db.prepare('DELETE FROM treino WHERE id = ?').run(id);
            
            if (resultado.changes === 0) {
                return json(res, { erro: 'Treino não encontrado' }, 404);
            }
            
            return json(res, { mensagem: 'Treino removido!' });
        }

        return json(res, { erro: 'Rota não encontrada' }, 404);

    } catch (error) {
        return json(res, { erro: error.message }, 500);
    }
}

module.exports = { handleTreinos };