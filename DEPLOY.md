# Deploy na VPS (Hostinger) com Coolify

Infraestrutura: [Coolify](https://coolify.io) instalado direto na VPS —
ele cuida de proxy reverso, HTTPS (Let's Encrypt) e redeploy automático a
cada push na `main`. A API roda como uma **Application** (build direto do
`Dockerfile` deste repositório) e o Postgres roda como uma **Database**
gerenciada pelo próprio Coolify — isso dá backup automático agendado e
restauração de backup pela UI, sem precisar escrever script nenhum.

`docker-compose.yml` continua no repositório só para rodar tudo localmente
(`docker compose up`) durante o desenvolvimento; em produção ele não é
usado — a VPS usa os dois recursos separados do Coolify descritos abaixo.

VPS: `2.25.233.101` (Ubuntu). Repositório: `Desenvolvimento-WEB-FullStack/api_restaurante`.

## 1. Instalar o Coolify na VPS

Rode uma única vez, via SSH como root (comando oficial do Coolify):

```bash
ssh root@2.25.233.101 'curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash'
```

O instalador cuida de Docker, do proxy (Traefik) e sobe a própria UI do
Coolify. Ao final ele mostra o endereço de acesso, algo como:

```
http://2.25.233.101:8000
```

Se você usa firewall (`ufw`), garanta que as portas `22`, `80`, `443` e
`8000` estão liberadas (`ufw allow 8000/tcp`, etc.) — o instalador
normalmente já cuida disso, mas vale conferir com `ufw status`.

## 2. Configuração inicial

Acesse `http://2.25.233.101:8000`, crie a conta de administrador (primeiro
acesso) e siga o wizard inicial do Coolify.

## 3. Criar o banco de dados (com backup automático)

**New Resource → Databases → PostgreSQL**. O Coolify sobe o container e
mostra host/porta/usuário/senha/nome do banco internos (algo como
`postgres-xxxx` na rede interna do Coolify) — vai usar isso no passo 5.

Na aba **Backups** desse recurso:
- ative os backups agendados (define frequência e retenção);
- opcionalmente configure um destino S3-compatível para guardar as cópias
  fora da própria VPS;
- pela mesma tela dá pra **restaurar** um backup existente — se você já tem
  um dump seu (`.sql` de `pg_dump`), tem uma opção de importar/restaurar
  esse arquivo direto por ali, sem precisar de linha de comando.

## 4. Conectar o repositório do GitHub

Dentro do Coolify: **Sources → GitHub** (ou "New Resource" → escolher origem
GitHub) e siga o fluxo dele para conectar via GitHub App (recomendado — dá
acesso ao repo e já cadastra o webhook de deploy automático) ou informar a
URL do repositório diretamente se for público.

## 5. Criar a aplicação

**New Resource → Application**, escolha o repositório/branch `main` e o
build pack **Dockerfile** (não "Docker Compose" — o Postgres já é o recurso
do passo 3). O Coolify builda a imagem usando o [Dockerfile](Dockerfile) da
raiz do projeto.

## 6. Variáveis de ambiente da aplicação

Na aba de Environment Variables da Application, cadastre:

```
DB_HOST=<host interno do recurso PostgreSQL do passo 3>
DB_PORT=<porta interna do recurso PostgreSQL do passo 3>
DB_USER=<usuário do recurso PostgreSQL do passo 3>
DB_PASSWORD=<senha do recurso PostgreSQL do passo 3>
DB_NAME=<nome do banco do recurso PostgreSQL do passo 3>
JWT_SECRET=<segredo forte, ex: openssl rand -hex 32>
PORT=8888
```

(os valores de `DB_*` ficam visíveis na página do recurso PostgreSQL criado
no passo 3 — pode copiar direto de lá.)

## 7. Domínio e HTTPS

Aponte o registro **A** do seu domínio para `2.25.233.101` no DNS. Na aba de
domínio da Application, informe o domínio — o Coolify provisiona o
certificado Let's Encrypt e configura o proxy automaticamente (sem editar
Nginx à mão).

## 8. Deploy automático

Com a integração via GitHub App (passo 4), o Coolify já cadastra o webhook:
todo `git push` na `main` dispara um novo deploy sozinho. Se conectou só
pela URL pública, ative o "Auto Deploy"/webhook manualmente nas
configurações da Application.

## 9. Primeiro deploy + schema do banco

Clique em **Deploy** na Application para o primeiro build.

Aplique o schema pela aba **Terminal** do
recurso PostgreSQL (cole o conteúdo do `.sql`) ou via SSH:

```bash
psql -U $DB_USER -d $DB_NAME < src/database/drawSQL-pgsql-export-2026-07-21.sql
```

E crie o usuário admin pela aba **Terminal** da Application:

```bash
node src/database/seeds/usuarios.seed.js
```

## Dia a dia

A partir daqui, todo `git push` na `main` atualiza a aplicação sozinho. Logs,
métricas, restart, rollback e backups do banco ficam disponíveis direto na
UI do Coolify — não precisa mais de SSH manual para o dia a dia.
