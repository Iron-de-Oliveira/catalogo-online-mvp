🧭 PASSO A PASSO

1️⃣ Clonar o projeto
git clone https://github.com/Iron-de-Oliveira/catalogo-online-mvp.git

cd catalogo-online-mvp

2️⃣ Ir para a branch do frontend
git checkout frontend

Atualizar a branch:
git pull origin frontend

3️⃣ Criar sua própria branch

Sempre criar uma branch no padrão:

git checkout -b feature/nome-da-feature
🔹 Exemplos:
git checkout -b feature/login-frontend
git checkout -b feature/navbar
git checkout -b feature/catalogo

4️⃣ Desenvolver normalmente
Faça suas alterações no projeto.

5️⃣ Antes de subir (muito importante)
Garantir que sua branch está atualizada com frontend:

git checkout frontend
git pull origin frontend

git checkout feature/nome-da-feature
git merge frontend

6️⃣ Subir sua branch
git add .
git commit -m "feat: descrição da sua alteração"
git push origin feature/nome-da-feature

7️⃣ Integrar com o frontend
Após finalizar sua tarefa, fazer merge na branch frontend:

git checkout frontend
git pull origin frontend

git merge feature/nome-da-feature
git push origin frontend

⚠️ REGRAS IMPORTANTES

❌ NÃO FAZER:

git push direto na frontend

❌ NÃO trabalhar na main

✅ SEMPRE FAZER:

Criar branch feature/*
Atualizar antes de subir
Fazer merge corretamente

#/////////////////////////////////////////////#
#///// instalação de dependencias front /////#
#///////////////////////////////////////////#

📌 1. Acessar a pasta do frontend
cd FRONTEND

📌 2. Usar a versão correta do Node
nvm use

Se não tiver a versão instalada:

nvm install
nvm use

📌 3. Instalar dependências
npm install

📌 4. Rodar o frontend
npm run dev

💡 Observações
O npm install instala todas as dependências definidas no package.json
Sempre rodar dentro da pasta FRONTEND
Não versionar a pasta node_modules