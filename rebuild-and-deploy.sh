#!/bin/bash

# Script de rebuild e deploy completo do frontend
# Este script resolve o problema de URLs incorretas em produção

set -e

echo "🚀 Iniciando rebuild e deploy do frontend..."
echo ""

# 1. Limpar builds antigos
echo "🧹 Limpando builds antigos..."
rm -rf client/dist
rm -rf client/dev-dist
rm -rf client/node_modules/.vite

# 2. Verificar .env
echo ""
echo "📋 Verificando configuração do .env..."
if [ ! -f "client/.env" ]; then
    echo "❌ Erro: Arquivo client/.env não encontrado!"
    echo "Copie client/.env.example para client/.env e configure as variáveis"
    exit 1
fi

echo "Conteúdo do .env:"
cat client/.env | grep VITE_API_BASE_URL
echo ""

# 3. Build de produção
echo "🔨 Fazendo build de produção..."
cd client
npm run build
cd ..

# 4. Verificar se a URL correta está no bundle
echo ""
echo "🔍 Verificando URL no bundle..."
if grep -q "api.muniz.vps-kinghost.net" client/dist/assets/*.js; then
    echo "✅ URL da API está correta no bundle: https://api.muniz.vps-kinghost.net"
else
    echo "❌ ERRO: URL da API não encontrada no bundle!"
    echo "Verifique o arquivo client/.env"
    exit 1
fi

# 5. Build da imagem Docker
echo ""
echo "🐳 Fazendo build da imagem Docker..."
TIMESTAMP=$(date +%Y%m%d%H%M%S)
TAG="v${TIMESTAMP}"
DOCKER_USER="acer2310"

docker build -t ${DOCKER_USER}/clinicaalma-frontend:${TAG} .
docker tag ${DOCKER_USER}/clinicaalma-frontend:${TAG} ${DOCKER_USER}/clinicaalma-frontend:latest

echo ""
echo "✅ Imagem Docker criada: ${DOCKER_USER}/clinicaalma-frontend:${TAG}"

# 6. Push para Docker Hub
echo ""
read -p "Deseja fazer push para Docker Hub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "📤 Fazendo push para Docker Hub..."
    docker push ${DOCKER_USER}/clinicaalma-frontend:${TAG}
    docker push ${DOCKER_USER}/clinicaalma-frontend:latest
    echo "✅ Push concluído!"
fi

# 7. Deploy no Kubernetes
echo ""
read -p "Deseja fazer deploy no Kubernetes? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "☸️  Fazendo deploy no Kubernetes..."
    cd k8s/frontend
    export DOCKER_USER=${DOCKER_USER}
    export TAG=${TAG}
    ./deploy-frontend.sh
    cd ../..
    echo "✅ Deploy concluído!"
fi

echo ""
echo "🎉 Processo concluído!"
echo ""
echo "⚠️  IMPORTANTE: Limpe o cache do navegador e do service worker:"
echo "   1. Abra o site em produção"
echo "   2. Pressione F12 (DevTools)"
echo "   3. Vá em 'Application' > 'Service Workers'"
echo "   4. Clique em 'Unregister' para remover service workers antigos"
echo "   5. Vá em 'Storage' > 'Clear site data'"
echo "   6. Recarregue a página (Ctrl+Shift+R ou Cmd+Shift+R)"
echo ""
