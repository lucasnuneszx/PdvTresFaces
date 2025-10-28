# Sistema PDV - Demonstração

Sistema completo de gestão para estabelecimentos comerciais com interface web responsiva, controle de caixa, integração com iFood e sistema de impressão.

## 🚀 Funcionalidades

### 👥 Sistema de Usuários
- **Cliente**: Visualizar cardápio, fazer pedidos, acompanhar status
- **Caixa**: Processar pedidos, controle de caixa, fechamento
- **Gerente**: Gestão de combos, relatórios, pedidos
- **Administrador**: Acesso completo ao sistema
- **Cozinha**: Visualizar pedidos, atualizar status

### 🍕 Gestão de Produtos
- Cadastro completo de combos com fotos e descrições
- Categorização de produtos
- Controle de disponibilidade
- Upload de imagens

### 🛒 Sistema de Pedidos
- Carrinho de compras intuitivo
- Checkout com múltiplas formas de pagamento
- Opções de retirada e entrega
- Cadastro de endereços
- Acompanhamento de status em tempo real

### 💰 Controle de Caixa
- Abertura e fechamento de caixa
- Relatórios de vendas por método de pagamento
- Histórico de movimentações
- Controle de vendas do dia

### 🚚 Integração iFood
- Sincronização automática de pedidos
- Atualização de status
- Gestão centralizada

### 🖨️ Sistema de Impressão
- Impressão automática para cozinha
- Cupom fiscal
- Download de arquivos
- Configuração de impressora

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação**: NextAuth.js
- **UI Components**: Radix UI, Lucide React
- **Notificações**: React Hot Toast

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🚀 Instalação Local

1. **Clone o repositório**
```bash
git clone <repository-url>
cd pdvsystemcentral
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# iFood API (opcional)
IFOOD_API_URL=""
IFOOD_API_KEY=""
IFOOD_MERCHANT_ID=""

# Cloudinary para upload de imagens (opcional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Configurações de impressão (opcional)
PRINTER_IP=""
PRINTER_PORT="9100"
```

4. **Configure o banco de dados**
```bash
npm run db:generate
npm run db:push
```

5. **Execute o projeto**
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 👤 Primeiro Acesso

1. Acesse `http://localhost:3000`
2. Clique em "Cadastrar" para criar uma conta
3. Após o cadastro, faça login
4. Para criar usuários administrativos, edite diretamente no banco de dados

## 📱 Uso do Sistema

### Para Clientes
1. Faça login ou cadastre-se
2. Navegue pelo cardápio
3. Adicione itens ao carrinho
4. Finalize o pedido escolhendo forma de pagamento e entrega
5. Acompanhe o status do pedido

### Para Funcionários
1. Faça login com suas credenciais
2. Acesse o dashboard específico do seu cargo
3. Gerencie pedidos, combos ou caixa conforme sua função

### Para Administradores
1. Acesse todas as funcionalidades
2. Gerencie combos em `/admin/combos`
3. Configure o sistema em `/admin/settings`
4. Visualize relatórios e estatísticas

## 🚀 Deploy

### Railway (Recomendado)

1. **Crie uma conta no Railway**
   - Acesse [railway.app](https://railway.app)
   - Faça login com GitHub

2. **Crie um novo projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte seu repositório

3. **Configure o banco de dados**
   - No projeto, clique em "New" → "Database" → "Add PostgreSQL"
   - Copie a variável `DATABASE_URL`

4. **Configure as variáveis de ambiente**
   - Vá em "Variables"
   - Adicione as seguintes variáveis:
   ```env
   DATABASE_URL=<sua-url-do-postgres>
   NEXTAUTH_URL=https://seu-app.railway.app
   NEXTAUTH_SECRET=<gere-um-secret-aleatorio>
   ```

5. **Faça o deploy**
   - Railway detectará automaticamente o `railway.json`
   - O build será executado automaticamente
   - A primeira instalação criará as tabelas necessárias

6. **Acesse sua aplicação**
   - Railway fornecerá uma URL pública
   - Acesse `/auth/signup` para criar sua primeira conta
   - Acesse `/admin/settings` para configurar a loja

### Vercel

1. **Conecte o repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório GitHub

2. **Configure as variáveis de ambiente**
   - Vá em "Settings" → "Environment Variables"
   - Adicione todas as variáveis necessárias

3. **Configure o banco de dados**
   - Use Vercel Postgres ou outro provedor PostgreSQL
   - Adicione a `DATABASE_URL` nas variáveis de ambiente

4. **Deploy**
   - Vercel fará o build automaticamente
   - A URL será fornecida após o deploy

### Outras Plataformas

O sistema é compatível com qualquer plataforma que suporte Next.js:
- **Netlify**: Configure build command: `npm run build` e publish directory: `.next`
- **DigitalOcean**: Use App Platform com configuração Next.js
- **AWS**: Use Amplify ou EC2 + Docker

## 🔧 Configurações Avançadas

### Upload de Imagens
- As imagens são salvas como base64 no banco de dados
- Para produção, configure Cloudinary nas variáveis de ambiente
- Acesse `/admin/settings` para fazer upload da logo e banner

### Integração com iFood
1. Configure as variáveis `IFOOD_API_*` nas variáveis de ambiente
2. Acesse `/admin/ifood` para gerenciar pedidos
3. Use o botão "Sincronizar" para buscar novos pedidos

### Sistema de Impressão
1. Configure `PRINTER_IP` e `PRINTER_PORT` nas variáveis de ambiente
2. Use o componente `PrintOrder` em suas páginas
3. Teste a impressão antes de usar em produção

## 📊 Estrutura do Projeto

```
pdvsystemcentral/
├── app/                    # Next.js app router
│   ├── admin/             # Painel administrativo
│   ├── api/               # API routes
│   ├── client/            # Área do cliente
│   ├── cashier/           # Área do caixa
│   └── auth/              # Autenticação
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
├── prisma/                # Schema do banco de dados
└── scripts/               # Scripts utilitários
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Inicia o servidor de produção
- `npm run db:generate` - Gera o Prisma Client
- `npm run db:push` - Aplica mudanças no schema
- `npm run db:migrate` - Cria migration
- `npm run db:studio` - Abre Prisma Studio

## 🐛 Solução de Problemas

### Erro ao fazer upload de imagens
- Verifique se o banco de dados aceita campos grandes
- Para PostgreSQL, os campos `TEXT` não têm limite de tamanho
- Reduza o tamanho das imagens antes de fazer upload

### Logo não aparece no cardápio
- Verifique se a imagem foi salva corretamente em `/admin/settings`
- Limpe o cache do navegador
- Verifique o console do navegador para erros

### Erro ao criar usuário admin
- Use o script `make-admin.js`: `node make-admin.js`
- Ou edite diretamente no banco de dados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Consulte a documentação do Prisma
3. Verifique as configurações do banco de dados

## 📄 Licença

Este projeto é para demonstração de sistema PDV.

---

**Desenvolvido com ❤️ para demonstração de sistema PDV**



