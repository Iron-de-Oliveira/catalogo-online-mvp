# Fluxo de Upload de Imagens

## Arquitetura Implementada

### Backend (Express + Multer)
1. **Middleware de Upload**: `BACKEND/src/middlewares/upload.js`
   - Armazena imagens em: `BACKEND/uploads/`
   - Nomeia arquivo com timestamp + número aleatório
   - Aceita: JPEG, PNG, GIF, WebP
   - Limite: 5MB por arquivo
   - Retorna URL relativa: `/{filename}`

2. **Configuração Express**: `BACKEND/src/server.js`
   - Serve arquivos estáticos de `/uploads` via: `app.use(express.static(path.join(__dirname, '../uploads')))`
   - Permite acesso público às imagens

3. **Rotas**:
   - `POST /upload` - Teste de upload (retorna URL)
   - `POST /produtos` - Criar produto com upload (multipart/form-data)

4. **Controller**: `BACKEND/src/controllers/ProdutoController.js`
   - Aceita arquivo via `req.file.filename`
   - Salva caminho no banco de dados: `/filename.ext`
   - Compatível com valores 'foto' do body (fallback)

### Frontend (React)
1. **Configuração API**: `FRONTEND/src/services/server.js`
   - Exporta: `baseURL = 'http://localhost:3333'`
   - Usado para construir URLs de imagem completas

2. **Renderização de Imagens**:
   - Home: `src={produto.foto ? \`${baseURL}${produto.foto}\` : "/placeholder.png"}`
   - Detalhe: mesmo padrão em exibProduto.jsx

## Testes de Uso

### 1. Teste Simples de Upload (GET /upload)
```bash
# Via cURL
curl -X POST http://localhost:3333/upload \
  -F "foto=@/path/to/image.jpg"

# Resposta esperada:
{
  "message": "Arquivo enviado com sucesso",
  "filename": "1234567890-987654321.jpg",
  "url": "/1234567890-987654321.jpg"
}
```

### 2. Criar Produto com Imagem (POST /produtos)
```bash
curl -X POST http://localhost:3333/produtos \
  -F "nome=Cadeira Rústica" \
  -F "categoria=CADEIRAS" \
  -F "estoque=5" \
  -F "descricao=Cadeira de madeira maciça" \
  -F "foto=@/path/to/cadeira.jpg" \
  -F "preco=299.99" \
  -F "idAdministrador=1"

# Resposta esperada:
{
  "id": 1,
  "nome": "Cadeira Rústica",
  "foto": "/1234567890-987654321.jpg",
  "preco": "299.99",
  ...
}
```

### 3. Verificar Acesso via Frontend
1. Iniciar backend: `npm start` (BACKEND)
2. Iniciar frontend: `npm run dev` (FRONTEND)
3. Criar produto via Postman/cURL
4. Visitar `http://localhost:5173/` (home)
5. Verificar se imagem carrega: `http://localhost:3333/{filename}`

## Estrutura de Diretórios

```
BACKEND/
├── uploads/              ← Armazena imagens
│   ├── 1234567890-123.jpg
│   ├── 1234567890-456.png
│   └── ...
├── src/
│   ├── middlewares/
│   │   └── upload.js     ← Configuração Multer
│   ├── controllers/
│   │   └── ProdutoController.js (ATUALIZADO)
│   ├── routes/
│   │   └── routes.router.js (ATUALIZADO)
│   └── server.js         (ATUALIZADO - static files)
└── package.json          (ATUALIZADO - multer instalado)
```

## Fluxo Completo de Funcionamento

1. **Usuário faz upload** (Frontend FormData)
   ```jsx
   const formData = new FormData();
   formData.append('nome', 'Cadeira');
   formData.append('foto', fileInput.files[0]); // File object
   formData.append(...outros campos...);
   
   await api.post('/produtos', formData, {
     headers: { 'Content-Type': 'multipart/form-data' }
   });
   ```

2. **Backend recebe e processa**
   - Multer intercepta: `upload.single('foto')`
   - Arquivo salvo em: `/uploads/timestamp-random.ext`
   - Controller recebe: `req.file.filename`
   - Salva no banco: `foto: "/1234567890-123.jpg"`

3. **Frontend renderiza**
   - Lê campo `produto.foto`: "/1234567890-123.jpg"
   - Constrói URL completa: "http://localhost:3333/1234567890-123.jpg"
   - Express serve imagem via static middleware

## Considerações de Produção

- [ ] Adicionar validação de dimensões de imagem
- [ ] Adicionar compressão de imagem automática
- [ ] Implementar deleção de imagem ao deletar produto
- [ ] Usar storage externo (AWS S3, Cloudinary) em produção
- [ ] Adicionar versionamento de cache para imagens
- [ ] Implementar remoção de imagens antigas automaticamente
