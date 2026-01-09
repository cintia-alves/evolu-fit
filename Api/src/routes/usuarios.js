// src/routes/usuarios.js

const { db } = require('../database/db');
const { json, parseBody, getParams, matchRoute } = require('../utils/http');

async function handleUsuarios(req, res) {
    const url = req.url.replace('/api/usuarios', '') || '/';
    const method = req.method;

    try {
        // POST /api/usuarios/login - Login simples
        if (method === 'POST' && url === '/login') {
            const { email, senha } = await parseBody(req);
            
            if (!email || !senha) {
                return json(res, { erro: 'Email e senha são obrigatórios' }, 400);
            }
            
            const usuario = db.prepare(`
                SELECT id, nome, email, avatar 
                FROM usuario 
                WHERE email = ? AND senha = ? 
            `).get(email, senha);
            
            if (!usuario) {
                return json(res, { erro: 'Email ou senha incorretos' }, 401);
            }
            
            return json(res, { 
                mensagem: 'Login realizado com sucesso!',
                usuario: usuario
            });
        }

        // GET /api/usuarios - Listar todos
        if (method === 'GET' && url === '/') {
            const usuarios = db.prepare(`
                SELECT id, nome, email, avatar FROM usuario
            `).all();
            return json(res, usuarios);
        }

        // GET /api/usuarios/:id - Buscar por ID
        if (method === 'GET' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            
            // REMOVIDO 'criado_em' do select pois não existe na tabela
            const usuario = db.prepare(`
                SELECT id, nome, email, avatar
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
            
            // 1. Insere o usuário
            const resultado = db.prepare(`
                INSERT INTO usuario (nome, email, senha, avatar) 
                VALUES (?, ?, ?, ?)
            `).run(nome, email, senha, avatar || 0);
            
            // 2. Busca o usuário recém criado para retornar (Auto-Login)
            const novoUsuario = db.prepare(`
                SELECT id, nome, email, avatar 
                FROM usuario 
                WHERE id = ?
            `).get(resultado.lastInsertRowid);

            return json(res, { 
                mensagem: 'Usuário criado com sucesso!',
                usuario: novoUsuario 
            }, 201);
        }

        // PUT /api/usuarios/:id - Atualizar Perfil
        if (method === 'PUT' && matchRoute('/:id', url)) {
            const { id } = getParams('/:id', url);
            const { nome, email } = await parseBody(req);
            
            // REMOVIDO 'atualizado_em' do update
            const resultado = db.prepare(`
                UPDATE usuario 
                SET nome = ?, email = ?
                WHERE id = ? 
            `).run(nome, email, id);
            
            if (resultado.changes === 0) {
                return json(res, { erro: 'Usuário não encontrado' }, 404);
            }
            
            // Retorna dados atualizados para o front atualizar o contexto
            const usuarioAtualizado = db.prepare('SELECT id, nome, email, avatar FROM usuario WHERE id = ?').get(id);

            return json(res, { 
                mensagem: 'Usuário atualizado!',
                usuario: usuarioAtualizado
            });
        }

        // PUT /api/usuarios/:id/senha - Alterar Senha
        if (method === 'PUT' && matchRoute('/:id/senha', url)) {
            const { id } = getParams('/:id/senha', url);
            const { novaSenha } = await parseBody(req);

            if (!novaSenha) return json(res, { erro: 'Nova senha é obrigatória' }, 400);

            // REMOVIDO 'atualizado_em' do update
            const resultado = db.prepare(`
                UPDATE usuario 
                SET senha = ?
                WHERE id = ? 
            `).run(novaSenha, id);

            if (resultado.changes === 0) return json(res, { erro: 'Usuário não encontrado' }, 404);
            
            return json(res, { mensagem: 'Senha alterada com sucesso!' });
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

        return json(res, { erro: 'Rota não encontrada' }, 404);

    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return json(res, { erro: 'Email já cadastrado' }, 400);
        }
        return json(res, { erro: error.message }, 500);
    }
}

module.exports = { handleUsuarios };