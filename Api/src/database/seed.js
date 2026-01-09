const { db } = require('./db');

const dadosExercicios = {
    'Peito': [
        'Supino inclinado com barra',
        'Supino declinado com halteres',
        'Crucifixo inclinado com halteres',
        'Crucifixo declinado com halteres',
        'Crossover polia baixa',
        'Flexão inclinada',
        'Flexão declinada',
        'Flexão diamante',
        'Supino articulado',
        'Supino na máquina Smith (Barra guiada)',
        'Floor Press (Supino no chão)',
        'Svend Press',
        'Peck Deck (Voador)',
        'Supino reto com halteres',
        'Mergulho nas paralelas',
        'Supino sentado na máquina',
        'Supino reto com barra',
        'Supino inclinado com halteres',
        'Crucifixo',
        'Flexão de braço (Apoio)',
        'Supino declinado',
        'Crossover',
        'Pullover'
    ],
    'Costas': [
        'Puxada alta com pegada supinada',
        'Puxada alta com pegada neutra',
        'Remada curvada com halteres',
        'Remada articulada',
        'Crucifixo invertido',
        'Encolhimento de ombros',
        'Face Pull (Puxada na face)',
        'Pullover na polia alta',
        'Remada invertida (Australiana)',
        'Barra fixa com pegada supinada (Chin-up)',
        'Remada alta',
        'Good Morning (Bom dia)',
        'Remada no banco inclinado',
        'Meio-Terra (Rack Pull)',
        'Puxada atrás da nuca',
        'Remada Cavalinho',
        'Remada na máquina',
        'Puxada com triângulo',
        'Extensão lombar',
        'Barra fixa',
        'Puxada alta',
        'Remada curvada',
        'Remada baixa',
        'Levantamento terra',
        'Remada unilateral (Serrote)',
        'Pulldown',
        'Voador dorsal'
    ],
    'Ombros': [
        'Desenvolvimento com halteres',
        'Desenvolvimento com barra',
        'Desenvolvimento na máquina',
        'Desenvolvimento Arnold',
        'Desenvolvimento por trás da nuca',
        'Elevação lateral com halteres',
        'Elevação lateral na polia (Crossover)',
        'Elevação lateral máquina',
        'Elevação frontal com halteres',
        'Elevação frontal com barra',
        'Elevação frontal na polia',
        'Elevação frontal com anilha',
        'Crucifixo invertido com halteres',
        'Crucifixo invertido na máquina (Peck Deck Invertido)',
        'Crucifixo invertido na polia',
        'Face Pull (Puxada na face) - Ombros',
        'Remada alta com barra',
        'Remada alta com halteres',
        'Remada alta na polia',
        'Encolhimento com barra (para trapézio)',
        'Encolhimento com halteres',
        'Encolhimento na máquina Smith',
        'Manguito rotador (Rotação externa/interna na polia)'
    ],
    'Bíceps': [
        'Rosca direta com barra',
        'Rosca direta com halteres',
        'Rosca alternada com halteres',
        'Rosca martelo (Hammer) com halteres',
        'Rosca Scott (na máquina)',
        'Rosca Scott (com barra W)',
        'Rosca concentrada',
        'Rosca inclinada (banco 45 graus)',
        'Rosca na polia baixa',
        'Rosca na polia alta (Bíceps duplo/Hércules)',
        'Rosca inversa com barra',
        'Rosca Zottman',
        'Rosca Spider',
        'Rosca 21',
        'Rosca corda na polia baixa'
    ],
    'Tríceps': [
        'Tríceps Corda (Pulley)',
        'Tríceps Testa (barra W, barra reta ou halteres)',
        'Tríceps Francês (unilateral ou bilateral)',
        'Tríceps Coice (halteres ou polia)',
        'Supino Fechado',
        'Mergulho nas paralelas - Tríceps',
        'Mergulho no banco (Tríceps banco)',
        'Tríceps Pulley (barra reta, barra V)',
        'Tríceps Pulley Inverso',
        'Flexão diamante (Flexão fechada)',
        'Extensão de tríceps acima da cabeça',
        'Tríceps na máquina (Dip machine)',
        'Tríceps Tate Press',
        'Tríceps JM Press'
    ],
    'Antebraço': [
        'Rosca punho (Flexão de punho) com barra',
        'Rosca punho invertida (Extensão de punho) com barra',
        'Rosca punho com halteres (unilateral)',
        'Rosca inversa com barra (foco em braquiorradial)',
        'Rosca martelo (foco em braquiorradial)',
        'Bobina de Andrieu (Wrist Roller)',
        'Caminhada do Fazendeiro (Farmer Walk)',
        'Suspensão na barra fixa (Dead Hang)',
        'Pinçamento de anilhas (Plate Pinch)',
        'Hand Grip (Alicate de mão)',
        'Rotação de punho com halteres'
    ],
    'Lombar': [
        'Hiperextensão lombar (Banco Romano)',
        'Levantamento Terra (Deadlift)',
        'Good Morning (Bom dia) - Lombar',
        'Stiff (Levantamento Terra Romeno)',
        'Extensão de tronco no chão (Superman)',
        'Perdigueiro (Bird-Dog)',
        'Extensão de tronco na máquina',
        'Meio-Terra (Rack Pull) - Lombar',
        'Elevação pélvica (Ponte)',
        'Jefferson Curl'
    ],
    'Abdômen': [
        'Abdominal Supra (Crunch)',
        'Abdominal Infra (Elevação de pernas)',
        'Abdominal Remador',
        'Abdominal Bicicleta (Cruzado)',
        'Prancha Frontal (Isometria)',
        'Prancha Lateral',
        'Abdominal na polia alta (Crunch com corda)',
        'Abdominal na máquina',
        'Elevação de pernas na barra fixa (Toes to Bar)',
        'Abdominal Rodinha (Ab Wheel)',
        'Abdominal Canivete (V-Up)',
        'Russian Twist (Giro Russo)',
        'Stomach Vacuum (Vácuo Abdominal)',
        'Abdominal Oblíquo no banco romano',
        'Lenhador na polia (Woodchopper)'
    ],
    'Glúteos': [
        'Elevação Pélvica (Hip Thrust) com barra',
        'Agachamento Búlgaro',
        'Agachamento Sumô',
        'Levantamento Terra Sumô',
        'Passada / Afundo',
        'Stiff (Levantamento Terra Romeno) - Glúteos',
        'Glúteo na polia (Coice)',
        'Cadeira Abdutora',
        'Glúteo 4 apoios (com caneleira ou máquina)',
        'Step-up (Subida no banco/caixa)',
        'Extensão de quadril no Banco Romano',
        'Abdução de quadril na polia',
        'Frog Pump',
        'Elevação pélvica unilateral',
        'Monster Walk (com elástico)'
    ],
    'Quadríceps': [
        'Agachamento Livre com barra',
        'Agachamento Frontal (Front Squat)',
        'Leg Press 45 graus',
        'Leg Press Horizontal',
        'Cadeira Extensora',
        'Agachamento Hack (Hack Machine)',
        'Agachamento Búlgaro - Quadríceps',
        'Passada / Afundo (Lunges)',
        'Agachamento Globet (com halter)',
        'Agachamento Sissy',
        'Agachamento Pistol (unilateral)',
        'Subida no banco (Step-up)',
        'Agachamento Smith (Barra guiada)'
    ],
    'Posterior de Coxa': [
        'Mesa Flexora (Flexora deitada)',
        'Cadeira Flexora (Flexora sentada)',
        'Stiff com barra (Levantamento Terra Romeno)',
        'Stiff com halteres',
        'Flexora Vertical (Flexora em pé)',
        'Flexão Nórdica (Nordic Ham Curl)',
        'Good Morning (Bom Dia) - Posterior',
        'Glute Ham Raise (GHR)',
        'Levantamento Terra Sumô - Posterior',
        'Flexão de pernas com bola suíça'
    ],
    'Panturrilha': [
        'Elevação de panturrilha em pé (Máquina)',
        'Elevação de panturrilha sentado (Banco Sóleo)',
        'Elevação de panturrilha no Leg Press',
        'Elevação de panturrilha no Smith',
        'Burrinho (Donkey Calf Raise)',
        'Elevação de panturrilha unilateral com halter',
        'Elevação de panturrilha no degrau (Step)',
        'Tibial Anterior (com halter, elástico ou peso)',
        'Elevação de calcanhares no Hack Machine'
    ]
};

