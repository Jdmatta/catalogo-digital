# CatálogoDigital

> Catálogo de produtos online com pedidos via WhatsApp — para pequenos negócios que querem vender mais sem depender de marketplace.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)

## Sobre o Projeto

O **CatálogoDigital** permite que pequenos negócios (lanchonetes, confeitarias, artesanato, restaurantes) criem um catálogo de produtos online em minutos, com página pública personalizada e integração direta com WhatsApp para receber pedidos.

**Sem taxa por venda. Sem comissão. Só o seu negócio.**

### Demo
🔗 [catalogo-digital.vercel.app](https://catalogo-digital.vercel.app) *(em breve)*

---

## Funcionalidades

### Para o Dono do Negócio (Painel Admin)
- [x] Cadastro e login com e-mail/senha
- [x] Criar e gerenciar produtos (nome, descrição, preço, foto, categoria)
- [x] Ativar/desativar produtos sem excluir
- [x] Personalizar a página pública (nome do negócio, cor, logo, descrição)
- [x] Configurar número do WhatsApp para receber pedidos

### Para o Cliente (Página Pública)
- [x] Catálogo responsivo com foto, nome, preço e descrição dos produtos
- [x] Filtro por categoria
- [x] Carrinho de compras simples
- [x] Botão "Pedir pelo WhatsApp" com mensagem automática formatada
- [x] URL personalizada: `catalogo-digital.vercel.app/meu-negocio`

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) |
| Estilização | Tailwind CSS |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | NextAuth.js (Credentials) |
| Deploy | Vercel + Railway (banco) |
| Linguagem | TypeScript |

---

## Estrutura do Projeto

```
catalogo-digital/
├── prisma/
│   └── schema.prisma          # Modelos do banco de dados
├── public/
│   └── images/                # Imagens estáticas
├── src/
│   ├── app/
│   │   ├── (auth)/            # Rotas de login e registro
│   │   ├── (public)/[slug]/   # Página pública do catálogo
│   │   ├── admin/             # Painel do dono do negócio
│   │   └── api/               # Endpoints da API
│   ├── components/
│   │   ├── ui/                # Componentes reutilizáveis (Button, Input, Card...)
│   │   ├── catalog/           # Componentes do catálogo público
│   │   └── admin/             # Componentes do painel admin
│   ├── lib/
│   │   ├── prisma.ts          # Client do Prisma
│   │   ├── auth.ts            # Configuração do NextAuth
│   │   └── whatsapp.ts        # Gerador de link do WhatsApp
│   └── types/
│       └── index.ts           # Tipos TypeScript globais
└── .env.example               # Variáveis de ambiente necessárias
```

---

## Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL rodando localmente (ou use o Railway)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/catalogo-digital.git
cd catalogo-digital

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local com suas credenciais

# 4. Rode as migrations do banco
npx prisma migrate dev

# 5. (Opcional) Popule com dados de exemplo
npx prisma db seed

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

---

## Variáveis de Ambiente

```env
DATABASE_URL="postgresql://user:password@localhost:5432/catalogo_digital"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Roadmap

- [ ] Upload de imagens via Cloudinary ou Supabase Storage
- [ ] Múltiplos temas visuais para o catálogo
- [ ] Analytics básico (visualizações e cliques no WhatsApp)
- [ ] Plano pago com domínio personalizado (SaaS)
- [ ] QR Code para compartilhar o catálogo

---

## Autor

Feito por **[Seu Nome](https://github.com/seu-usuario)** — desenvolvedor web focado em soluções práticas para pequenos negócios.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/seu-perfil)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/seu-usuario)
