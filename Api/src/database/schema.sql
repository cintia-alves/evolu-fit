-- =============================================
-- MODELAGEM DO BANCO DE DADOS - APP DE TREINOS
-- =============================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT,
    avatar INTEGER DEFAULT 0
);

-- Tabela de Rotinas (uma rotina pertence a um usuário)
CREATE TABLE IF NOT EXISTS rotina (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    usuario_id INTEGER NOT NULL,
    ativa INTEGER DEFAULT 0, -- 0 = inativa, 1 = ativa (apenas uma por usuário)
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabela de Grupos Musculares
CREATE TABLE IF NOT EXISTS grupo_muscular (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

-- Tabela de Exercícios
CREATE TABLE IF NOT EXISTS exercicio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

-- Tabela associativa:  Exercício <-> Grupo Muscular (N:N)
CREATE TABLE IF NOT EXISTS exercicio_grupo_muscular (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercicio_id INTEGER NOT NULL,
    grupo_muscular_id INTEGER NOT NULL,
    FOREIGN KEY (exercicio_id) REFERENCES exercicio(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_muscular_id) REFERENCES grupo_muscular(id) ON DELETE CASCADE,
    UNIQUE(exercicio_id, grupo_muscular_id)
);


-- Tabela de Treinos (um treino pertence a uma rotina)
CREATE TABLE IF NOT EXISTS treino (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    dia_semana INTEGER NOT NULL CHECK(dia_semana >= 0 AND dia_semana <= 6), -- 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
    concluido INTEGER DEFAULT 0, -- 0 = não concluído, 1 = concluído
    rotina_id INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rotina_id) REFERENCES rotina(id) ON DELETE CASCADE
);

-- Tabela associativa: Treino <-> Exercício (N:N)
CREATE TABLE IF NOT EXISTS treino_exercicio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    treino_id INTEGER NOT NULL,
    exercicio_id INTEGER NOT NULL,
    series INTEGER DEFAULT 3,
    repeticoes INTEGER DEFAULT 12,
    carga REAL DEFAULT 0,
    ordem INTEGER DEFAULT 0,
    FOREIGN KEY (treino_id) REFERENCES treino(id) ON DELETE CASCADE,
    FOREIGN KEY (exercicio_id) REFERENCES exercicio(id) ON DELETE CASCADE
);

-- Tabela associativa: Treino <-> Grupo Muscular (N: N)
CREATE TABLE IF NOT EXISTS treino_grupo_muscular (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    treino_id INTEGER NOT NULL,
    grupo_muscular_id INTEGER NOT NULL,
    FOREIGN KEY (treino_id) REFERENCES treino(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_muscular_id) REFERENCES grupo_muscular(id) ON DELETE CASCADE,
    UNIQUE(treino_id, grupo_muscular_id)
);

-- =============================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_rotina_usuario ON rotina(usuario_id);
CREATE INDEX IF NOT EXISTS idx_treino_rotina ON treino(rotina_id);
CREATE INDEX IF NOT EXISTS idx_treino_dia_semana ON treino(dia_semana);
CREATE INDEX IF NOT EXISTS idx_treino_exercicio_treino ON treino_exercicio(treino_id);