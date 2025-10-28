#!/bin/bash

# Script de deploy para Railway
echo "🚀 Iniciando deploy no Railway..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Aplicar migrações do banco
echo "🗄️ Aplicando migrações do banco..."
npx prisma db push

# Popular dados iniciais se necessário
echo "🍽️ Populando dados de pratos..."
node scripts/populate-pizza-data.js

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
npm start
