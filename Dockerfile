# Usa a imagem oficial do Node 22 (variante bookworm-slim, mais leve) como base e nomeia esse estágio de "builder"
FROM node:22-bookworm-slim AS builder

# Define /app como diretório de trabalho dentro do container (comandos seguintes rodam a partir daqui)
WORKDIR /app

# python3/make/g++ são necessários para compilar o bcrypt caso não haja
# binário pré-compilado para esta combinação exata de node/plataforma.
RUN apt-get update \
    # Instala os pacotes python3, make e g++ sem pacotes recomendados extras (imagem menor)
    && apt-get install -y --no-install-recommends python3 make g++ \
    # Remove a lista de pacotes do apt para reduzir o tamanho final da imagem
    && rm -rf /var/lib/apt/lists/*

# Copia package.json e package-lock.json do host para o diretório de trabalho no container
COPY package.json package-lock.json ./
# Instala as dependências de forma limpa e reprodutível (usando o lock file), ignorando devDependencies
RUN npm ci --omit=dev

# Inicia um novo estágio de build a partir da mesma imagem base do Node (imagem final, sem as libs de build)
FROM node:22-bookworm-slim

# Define /app como diretório de trabalho neste novo estágio
WORKDIR /app

# Copia apenas a pasta node_modules já instalada do estágio "builder" (evita reinstalar dependências e reduz o tamanho da imagem)
COPY --from=builder /app/node_modules ./node_modules
# Copia o package.json para a imagem final
COPY package.json ./
# Copia o código-fonte da aplicação (pasta src) para a imagem final
COPY src ./src

# Documenta que o container escuta na porta 8888 (não publica a porta sozinho, apenas informativo)
EXPOSE 8888

# Define o comando padrão executado quando o container é iniciado: roda a aplicação com node
CMD ["node", "src/index.js"]
