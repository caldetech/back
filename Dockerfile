# Etapa 1 - Build
FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Gera arquivos do Prisma
COPY prisma ./prisma
RUN npx prisma generate 

# Gera arquivos do projeto
COPY . .
RUN npm run build

# Etapa 2 - Runtime
FROM node:20-alpine
WORKDIR /app

# Copia dist e dependências
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copia o .env para dentro da imagem
# COPY .env .env

EXPOSE 3333
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

