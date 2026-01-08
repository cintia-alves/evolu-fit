const { db } = require('../database/db');
const { json, parseBody, getParams, matchRoute } = require('../utils/http');

// Helper para nome do dia da semana
const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

async function handleTreinos(req, res) {
    const url = req.url.replace('/api/treinos', '') || '/';
    const method = req.method;

    try {
        // GET /api/treinos/hoje/:rotinaId - Buscar treino do dia atual
        if (method === 'GET' && matchRoute('/hoje/:rotinaId', url)) {
            const { rotinaId } = getParams('/hoje/:rotinaId', url);
            const diaHoje = new Date().getDay(); // 0-6
            
            const treino = db.prepare(`
                SELECT * FROM treino WHERE rotina_id = ? AND dia_semana = ?
            `).get(rotinaId, diaHoje);
            
            if (!treino) {
                return json(res, { 
                    erro: 'Nenhum treino para hoje',
                    dia_semana: diaHoje,
                    dia_nome: DIAS_SEMANA[diaHoje]
                }, 404);
            }
            
            const exercicios = db.prepare(`
                SELECT e.*, te.series, te.repeticoes, te.carga, te.ordem
                FROM exercicio e
                JOIN treino_exercicio te ON e.id = te.exercicio_id
                WHERE te.treino_id = ?
                ORDER BY te.ordem
            `).all(treino.id);
            
            return json(res, { 
                ...treino, 
                dia_nome: DIAS_SEMANA[treino.dia_semana],
                exercicios 
            });
        }

        // GET /api/treinos/dia/:diaSemana/:rotinaId - Buscar treino por dia específico
        if (method === 'GET' && matchRoute('/dia/:diaSemana/:rotinaId', url)) {
            const { diaSemana, rotinaId } = getParams('/dia/:diaSemana/:rotinaId', url);
            const dia = parseInt(diaSemana);
            
            if (dia < 0 || dia > 6) {
                return json(res, { erro: 'Dia da semana deve ser de 0 (Domingo) a 6 (Sábado)' }, 400);
            }
            
            const treino = db.prepare(`
                SELECT * FROM treino WHERE rotina_id = ? AND dia_semana = ?
            `).get(rotinaId, dia);
            
            if (!treino) {
                return json(res, { 
                    erro: `Nenhum treino para ${DIAS_SEMANA[dia]}`,
                    dia_semana: dia,
                    dia_nome: DIAS_SEMANA[dia]
                }, 404);
            }
            
            const exercicios = db.prepare(`
                SELECT e.*, te.series, te.repeticoes, te.carga, te.ordem
                FROM exercicio e
                JOIN treino_exercicio te ON e.id = te.exercicio_id
                WHERE te.treino_id = ?
                ORDER BY te.ordem
            `).all(treino.id);
            
            return json(res, { 
                ...treino, 
                dia_nome: DIAS_SEMANA[treino.dia_semana],
                exercicios 
            });
        }

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
            
            return json(res, { 
                ...treino, 
                dia_nome: DIAS_SEMANA[treino.dia_semana],
                exercicios 
            });
        }

        // POST /api/treinos - Criar treino com exercícios
        if (method === 'POST' && url === '/') {
            const { nome, dia_semana, rotina_id, exercicios } = await parseBody(req);
            
            // Validar dia da semana
            if (dia_semana < 0 || dia_semana > 6) {
                return json(res, { erro: 'Dia da semana deve ser de 0 (Domingo) a 6 (Sábado)' }, 400);
            }
            
            const inserirTreino = db.transaction(() => {
                const resultado = db.prepare(`
                    INSERT INTO treino (nome, dia_semana, rotina_id) VALUES (?, ?, ?)
                `).run(nome, dia_semana, rotina_id);
                
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
                dia_nome: DIAS_SEMANA[dia_semana],
                mensagem: 'Treino criado!' 
            }, 201);
        }

        // PUT /api/treinos/: id/concluir - Marcar como concluído
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
            
            return json(res, { mensagem: 'Treino concluído!  💪' });
        }

        // DELETE /api/treinos/:id - Remover
        if (method === 'DELETE' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            
            const resultado = db.prepare('DELETE FROM treino WHERE id = ?').run(id);
            
            if (resultado.changes === 0) {
                return json(res, { erro:'Treino não encontrado' }, 404);
            }
            
            return json(res, { mensagem:'Treino removido!'});
        }

        return json(res, { erro: 'Rota não encontrada' }, 404);

    } catch (error) {
        return json(res, { erro: error.message }, 500);
    }
}

module.exports = { handleTreinos };