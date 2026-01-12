const { db } = require('../database/db');
const { json, parseBody, getParams, matchRoute } = require('../utils/http');

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

async function handleTreinos(req, res) {
    const url = req.url.replace('/api/treinos', '') || '/';
    const method = req.method;

    try {
        // --- ROTAS GET ---

        // GET /api/treinos/dia/:diaSemana/:rotinaId (Rota Principal da Dashboard)
        if (method === 'GET' && matchRoute('/dia/:diaSemana/:rotinaId', url)) {
            const { diaSemana, rotinaId } = getParams('/dia/:diaSemana/:rotinaId', url);
            const dia = parseInt(diaSemana);
            
            if (isNaN(dia) || dia < 0 || dia > 6) {
                return json(res, { erro: 'Dia inválido' }, 400);
            }
            
            // 1. Buscar Treino
            const treino = db.prepare(`
                SELECT * FROM treino WHERE rotina_id = ? AND dia_semana = ?
            `).get(rotinaId, dia);
            
            if (!treino) {
                 return json(res, null);
            }
            // 2. Buscar Nome da Rotina
            const rotina = db.prepare('SELECT nome FROM rotina WHERE id = ?').get(rotinaId);
            
            // 3. Grupos Musculares (Categorias)
            const grupos = db.prepare(`
                SELECT DISTINCT gm.nome
                FROM grupo_muscular gm
                JOIN exercicio_grupo_muscular egm ON gm.id = egm.grupo_muscular_id
                JOIN treino_exercicio te ON egm.exercicio_id = te.exercicio_id
                WHERE te.treino_id = ?
                LIMIT 3
            `).all(treino.id);

            // 4. Contagem total de exercícios
            const count = db.prepare('SELECT count(*) as total FROM treino_exercicio WHERE treino_id = ?').get(treino.id);

            return json(res, { 
                ...treino, 
                rotina_nome: rotina ? rotina.nome : 'Rotina Personalizada',
                dia_nome: DIAS_SEMANA[treino.dia_semana],
                grupos: grupos.map(g => g.nome), // Retorna array de strings: ['Peito', 'Ombro']
                total_exercicios: count.total
            });
        }

        // POST /api/treinos
        if (method === 'POST' && url === '/') {
            const { nome, dia_semana, rotina_id } = await parseBody(req);
            if (dia_semana === undefined || dia_semana < 0 || dia_semana > 6) return json(res, { erro: 'Dia inválido' }, 400);
            const resultado = db.prepare('INSERT INTO treino (nome, dia_semana, rotina_id) VALUES (?, ?, ?)').run(nome, dia_semana, rotina_id);
            return json(res, { id: resultado.lastInsertRowid, mensagem: 'Treino criado!' }, 201);
        }

        // PUT /api/treinos/:id/exercicios
        if (method === 'PUT' && matchRoute('/:id/exercicios', url)) {
            const { id } = getParams('/:id/exercicios', url);
            const { exerciciosIds } = await parseBody(req);
            const atualizar = db.transaction(() => {
                db.prepare('DELETE FROM treino_exercicio WHERE treino_id = ?').run(id);
                const insert = db.prepare('INSERT INTO treino_exercicio (treino_id, exercicio_id) VALUES (?, ?)');
                exerciciosIds.forEach(exId => insert.run(id, exId));
            });
            atualizar();
            return json(res, { mensagem: 'Atualizado!' });
        }

        if (method === 'PUT' && matchRoute('/:id/concluir', url)) {
            const { id } = getParams('/:id/concluir', url);
            const resultado = db.prepare(`
                UPDATE treino SET concluido = 1, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?
            `).run(id);
            if (resultado.changes === 0) return json(res, { erro: 'Treino não encontrado' }, 404);
            return json(res, { mensagem: 'Treino concluído!' });
        }

        // PUT /api/treinos/:id (Edição genérica)
        if (method === 'PUT' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            const { nome, dia_semana } = await parseBody(req);

            const resultado = db.prepare(`
                UPDATE treino SET nome = ?, dia_semana = ? WHERE id = ?
            `).run(nome, dia_semana, id);

            if (resultado.changes === 0) return json(res, { erro: 'Treino não encontrado' }, 404);
            return json(res, { mensagem: 'Treino atualizado!' });
        }

        // GET /api/treinos/:id
        if (method === 'GET' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            const treino = db.prepare('SELECT * FROM treino WHERE id = ?').get(id);
            if (!treino) return json(res, { erro: 'Treino não encontrado' }, 404);
            
            const exercicios = db.prepare(`
                SELECT e.*, te.series, te.repeticoes, te.carga, te.ordem
                FROM exercicio e
                JOIN treino_exercicio te ON e.id = te.exercicio_id
                WHERE te.treino_id = ?
                ORDER BY te.ordem
            `).all(id);
            
            return json(res, { ...treino, exercicios });
        }

        // DELETE /api/treinos/:id
        if (method === 'DELETE' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            const resultado = db.prepare('DELETE FROM treino WHERE id = ?').run(id);
            if (resultado.changes === 0) return json(res, { erro: 'Treino não encontrado' }, 404);
            return json(res, { mensagem: 'Treino removido!' });
        }

        return json(res, { erro: 'Rota não encontrada' }, 404);

    } catch (error) {
        return json(res, { erro: error.message }, 500);
    }
}

module.exports = { handleTreinos };