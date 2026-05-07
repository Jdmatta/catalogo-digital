# GitHub — Milestones e Issues

## Como usar este arquivo
Crie cada milestone e issue abaixo no seu repositório GitHub.
Milestones agrupam as issues por fase do projeto.

---

## Milestone 1 — Setup e Infraestrutura
**Meta:** Projeto rodando localmente com banco de dados configurado.

### Issues

**[SETUP-1] Inicializar projeto Next.js com TypeScript e Tailwind**
```
- Criar projeto com: npx create-next-app@latest catalogo-digital --typescript --tailwind --app
- Instalar dependências: prisma, @prisma/client, next-auth, bcryptjs, @types/bcryptjs
- Configurar tsconfig.json com path alias @/
- Criar .env.local a partir do .env.example
- Labels: setup
```

**[SETUP-2] Configurar banco de dados com Prisma**
```
- Criar banco PostgreSQL (local ou Railway)
- Preencher DATABASE_URL no .env.local
- Rodar: npx prisma migrate dev --name init
- Verificar tabelas criadas com: npx prisma studio
- Labels: setup, database
```

**[SETUP-3] Configurar NextAuth com Credentials**
```
- Criar src/lib/auth.ts com configuração do NextAuth
- Criar src/app/api/auth/[...nextauth]/route.ts
- Implementar login com e-mail e senha (bcrypt)
- Testar login no Postman ou Thunder Client
- Labels: setup, auth
```

---

## Milestone 2 — Autenticação e Registro
**Meta:** Usuário consegue criar conta e fazer login.

### Issues

**[AUTH-1] Página de registro de novo usuário**
```
- Criar src/app/(auth)/register/page.tsx
- Formulário: nome, e-mail, senha, confirmar senha
- Validação client-side (campo obrigatório, e-mail válido, senhas iguais)
- Criar API route POST /api/auth/register
- Hash da senha com bcryptjs antes de salvar
- Labels: auth, frontend
```

**[AUTH-2] Página de login**
```
- Criar src/app/(auth)/login/page.tsx
- Formulário: e-mail e senha
- Integrar com NextAuth signIn()
- Redirecionar para /admin após login bem-sucedido
- Mostrar erro se credenciais inválidas
- Labels: auth, frontend
```

**[AUTH-3] Proteção de rotas do admin**
```
- Criar middleware.ts na raiz do projeto
- Redirecionar /admin/* para /login se não autenticado
- Labels: auth
```

---

## Milestone 3 — Painel Admin (CRUD de Produtos)
**Meta:** Dono do negócio consegue gerenciar seus produtos.

### Issues

**[ADMIN-1] Criar loja no primeiro acesso**
```
- Após registro, redirecionar para /admin/setup
- Formulário: nome da loja, slug (URL), WhatsApp, descrição
- Validar slug único (sem espaços, apenas letras, números e hífens)
- Criar registro na tabela Store
- Labels: admin, feature
```

**[ADMIN-2] Listagem de produtos no admin**
```
- Criar src/app/admin/produtos/page.tsx
- Tabela com: foto, nome, preço, categoria, status (ativo/inativo)
- Botões: editar, excluir, ativar/desativar
- Labels: admin, feature
```

**[ADMIN-3] Formulário de criar/editar produto**
```
- Criar src/app/admin/produtos/novo/page.tsx
- Campos: nome, descrição, preço, categoria, URL da imagem, ativo
- API routes: POST /api/produtos e PUT /api/produtos/[id]
- Labels: admin, feature
```

**[ADMIN-4] Gerenciar categorias**
```
- Criar seção de categorias no admin
- CRUD simples: criar, renomear, excluir categoria
- Labels: admin, feature
```

---

## Milestone 4 — Página Pública do Catálogo
**Meta:** Cliente consegue ver o catálogo e enviar pedido pelo WhatsApp.

### Issues

**[PUBLIC-1] Página pública do catálogo**
```
- Criar src/app/(public)/[slug]/page.tsx
- Buscar loja pelo slug (Server Component)
- Exibir: logo, nome, descrição, produtos por categoria
- Retornar 404 se slug não existir ou loja inativa
- Labels: frontend, feature
```

**[PUBLIC-2] Filtro por categoria**
```
- Botões de filtro acima dos produtos
- Filtrar produtos por categoria selecionada
- "Todos" como opção padrão
- Labels: frontend, feature
```

**[PUBLIC-3] Carrinho de compras**
```
- Estado do carrinho com useState (sem banco de dados)
- Adicionar/remover produtos
- Badge com quantidade no ícone do carrinho
- Drawer/modal com resumo do pedido
- Labels: frontend, feature
```

**[PUBLIC-4] Botão "Pedir pelo WhatsApp"**
```
- Usar src/lib/whatsapp.ts para gerar o link
- Abrir WhatsApp com mensagem formatada com os itens do carrinho
- Labels: frontend, feature
```

---

## Milestone 5 — Qualidade e Deploy
**Meta:** Projeto deployado e apresentável.

### Issues

**[DEPLOY-1] Configurar deploy na Vercel**
```
- Criar projeto na Vercel conectado ao GitHub
- Configurar variáveis de ambiente na Vercel
- Configurar banco de dados no Railway
- Labels: deploy
```

**[QUALITY-1] Responsividade mobile**
```
- Testar em mobile (360px) e tablet (768px)
- Ajustar grid de produtos para mobile
- Ajustar carrinho para mobile
- Labels: frontend, quality
```

**[QUALITY-2] Estados de loading e erro**
```
- Skeleton loading na página do catálogo
- Mensagem de erro quando produto não carrega
- Loading no botão de salvar produto
- Labels: frontend, quality
```

**[QUALITY-3] Seed de dados de exemplo**
```
- Criar prisma/seed.ts com loja e produtos fictícios
- Facilitar demonstração do projeto para recrutadores
- Labels: database
```
