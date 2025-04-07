# Use uma imagem Node oficial
FROM node:18-alpine

# Diretório da app
WORKDIR /app

# Copia dependências
COPY package*.json ./
RUN npm install --production

# Copia código
COPY . .

# Build da app NestJS
RUN npm run build

# Porta exposta (ajuste se necessário)
EXPOSE 3000

# Comando pra iniciar
CMD ["node", "dist/main"]
