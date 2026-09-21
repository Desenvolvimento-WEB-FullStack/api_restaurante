FROM node:22-bookworm-slim AS builder

WORKDIR /app

# python3/make/g++ são necessários para compilar o bcrypt caso não haja
# binário pré-compilado para esta combinação exata de node/plataforma.
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-bookworm-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

EXPOSE 8888

CMD ["node", "src/index.js"]
