🧭 PASSO A PASSO
1️⃣ Clonar o projeto
git clone https://github.com/Iron-de-Oliveira/catalogo-online-mvp.git
cd catalogo-online-mvp
2️⃣ Ir para a branch do backend
git checkout backend

Atualizar a branch:

git pull origin backend
3️⃣ Criar sua própria branch

Sempre criar uma branch no padrão:

git checkout -b feature/nome-da-feature
🔹 Exemplos:
git checkout -b feature/login-backend
git checkout -b feature/api-produtos
git checkout -b feature/crud-produtos
4️⃣ Configurar o ambiente backend
cd BACKEND
nvm use

Se não tiver a versão:

nvm install
nvm use

Instalar dependências:

npm install

Configurar variáveis de ambiente:

cp .env.example .env

Rodar Prisma:

npx prisma generate
npx prisma migrate dev

Rodar servidor:

npm run dev
5️⃣ Desenvolver normalmente

Faça suas alterações no backend.

6️⃣ Antes de subir (muito importante)

Atualizar com a branch backend:

git checkout backend
git pull origin backend

git checkout feature/nome-da-feature
git merge backend
7️⃣ Subir sua branch
git add .
git commit -m "feat: descrição da sua alteração"
git push origin feature/nome-da-feature
8️⃣ Integrar com o backend

Após finalizar:

git checkout backend
git pull origin backend

git merge feature/nome-da-feature
git push origin backend
⚠️ REGRAS IMPORTANTES

❌ NÃO FAZER:

git push direto na backend

❌ NÃO trabalhar na main

✅ SEMPRE FAZER:

Criar branch feature/*
Atualizar antes de subir
Testar antes de fazer merge


///////////////////////////////////////
//////⚙️ Instalação do Backend////////
//////////////////////////////////////

📌 1. Acessar a pasta do backend
cd BACKEND

📌 2. Usar a versão correta do Node
nvm use

Se não tiver a versão instalada:

nvm install
nvm use

📌 3. Instalar dependências
npm install

📌 4. Configurar variáveis de ambiente

Criar o arquivo .env:

cp .env.example .env

📌 5. Configurar Prisma
Gerar o Prisma Client:

npx prisma generate

Rodar as migrations:

npx prisma migrate dev

📌 6. Rodar o backend
npm run dev

💡 Observações
O npm install instala todas as dependências do package.json
Sempre rodar os comandos dentro da pasta BACKEND
O banco de dados deve estar rodando (PostgreSQL ou Docker)
Não versionar .env