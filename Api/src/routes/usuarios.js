const { db } = require('../database/db');
const { json, parseBody, getParams, matchRoute } = require('../utils/http');

async function handleUsuarios(req, res) {
    const url = req.url.replace('/api/usuarios', '') || '/';
    const method = req.method;

    try {
        // GET /api/usuarios - Listar todos
        if (method === 'GET' && url === '/') {
            const usuarios = db.prepare(`
                SELECT id, nome, email, avatar FROM usuario
            `).all();
            
            return json(res, usuarios);
        }

        // GET /api/usuarios/: id - Buscar por ID
        if (method === 'GET' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            
            const usuario = db.prepare(`
                SELECT id, nome, email, avatar, criado_em 
                FROM usuario WHERE id = ? 
            `).get(id);
            
            if (!usuario) {
                return json(res, { erro: 'Usuário não encontrado' }, 404);
            }
            
            return json(res, usuario);
        }

        // POST /api/usuarios - Criar
        if (method === 'POST' && url === '/') {
            const { nome, email, senha, avatar } = await parseBody(req);
            
            const resultado = db.prepare(`
                INSERT INTO usuario (nome, email, senha, avatar) 
                VALUES (?, ?, ?, ?)
            `).run(nome, email, senha, avatar || 0);
            
            return json(res, { 
                id: resultado.lastInsertRowid,
                mensagem: 'Usuário criado com sucesso!' 
            }, 201);
        }

        // PUT /api/usuarios/:id - Atualizar
        if (method === 'PUT' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            const { nome, email, avatar } = await parseBody(req);
            
            const resultado = db.prepare(`
                UPDATE usuario 
                SET nome = ?, email = ?, avatar = ?, atualizado_em = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(nome, email, avatar, id);
            
            if (resultado.changes === 0) {
                return json(res, { erro: 'Usuário não encontrado' }, 404);
            }
            
            return json(res, { mensagem: 'Usuário atualizado!' });
        }

        // DELETE /api/usuarios/:id - Remover
        if (method === 'DELETE' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            
            const resultado = db.prepare('DELETE FROM usuario WHERE id = ?').run(id);
            
            if (resultado.changes === 0) {
                return json(res, { erro: 'Usuário não encontrado' }, 404);
            }
            
            return json(res, { mensagem: 'Usuário removido!' });
        }

        // Rota não encontrada
        return json(res, { erro: 'Rota não encontrada' }, 404);

    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return json(res, { erro: 'Email já cadastrado' }, 400);
        }
        return json(res, { erro: error.message }, 500);
    }
}

module.exports = { handleUsuarios };