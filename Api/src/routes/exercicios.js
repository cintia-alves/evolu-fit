const { db } = require('../database/db');
const { json, parseBody, getParams, matchRoute } = require('../utils/http');

async function handleExercicios(req, res) {
    const url = req.url.replace('/api/exercicios', '') || '/';
    const method = req.method;

    try {
        // GET /api/exercicios - Listar todos
        if (method === 'GET' && url === '/') {
            const exercicios = db.prepare('SELECT * FROM exercicio').all();
            return json(res, exercicios);
        }

        // GET /api/exercicios/grupos - Listar grupos musculares
        if (method === 'GET' && url === '/grupos') {
            const grupos = db.prepare('SELECT * FROM grupo_muscular').all();
            return json(res, grupos);
        }

        // GET /api/exercicios/grupo/:grupoId - Por grupo muscular
        if (method === 'GET' && matchRoute('/grupo/:grupoId', url)) {
            const { grupoId } = getParams('/grupo/:grupoId', url);
            
            const exercicios = db.prepare(`
                SELECT e.* FROM exercicio e
                JOIN exercicio_grupo_muscular egm ON e.id = egm.exercicio_id
                WHERE egm.grupo_muscular_id = ?
            `).all(grupoId);
            
            return json(res, exercicios);
        }

        // POST /api/exercicios - Criar
        if (method === 'POST' && url === '/') {
            const { nome, grupos_musculares } = await parseBody(req);
            
            const inserir = db.transaction(() => {
                const resultado = db.prepare(`
                    INSERT INTO exercicio (nome) VALUES (?)
                `).run(nome);
                
                const exercicioId = resultado.lastInsertRowid;
                
                if (grupos_musculares && grupos_musculares.length > 0) {
                    const inserirGrupo = db.prepare(`
                        INSERT INTO exercicio_grupo_muscular (exercicio_id, grupo_muscular_id)
                        VALUES (?, ?)
                    `);
                    
                    grupos_musculares.forEach(grupoId => {
                        inserirGrupo.run(exercicioId, grupoId);
                    });
                }
                
                return exercicioId;
            });
            
            const exercicioId = inserir();
            
            return json(res, { 
                id: exercicioId,
                mensagem: 'Exercício criado!' 
            }, 201);
        }

        return json(res, { erro: 'Rota não encontrada' }, 404);

    } catch (error) {
        return json(res, { erro: error.message }, 500);
    }
}

module.exports = { handleExercicios };