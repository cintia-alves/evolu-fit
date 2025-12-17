-- =============================================
-- MODELAGEM DO BANCO DE DADOS - APP DE TREINOS
-- =============================================

-- Tabela de Usuários
CREATE TABLE usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT ,
    email TEXT UNIQUE,
    senha TEXT ,
    avatar INTEGER DEFAULT 0,
);

-- Tabela de Rotinas (uma rotina pertence a um usuário)
CREATE TABLE rotina (
    id INTEGER PRIMARY KEY AUTOINCREMEN-T,
    nome TEXT NOT NULL,
    usuario_id INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabela de Grupos Musculares
CREATE TABLE grupo_muscular (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

-- Tabela de Exercícios
CREATE TABLE exercicio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
);

-- Tabela associativa:  Exercício <-> Grupo Muscular (N:N)
CREATE TABLE exercicio_grupo_muscular (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercicio_id INTEGER NOT NULL,
    grupo_muscular_id INTEGER NOT NULL,
    FOREIGN KEY (exercicio_id) REFERENCES exercicio(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_muscular_id) REFERENCES grupo_muscular(id) ON DELETE CASCADE,
    UNIQUE(exercicio_id, grupo_muscular_id)
);

-- Tabela de Treinos (um treino pertence a uma rotina)
CREATE TABLE treino (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data DATE NOT NULL,
    concluido INTEGER DEFAULT 0, -- 0 = não concluído, 1 = concluído
    rotina_id INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rotina_id) REFERENCES rotina(id) ON DELETE CASCADE
);

-- Tabela associativa: Treino <-> Exercício (N:N)
CREATE TABLE treino_exercicio (
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

-- Tabela associativa: Treino <-> Grupo Muscular (N:N)
CREATE TABLE treino_grupo_muscular (
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

CREATE INDEX idx_rotina_usuario ON rotina(usuario_id);
CREATE INDEX idx_treino_rotina ON treino(rotina_id);
CREATE INDEX idx_treino_data ON treino(data);
CREATE INDEX idx_treino_exercicio_treino ON treino_exercicio(treino_id);
CREATE INDEX idx_treino_exercicio_exercicio ON treino_exercicio(exercicio_id);
CREATE INDEX idx_usuario_email ON usuario(email);