function seedBanco() {
    // Verificar se o seed já foi executado (tabela de controle)
    db.exec(`
        CREATE TABLE IF NOT EXISTS _seed_control (
            id INTEGER PRIMARY KEY,
            executado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const seedExecutado = db.prepare('SELECT id FROM _seed_control WHERE id = 1').get();
    
    if (seedExecutado) {
        console.log('⏭️  Seed já foi executado anteriormente. Pulando...');
        return;
    }

    const inserirGrupo = db.prepare(
        'INSERT OR IGNORE INTO grupo_muscular (nome) VALUES (?)'
    );
    
    const inserirExercicio = db.prepare(
        'INSERT OR IGNORE INTO exercicio (nome) VALUES (?)'
    );
    
    const buscarGrupoId = db.prepare(
        'SELECT id FROM grupo_muscular WHERE nome = ?'
    );
    
    const buscarExercicioId = db.prepare(
        'SELECT id FROM exercicio WHERE nome = ?'
    );
    
    const inserirRelacao = db.prepare(
        'INSERT OR IGNORE INTO exercicio_grupo_muscular (exercicio_id, grupo_muscular_id) VALUES (?, ?)'
    );

    // Usar transação para melhor performance
    const popularBanco = db.transaction(() => {
        let totalGrupos = 0;
        let totalExercicios = 0;

        for (const [nomeGrupo, exercicios] of Object.entries(dadosExercicios)) {
            // Inserir grupo muscular
            inserirGrupo.run(nomeGrupo);
            const grupo = buscarGrupoId.get(nomeGrupo);
            totalGrupos++;

            // Inserir exercícios do grupo
            for (const nomeExercicio of exercicios) {
                inserirExercicio.run(nomeExercicio);
                const exercicio = buscarExercicioId.get(nomeExercicio);
                
                // Criar relação exercício <-> grupo muscular
                if (exercicio && grupo) {
                    inserirRelacao.run(exercicio.id, grupo.id);
                }
                totalExercicios++;
            }
        }

        console.log(`✅ Banco populado: ${totalGrupos} grupos musculares, ${totalExercicios} exercícios!`);
    });

    popularBanco();
    
    // Criar usuário de exemplo com rotinas e treinos
    criarUsuarioExemplo();

    // Marcar seed como executado
    db.prepare('INSERT INTO _seed_control (id) VALUES (1)').run();
    console.log('🔒 Seed marcado como executado.');
}

// Cria um usuário completo de exemplo com rotinas e treinos
function criarUsuarioExemplo() {
    // Verificar se já existe o usuário exemplo
    const usuarioExiste = db.prepare('SELECT id FROM usuario WHERE email = ?').get('exemplo@treinos.com');
    if (usuarioExiste) {
        console.log('👤 Usuário de exemplo já existe!');
        return;
    }

    const criarExemplo = db.transaction(() => {
        // 1. Criar usuário
        const usuario = db.prepare(`
            INSERT INTO usuario (nome, email, senha, avatar) 
            VALUES (?, ?, ?, ?)
        `).run('João Silva', 'exemplo@treinos.com', '123456', 1);
        
        const usuarioId = usuario.lastInsertRowid;

        // 2. Criar rotina de treino ABC
        const rotinaABC = db.prepare(`
            INSERT INTO rotina (nome, usuario_id, ativa) VALUES (?, ?, ?)
        `).run('Treino ABC - Hipertrofia', usuarioId, 1);
        
        const rotinaId = rotinaABC.lastInsertRowid;

        // 3. Buscar IDs dos exercícios
        const buscarExercicio = db.prepare('SELECT id FROM exercicio WHERE nome = ?');
        
        // Helper para pegar ID do exercício
        const getExId = (nome) => {
            const ex = buscarExercicio.get(nome);
            return ex ? ex.id : null;
        };

        // 4. Criar Treino A - Peito e Tríceps
        const treinoA = db.prepare(`
            INSERT INTO treino (nome, dia_semana, rotina_id, concluido) VALUES (?, ?, ?, ?)
        `).run('Treino A - Peito e Tríceps', 1, rotinaId, 1);
        
        const treinoAId = treinoA.lastInsertRowid;

        // Exercícios do Treino A
        const exerciciosTreinoA = [
            { nome: 'Supino reto com barra', series: 4, repeticoes: 10, carga: 60 },
            { nome: 'Supino inclinado com halteres', series: 4, repeticoes: 10, carga: 24 },
            { nome: 'Crucifixo', series: 3, repeticoes: 12, carga: 14 },
            { nome: 'Crossover', series: 3, repeticoes: 15, carga: 20 },
            { nome: 'Tríceps Corda (Pulley)', series: 4, repeticoes: 12, carga: 25 },
            { nome: 'Tríceps Testa (barra W, barra reta ou halteres)', series: 3, repeticoes: 12, carga: 20 },
            { nome: 'Mergulho no banco (Tríceps banco)', series: 3, repeticoes: 15, carga: 0 }
        ];

        const inserirTreinoExercicio = db.prepare(`
            INSERT INTO treino_exercicio (treino_id, exercicio_id, series, repeticoes, carga, ordem)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        exerciciosTreinoA.forEach((ex, index) => {
            const exId = getExId(ex.nome);
            if (exId) {
                inserirTreinoExercicio.run(treinoAId, exId, ex.series, ex.repeticoes, ex.carga, index);
            }
        });

        // 5. Criar Treino B - Costas e Bíceps
        const treinoB = db.prepare(`
            INSERT INTO treino (nome, dia_semana, rotina_id, concluido) VALUES (?, ?, ?, ?)
        `).run('Treino B - Costas e Bíceps', 3, rotinaId, 0);
        
        const treinoBId = treinoB.lastInsertRowid;

        const exerciciosTreinoB = [
            { nome: 'Puxada alta', series: 4, repeticoes: 10, carga: 50 },
            { nome: 'Remada curvada', series: 4, repeticoes: 10, carga: 40 },
            { nome: 'Remada baixa', series: 3, repeticoes: 12, carga: 45 },
            { nome: 'Pulldown', series: 3, repeticoes: 12, carga: 35 },
            { nome: 'Rosca direta com barra', series: 4, repeticoes: 10, carga: 25 },
            { nome: 'Rosca martelo (Hammer) com halteres', series: 3, repeticoes: 12, carga: 12 },
            { nome: 'Rosca concentrada', series: 3, repeticoes: 12, carga: 10 }
        ];

        exerciciosTreinoB.forEach((ex, index) => {
            const exId = getExId(ex.nome);
            if (exId) {
                inserirTreinoExercicio.run(treinoBId, exId, ex.series, ex.repeticoes, ex.carga, index);
            }
        });

        // 6. Criar Treino C - Pernas e Ombros
        const treinoC = db.prepare(`
            INSERT INTO treino (nome, dia_semana, rotina_id, concluido) VALUES (?, ?, ?, ?)
        `).run('Treino C - Pernas e Ombros', 5, rotinaId, 0);
        
        const treinoCId = treinoC.lastInsertRowid;

        const exerciciosTreinoC = [
            { nome: 'Agachamento Livre com barra', series: 4, repeticoes: 10, carga: 80 },
            { nome: 'Leg Press 45 graus', series: 4, repeticoes: 12, carga: 200 },
            { nome: 'Cadeira Extensora', series: 3, repeticoes: 15, carga: 40 },
            { nome: 'Mesa Flexora (Flexora deitada)', series: 3, repeticoes: 12, carga: 35 },
            { nome: 'Elevação de panturrilha em pé (Máquina)', series: 4, repeticoes: 15, carga: 60 },
            { nome: 'Desenvolvimento com halteres', series: 4, repeticoes: 10, carga: 16 },
            { nome: 'Elevação lateral com halteres', series: 3, repeticoes: 15, carga: 8 }
        ];

        exerciciosTreinoC.forEach((ex, index) => {
            const exId = getExId(ex.nome);
            if (exId) {
                inserirTreinoExercicio.run(treinoCId, exId, ex.series, ex.repeticoes, ex.carga, index);
            }
        });

        // 7. Associar grupos musculares aos treinos
        const inserirTreinoGrupo = db.prepare(`
            INSERT OR IGNORE INTO treino_grupo_muscular (treino_id, grupo_muscular_id) VALUES (?, ?)
        `);
        
        const buscarGrupo = db.prepare('SELECT id FROM grupo_muscular WHERE nome = ?');
        
        // Treino A - Peito e Tríceps
        const peitoId = buscarGrupo.get('Peito')?.id;
        const tricepsId = buscarGrupo.get('Tríceps')?.id;
        if (peitoId) inserirTreinoGrupo.run(treinoAId, peitoId);
        if (tricepsId) inserirTreinoGrupo.run(treinoAId, tricepsId);

        // Treino B - Costas e Bíceps
        const costasId = buscarGrupo.get('Costas')?.id;
        const bicepsId = buscarGrupo.get('Bíceps')?.id;
        if (costasId) inserirTreinoGrupo.run(treinoBId, costasId);
        if (bicepsId) inserirTreinoGrupo.run(treinoBId, bicepsId);

        // Treino C - Pernas e Ombros
        const quadricepsId = buscarGrupo.get('Quadríceps')?.id;
        const posteriorId = buscarGrupo.get('Posterior de Coxa')?.id;
        const panturrilhaId = buscarGrupo.get('Panturrilha')?.id;
        const ombrosId = buscarGrupo.get('Ombros')?.id;
        if (quadricepsId) inserirTreinoGrupo.run(treinoCId, quadricepsId);
        if (posteriorId) inserirTreinoGrupo.run(treinoCId, posteriorId);
        if (panturrilhaId) inserirTreinoGrupo.run(treinoCId, panturrilhaId);
        if (ombrosId) inserirTreinoGrupo.run(treinoCId, ombrosId);

        console.log('👤 Usuário de exemplo criado com sucesso!');
        console.log('   📧 Email: exemplo@treinos.com');
        console.log('   🔑 Senha: 123456');
        console.log('   📋 Rotina: Treino ABC - Hipertrofia');
        console.log('   💪 3 treinos configurados (A, B, C)');
    });

    criarExemplo();
}

module.exports = { seedBanco };