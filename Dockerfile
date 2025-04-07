# Etapa 1 - Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

# ⚠️ Gera os arquivos do Prisma
COPY prisma ./prisma
RUN npx prisma generate

# ⚠️ Gera os arquivos do TypeScript
COPY . .
RUN npm run build

# Etapa 2 - Runtime
FROM node:20-alpine
WORKDIR /app

# App compilado
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev

# ⚠️ IMPORTANTE: copiar @prisma e .prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["node", "dist/main"]
