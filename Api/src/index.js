const http = require('http');
const { inicializarBanco } = require('./database/db');
const { json } = require('./utils/http');

// Importar handlers de rotas
const { handleUsuarios } = require('./routes/usuarios');
const { handleRotinas } = require('./routes/rotinas');
const { handleTreinos } = require('./routes/treinos');
const { handleExercicios } = require('./routes/exercicios');

// Porta configurável via variável de ambiente (importante para nuvem)
const PORT = process.env. PORT || 3000;

// Inicializar banco
inicializarBanco();

// Criar servidor
const server = http.createServer(async (req, res) => {
    const url = req.url;
    const method = req.method;

    // CORS - Preflight
    if (method === 'OPTIONS') {
        res. writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    // Health check (útil para nuvem)
    if (url === '/health') {
        return json(res, { status: 'ok', timestamp: new Date().toISOString() });
    }

    // Rota inicial
    if (url === '/' || url === '/api') {
        return json(res, {
            mensagem: '🏋️ API de Treinos funcionando! ',
            rotas: [
                'GET/POST       /api/usuarios',
                'GET/PUT/DELETE /api/usuarios/:id',
                'POST           /api/usuarios/login',
                'GET            /api/rotinas/usuario/:id',
                'GET            /api/rotinas/ativa/: usuarioId',
                'GET/PUT/DELETE /api/rotinas/:id',
                'PUT            /api/rotinas/: id/ativar',
                'POST           /api/rotinas',
                'GET            /api/treinos/: id',
                'GET            /api/treinos/hoje/: rotinaId',
                'GET            /api/treinos/dia/:diaSemana/: rotinaId',
                'DELETE         /api/treinos/:id',
                'POST           /api/treinos',
                'PUT            /api/treinos/:id/concluir',
                'GET/POST       /api/exercicios',
                'GET            /api/exercicios/grupos',
                'GET            /api/exercicios/grupo/:id'
            ],
            dias_semana:  {
                0: 'Domingo',
                1: 'Segunda',
                2: 'Terça',
                3: 'Quarta',
                4: 'Quinta',
                5: 'Sexta',
                6: 'Sábado'
            }
        });
    }

    // Roteamento
    if (url.startsWith('/api/usuarios')) {
        return handleUsuarios(req, res);
    }

    if (url. startsWith('/api/rotinas')) {
        return handleRotinas(req, res);
    }

    if (url.startsWith('/api/treinos')) {
        return handleTreinos(req, res);
    }

    if (url.startsWith('/api/exercicios')) {
        return handleExercicios(req, res);
    }

    // 404 - Rota não encontrada
    return json(res, { erro: 'Rota não encontrada' }, 404);
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});