const { db } = require('../database/db');
const { json, parseBody, getParams, matchRoute } = require('../utils/http');

async function handleRotinas(req, res) {
    const url = req.url.replace('/api/rotinas', '') || '/';
    const method = req.method;

    try {
        // GET /api/rotinas/usuario/:usuarioId - Listar por usuário
        if (method === 'GET' && matchRoute('/usuario/:usuarioId', url)) {
            const { usuarioId } = getParams('/usuario/:usuarioId', url);
            
            const rotinas = db.prepare(`
                SELECT * FROM rotina WHERE usuario_id = ?
            `).all(usuarioId);
            
            return json(res, rotinas);
        }

        // GET /api/rotinas/:id - Buscar por ID com treinos
        if (method === 'GET' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            
            const rotina = db.prepare('SELECT * FROM rotina WHERE id = ?').get(id);
            
            if (!rotina) {
                return json(res, { erro: 'Rotina não encontrada' }, 404);
            }
            
            const treinos = db.prepare('SELECT * FROM treino WHERE rotina_id = ?').all(id);
            
            return json(res, { ...rotina, treinos });
        }

        // POST /api/rotinas - Criar
        if (method === 'POST' && url === '/') {
            const { nome, usuario_id } = await parseBody(req);
            
            const resultado = db.prepare(`
                INSERT INTO rotina (nome, usuario_id) VALUES (?, ?)
            `).run(nome, usuario_id);
            
            return json(res, { 
                id: resultado.lastInsertRowid,
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

        // DELETE /api/rotinas/:id - Remover
        if (method === 'DELETE' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            
            const resultado = db.prepare('DELETE FROM rotina WHERE id = ?').run(id);
            
            if (resultado.changes === 0) {
                return json(res, { erro: 'Rotina não encontrada' }, 404);
            }
            
            return json(res, { mensagem: 'Rotina removida!' });
        }

        return json(res, { erro: 'Rota não encontrada' }, 404);

    } catch (error) {
        return json(res, { erro: error.message }, 500);
    }
}

module.exports = { handleRotinas };