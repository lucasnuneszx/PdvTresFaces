# Sistema PDV

PDV web para delivery e balcão: cardápio público, pedidos, controle de caixa, entregas, impressão de comandas e integração com o iFood. Perfis de acesso para administrador, gerente, caixa, cozinha e cliente.

## Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, Radix UI, lucide-react
- Prisma ORM (SQLite por padrão, configurado em `prisma/schema.prisma`)
- NextAuth.js (login por credenciais)

## Rodando localmente

Requer Node.js 18+.

```bash
npm install            # também roda prisma generate
cp env.example .env.local
npm run db:push        # cria/atualiza o banco a partir do schema
npm run populate:pizza # opcional: dados de exemplo (sabores e tamanhos)
npm run dev
```

A aplicação sobe em `http://localhost:3000`. Para criar os usuários iniciais rode `node scripts/vercel-setup.js` (ou `npm run vercel:admin` só para o admin).

## Variáveis de ambiente

Obrigatórias:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Opcionais:

- iFood: `IFOOD_API_URL`, `IFOOD_API_KEY`, `IFOOD_API_SECRET`
- Impressora: `PRINTER_IP`, `PRINTER_PORT`, `AUTO_PRINT`
- Loja (valores padrão, também editáveis no painel): `RESTAURANT_NAME`, `RESTAURANT_ADDRESS`, `RESTAURANT_PHONE`, `RESTAURANT_EMAIL`, `DELIVERY_ESTIMATE`, `OPENING_HOURS`, `DELIVERY_FEE`, `MIN_ORDER_VALUE`, `TAX_RATE`, `IS_OPEN`

Veja `env.example` como modelo.

## Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build usado na Vercel (`scripts/vercel-build.js`) |
| `npm run railway:build` / `railway:start` | build e start usados no Railway |
| `npm run lint` | ESLint |
| `npm run db:studio` | Prisma Studio |

## Deploy

- **Railway**: `railway.json` e `Procfile`. O release roda `scripts/railway-setup.js`, que aplica o schema e popula o cardápio se o banco estiver vazio. Healthcheck em `/api/health`.
- **Vercel**: `vercel.json`, build via `scripts/vercel-build.js`.

## Estrutura

```
app/
  admin/        painel administrativo (cardápio, pedidos, caixa, entregas, iFood, relatórios)
  api/          rotas de API
  auth/         login e cadastro
  cashier/      tela do caixa
  client/       cardápio, checkout e pedidos do cliente
  dashboard/    painel inicial por perfil
components/     componentes compartilhados (ui/ com os primitivos)
lib/            auth, prisma, constantes e utilitários
prisma/         schema do banco
scripts/        setup, seed e build
types/          tipos compartilhados
```
