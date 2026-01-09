const { db } = require('../database/db');
const { json, parseBody, getParams, matchRoute } = require('../utils/http');

async function handleRotinas(req, res) {
    const url = req.url.replace('/api/rotinas', '') || '/';
    const method = req.method;

    try {
        // GET /api/rotinas/usuario/:usuarioId
        if (method === 'GET' && matchRoute('/usuario/:usuarioId', url)) {
            const { usuarioId } = getParams('/usuario/:usuarioId', url);
            const rotinas = db.prepare('SELECT * FROM rotina WHERE usuario_id = ?').all(usuarioId);
            return json(res, rotinas);
        }

        // GET /api/rotinas/:id
        if (method === 'GET' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            
            const rotina = db.prepare('SELECT * FROM rotina WHERE id = ?').get(id);
            if (!rotina) return json(res, { erro: 'Rotina não encontrada' }, 404);
            
            const treinos = db.prepare('SELECT * FROM treino WHERE rotina_id = ?').all(id);
            
            // Enriquecer dados dos treinos
            const treinosEnriquecidos = treinos.map(treino => {
                // Contar total
                const count = db.prepare('SELECT count(*) as total FROM treino_exercicio WHERE treino_id = ?').get(treino.id);
                
                // Pegar categorias (grupos musculares) únicos
                const grupos = db.prepare(`
                    SELECT DISTINCT gm.nome 
                    FROM grupo_muscular gm
                    JOIN exercicio_grupo_muscular egm ON gm.id = egm.grupo_muscular_id
                    JOIN treino_exercicio te ON egm.exercicio_id = te.exercicio_id
                    WHERE te.treino_id = ?
                    LIMIT 4
                `).all(treino.id);

                // Pegar objetos completos dos exercícios selecionados (ID e Nome)
                const exercicios = db.prepare(`
                    SELECT e.id, e.nome 
                    FROM exercicio e
                    JOIN treino_exercicio te ON e.id = te.exercicio_id 
                    WHERE te.treino_id = ?
                `).all(treino.id);

                return {
                    ...treino,
                    total_exercicios: count.total,
                    grupos: grupos.map(g => g.nome), // ['Peito', 'Tríceps']
                    exercicios: exercicios // Array de objetos {id, nome}
                };
            });

            return json(res, { ...rotina, treinos: treinosEnriquecidos });
        }

        // POST /api/rotinas
        if (method === 'POST' && url === '/') {
            const { nome, usuario_id } = await parseBody(req);
            
            // Verifica se é a primeira rotina do usuário. Se for, já nasce ativa.
            const count = db.prepare('SELECT count(*) as total FROM rotina WHERE usuario_id = ?').get(usuario_id);
            const ativa = count.total === 0 ? 1 : 0;

            const resultado = db.prepare(`
                INSERT INTO rotina (nome, usuario_id, ativa) VALUES (?, ?, ?)
            `).run(nome, usuario_id, ativa);
            
            // Retorna o objeto completo para o front já usar
            return json(res, { 
                id: resultado.lastInsertRowid,
                nome,
                usuario_id,
                ativa,
                mensagem: 'Rotina criada!' 
            }, 201);
        }

        // PUT /api/rotinas/:id - Atualizar
        if (method === 'PUT' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            const { nome } = await parseBody(req);
            
            const resultado = db.prepare(`
                UPDATE rotina 
                SET nome = ?, atualizado_em = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(nome, id);
            
            if (resultado.changes === 0) {
                return json(res, { erro: 'Rotina não encontrada' }, 404);
            }
            
            return json(res, { mensagem: 'Rotina atualizada!' });
        }

        //PUT /api/rotinas/:id/ativar - Define rotina como a principal
        if (method === 'PUT' && matchRoute('/:id/ativar', url)) {
            const { id } = getParams('/:id', url);
            const { usuario_id } = await parseBody(req); // Precisamos saber de quem é para desativar as outras

            const ativar = db.transaction(() => {
                // 1. Desativa todas as rotinas deste usuário
                db.prepare('UPDATE rotina SET ativa = 0 WHERE usuario_id = ?').run(usuario_id);
                
                // 2. Ativa a rotina específica
                const result = db.prepare('UPDATE rotina SET ativa = 1 WHERE id = ?').run(id);
                return result;
            });

            const resultado = ativar();

            if (resultado.changes === 0) {
                return json(res, { erro: 'Rotina não encontrada' }, 404);
            }

            return json(res, { mensagem: 'Rotina definida como principal!' });
        }

        // DELETE /api/rotinas/:id
        if (method === 'DELETE' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            // Antes de deletar, verifica se era a ativa. Se for, talvez precise ativar outra (logica de negocio complexa, vamos simplificar deletando apenas)
            const resultado = db.prepare('DELETE FROM rotina WHERE id = ?').run(id);
            if (resultado.changes === 0) return json(res, { erro: 'Rotina não encontrada' }, 404);
            return json(res, { mensagem: 'Rotina removida!' });
        }

        // --- NOVO: PUT /api/rotinas/:id/ativar ---
        if (method === 'PUT' && matchRoute('/:id/ativar', url)) {
            const { id } = getParams('/:id/ativar', url);
            const { usuario_id } = await parseBody(req);

            const transaction = db.transaction(() => {
                // 1. Desativa todas as rotinas do usuário
                db.prepare('UPDATE rotina SET ativa = 0 WHERE usuario_id = ?').run(usuario_id);
                // 2. Ativa a rotina atual
                const res = db.prepare('UPDATE rotina SET ativa = 1 WHERE id = ?').run(id);
                return res;
            });

            const info = transaction();
            if (info.changes === 0) return json(res, { erro: 'Erro ao ativar' }, 400);
            return json(res, { mensagem: 'Rotina ativada com sucesso' });
        }

        return json(res, { erro: 'Rota não encontrada' }, 404);

    } catch (error) {
        return json(res, { erro: error.message }, 500);
    }
}

module.exports = { handleRotinas };