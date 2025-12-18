# 🏋️ API de Treinos

API REST simples para gerenciamento de treinos de academia, desenvolvida em **Node.js puro** (sem frameworks) com banco de dados **SQLite**.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Modelo de Dados](#-modelo-de-dados)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando a API](#-executando-a-api)
- [Endpoints da API](#-endpoints-da-api)
  - [Usuários](#-usuários)
  - [Rotinas](#-rotinas)
  - [Treinos](#-treinos)
  - [Exercícios](#-exercícios)
- [Dados Pré-Cadastrados](#-dados-pré-cadastrados)
- [Usuário de Exemplo](#-usuário-de-exemplo)
- [Deploy](#-deploy)
- [Exemplos de Uso](#-exemplos-de-uso)

---

## 📖 Sobre o Projeto

Esta API foi criada para gerenciar treinos de academia de forma simples e eficiente. Permite:

- ✅ Cadastrar e gerenciar usuários
- ✅ Criar rotinas de treino personalizadas
- ✅ Organizar treinos por dia/tipo
- ✅ Adicionar exercícios com séries, repetições e carga
- ✅ Marcar treinos como concluídos
- ✅ Consultar exercícios por grupo muscular

---

## 🛠 Tecnologias

| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** | Runtime JavaScript (sem Express/frameworks) |
| **better-sqlite3** | Banco de dados SQLite síncrono |
| **Docker** | Containerização para deploy |

---

## 📁 Estrutura do Projeto

```
Api/
├── src/
│   ├── index.js              # Servidor HTTP e roteamento principal
│   ├── database/
│   │   ├── db.js             # Conexão e inicialização do SQLite
│   │   ├── schema.sql        # Definição das tabelas
│   │   └── seed.js           # Dados iniciais (grupos, exercícios, usuário exemplo)
│   ├── routes/
│   │   ├── usuarios.js       # CRUD de usuários
│   │   ├── rotinas.js        # CRUD de rotinas
│   │   ├── treinos.js        # CRUD de treinos
│   │   └── exercicios.js     # CRUD de exercícios e grupos musculares
│   └── utils/
│       └── http.js           # Funções auxiliares (JSON, parse body)
├── data/                     # Diretório do banco de dados (criado automaticamente)
├── Dockerfile                # Configuração Docker
├── fly.toml                  # Configuração Fly.io
├── render.yaml               # Configuração Render.com
├── package.json
└── README.md
```

---

## 🗄 Modelo de Dados

### Diagrama de Entidades

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USUÁRIO   │──1:N──│   ROTINA    │──1:N──│   TREINO    │
└─────────────┘       └─────────────┘       └─────────────┘
                                                   │
                                                  1:N
                                                   │
                                            ┌──────┴──────┐
                                            │ TREINO_EXERC │
                                            └──────┬──────┘
                                                  N:1
                                                   │
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│GRUPO_MUSCUL │──N:M──│ EXERC_GRUPO │──N:M──│  EXERCÍCIO  │
└─────────────┘       └─────────────┘       └─────────────┘
```

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `usuario` | Dados dos usuários (nome, email, senha, avatar) |
| `rotina` | Rotinas de treino (nome, descrição, usuário) |
| `treino` | Treinos individuais (nome, rotina, data, concluído) |
| `exercicio` | Catálogo de exercícios |
| `grupo_muscular` | Grupos musculares (Peito, Costas, etc.) |
| `exercicio_grupo_muscular` | Relação N:M entre exercício e grupo |
| `treino_exercicio` | Exercícios do treino com séries, reps e carga |

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ instalado
- **npm** ou **yarn**

### Passos

```bash
# 1. Clone o repositório (ou baixe os arquivos)
git clone <url-do-repositorio>
cd Api

# 2. Instale as dependências
npm install

# 3. Execute a API
npm start
```

A API estará disponível em: `http://localhost:3000`

---

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3000` |
| `DATA_DIR` | Diretório do banco de dados | `./data` |

### Exemplo de uso:

```bash
# Linux/Mac
PORT=8080 DATA_DIR=/var/data npm start

# Windows (PowerShell)
$env:PORT=8080; npm start
```

---

## ▶️ Executando a API

### Modo desenvolvimento
```bash
npm start
```

### Com Docker
```bash
# Build da imagem
docker build -t api-treinos .

# Executar container
docker run -p 3000:3000 -v ./data:/app/data api-treinos
```

### Verificar se está funcionando
```bash
curl http://localhost:3000/health
# Resposta: {"status":"ok","timestamp":"..."}
```

---

## 📡 Endpoints da API

### Base URL
```
http://localhost:3000/api
```

---

### 👤 Usuários

#### Listar todos os usuários
```http
GET /api/usuarios
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "exemplo@treinos.com",
    "avatar": 1,
    "criado_em": "2025-12-17 10:00:00"
  }
]
```

---

#### Buscar usuário por ID
```http
GET /api/usuarios/:id
```

**Resposta:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "exemplo@treinos.com",
  "avatar": 1,
  "criado_em": "2025-12-17 10:00:00"
}
```

---

#### Criar usuário
```http
POST /api/usuarios
Content-Type: application/json

{
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "senha": "minhasenha123",
  "avatar": 2
}
```

**Resposta:** `201 Created`
```json
{
  "id": 2,
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "avatar": 2
}
```

---

#### Atualizar usuário
```http
PUT /api/usuarios/:id
Content-Type: application/json

{
  "nome": "Maria Santos Silva",
  "avatar": 3
}
```

---

#### Deletar usuário
```http
DELETE /api/usuarios/:id
```

---

### 📋 Rotinas

#### Listar rotinas de um usuário
```http
GET /api/rotinas/usuario/:usuarioId
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Treino ABC - Hipertrofia",
    "descricao": "Rotina de treino dividida em 3 dias focada em hipertrofia muscular",
    "usuario_id": 1,
    "criado_em": "2025-12-17 10:00:00"
  }
]
```

---

#### Buscar rotina por ID
```http
GET /api/rotinas/:id
```

---

#### Criar rotina
```http
POST /api/rotinas
Content-Type: application/json

{
  "nome": "Treino Full Body",
  "descricao": "Treino de corpo inteiro 3x por semana",
  "usuario_id": 1
}
```

---

#### Atualizar rotina
```http
PUT /api/rotinas/:id
Content-Type: application/json

{
  "nome": "Treino Full Body - Iniciante",
  "descricao": "Atualizado para iniciantes"
}
```

---

#### Deletar rotina
```http
DELETE /api/rotinas/:id
```

---

### 🏋️ Treinos

#### Listar treinos de uma rotina
```http
GET /api/treinos/rotina/:rotinaId
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Treino A - Peito e Tríceps",
    "rotina_id": 1,
    "data_conclusao": "2025-12-16",
    "concluido": 1,
    "criado_em": "2025-12-17 10:00:00"
  }
]
```

---

#### Buscar treino com exercícios
```http
GET /api/treinos/:id
```

**Resposta:**
```json
{
  "id": 1,
  "nome": "Treino A - Peito e Tríceps",
  "rotina_id": 1,
  "concluido": 1,
  "exercicios": [
    {
      "id": 1,
      "exercicio_id": 17,
      "nome": "Supino reto com barra",
      "series": 4,
      "repeticoes": 10,
      "carga": "60kg",
      "ordem": 1
    }
  ]
}
```

---

#### Criar treino
```http
POST /api/treinos
Content-Type: application/json

{
  "nome": "Treino D - Cardio",
  "rotina_id": 1
}
```

---

#### Marcar treino como concluído
```http
PUT /api/treinos/:id/concluir
```

---

#### Adicionar exercício ao treino
```http
POST /api/treinos/:treinoId/exercicios
Content-Type: application/json

{
  "exercicio_id": 17,
  "series": 4,
  "repeticoes": 10,
  "carga": "60kg",
  "ordem": 1
}
```

---

#### Atualizar exercício do treino
```http
PUT /api/treinos/exercicios/:id
Content-Type: application/json

{
  "series": 5,
  "repeticoes": 8,
  "carga": "70kg"
}
```

---

#### Remover exercício do treino
```http
DELETE /api/treinos/exercicios/:id
```

---

#### Deletar treino
```http
DELETE /api/treinos/:id
```

---

### 💪 Exercícios

#### Listar todos os exercícios
```http
GET /api/exercicios
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Supino inclinado com barra"
  },
  {
    "id": 2,
    "nome": "Supino declinado com halteres"
  }
]
```

---

#### Listar grupos musculares
```http
GET /api/exercicios/grupos
```

**Resposta:**
```json
[
  { "id": 1, "nome": "Peito" },
  { "id": 2, "nome": "Costas" },
  { "id": 3, "nome": "Ombros" },
  { "id": 4, "nome": "Bíceps" },
  { "id": 5, "nome": "Tríceps" }
]
```

---

#### Listar exercícios por grupo muscular
```http
GET /api/exercicios/grupo/:grupoId
```

**Exemplo:** `GET /api/exercicios/grupo/1` (Peito)

**Resposta:**
```json
[
  { "id": 1, "nome": "Supino inclinado com barra" },
  { "id": 2, "nome": "Supino declinado com halteres" },
  { "id": 17, "nome": "Supino reto com barra" }
]
```

---

#### Buscar exercício por ID
```http
GET /api/exercicios/:id
```

---

## 📊 Dados Pré-Cadastrados

A API já vem com **185 exercícios** organizados em **13 grupos musculares**:

| Grupo Muscular | Qtd. Exercícios |
|----------------|-----------------|
| Peito | 23 |
| Costas | 27 |
| Ombros | 23 |
| Bíceps | 15 |
| Tríceps | 14 |
| Antebraço | 11 |
| Lombar | 10 |
| Abdômen | 15 |
| Glúteos | 15 |
| Quadríceps | 13 |
| Posterior de Coxa | 10 |
| Panturrilha | 9 |

---

## 👤 Usuário de Exemplo

A API cria automaticamente um usuário de exemplo com uma rotina completa:

### Credenciais
| Campo | Valor |
|-------|-------|
| **Nome** | João Silva |
| **Email** | exemplo@treinos.com |
| **Senha** | 123456 |

### Rotina: Treino ABC - Hipertrofia

#### Treino A - Peito e Tríceps ✅ (Concluído)
| Exercício | Séries | Reps | Carga |
|-----------|--------|------|-------|
| Supino reto com barra | 4 | 10 | 60kg |
| Supino inclinado com halteres | 4 | 10 | 24kg |
| Crucifixo | 3 | 12 | 14kg |
| Crossover | 3 | 15 | 20kg |
| Tríceps Corda | 4 | 12 | 25kg |
| Tríceps Testa | 3 | 12 | 20kg |
| Mergulho no banco | 3 | 15 | Peso corporal |

#### Treino B - Costas e Bíceps
| Exercício | Séries | Reps | Carga |
|-----------|--------|------|-------|
| Puxada alta | 4 | 10 | 50kg |
| Remada curvada | 4 | 10 | 40kg |
| Remada baixa | 3 | 12 | 45kg |
| Pulldown | 3 | 12 | 35kg |
| Rosca direta com barra | 4 | 10 | 25kg |
| Rosca martelo | 3 | 12 | 12kg |
| Rosca concentrada | 3 | 12 | 10kg |

#### Treino C - Pernas e Ombros
| Exercício | Séries | Reps | Carga |
|-----------|--------|------|-------|
| Agachamento Livre com barra | 4 | 10 | 80kg |
| Leg Press 45 graus | 4 | 12 | 200kg |
| Cadeira Extensora | 3 | 15 | 40kg |
| Mesa Flexora | 3 | 12 | 35kg |
| Elevação de panturrilha em pé | 4 | 15 | 60kg |
| Desenvolvimento com halteres | 4 | 10 | 16kg |
| Elevação lateral com halteres | 3 | 15 | 8kg |

---

## ☁️ Deploy

### Railway (Recomendado - Mais fácil)
1. Crie uma conta em [railway.app](https://railway.app)
2. Conecte seu repositório GitHub
3. Deploy automático!

### Render
1. Crie uma conta em [render.com](https://render.com)
2. New > Web Service > Connect repository
3. O arquivo `render.yaml` configura automaticamente

### Fly.io
```bash
# Instalar CLI
curl -L https://fly.io/install.sh | sh

# Login e deploy
fly auth login
fly launch
fly deploy
```

### Docker (VPS)
```bash
docker build -t api-treinos .
docker run -d -p 3000:3000 -v /data/treinos:/app/data api-treinos
```

---

## 📝 Exemplos de Uso

### cURL

```bash
# Criar usuário
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carlos","email":"carlos@email.com","senha":"123456"}'

# Listar exercícios de Peito
curl http://localhost:3000/api/exercicios/grupo/1

# Criar rotina
curl -X POST http://localhost:3000/api/rotinas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Minha Rotina","descricao":"Treino personalizado","usuario_id":1}'

# Adicionar exercício ao treino
curl -X POST http://localhost:3000/api/treinos/1/exercicios \
  -H "Content-Type: application/json" \
  -d '{"exercicio_id":17,"series":4,"repeticoes":10,"carga":"60kg","ordem":1}'

# Marcar treino como concluído
curl -X PUT http://localhost:3000/api/treinos/1/concluir
```

### JavaScript (Fetch)

```javascript
// Listar grupos musculares
const grupos = await fetch('http://localhost:3000/api/exercicios/grupos')
  .then(res => res.json());

// Criar treino
const treino = await fetch('http://localhost:3000/api/treinos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Treino de Peito',
    rotina_id: 1
  })
}).then(res => res.json());
```

---

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

---

## 🤝 Contribuição

Sinta-se à vontade para abrir issues ou pull requests com melhorias!