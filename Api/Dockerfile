FROM node:20-alpine

WORKDIR /app

# Instalar dependências necessárias para compilar better-sqlite3
RUN apk add --no-cache python3 make g++

# Copiar package.json primeiro (cache de dependências)
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código
COPY src ./src

# Criar diretório de dados
RUN mkdir -p /app/data

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/app/data

# Expor porta
EXPOSE 3000

# Comando de início
CMD ["node", "src/index.js"]
