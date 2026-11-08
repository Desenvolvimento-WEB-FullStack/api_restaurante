# v6 — pronta para produção: multi-stage + usuário sem root + healthcheck
# ---------- estágio 1: instala dependências ----------
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- estágio 2: imagem final ----------
FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

# --chown: os arquivos pertencem ao usuário "node" (já existe na imagem oficial)
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src

# não roda como root: se alguém invadir a app, não é root no container
USER node

EXPOSE 8888

# o Docker testa a cada 30s se a API responde (qualquer resposta HTTP = viva)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:8888').then(() => process.exit(0)).catch(() => process.exit(1))"

CMD ["node", "src/index.js"]
