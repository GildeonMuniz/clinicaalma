#!/bin/bash

# Script de deploy do Frontend Vue.js no Kubernetes

set -e

# Verificar se a TAG foi fornecida
if [ -z "$TAG" ]; then
  echo "Erro: Variável TAG não foi definida"
  exit 1
fi

# Verificar se o DOCKER_USER foi fornecido (ou usar padrão)
if [ -z "$DOCKER_USER" ]; then
  DOCKER_USER="filipesmota"
  echo "Usando DOCKER_USER padrão: $DOCKER_USER"
fi

echo "Atualizando deploy do Frontend Vue.js (tag: $TAG)..."

# Substituir variáveis no deployment.yaml
export DOCKER_USER=$DOCKER_USER
export TAG=$TAG

# Aplicar deployment com substituição de variáveis
envsubst < deployment.yaml | kubectl apply -f -

# Aplicar service (se não existir)
kubectl apply -f service.yaml

# Aguardar o rollout
echo "Aguardando rollout do deployment..."
kubectl rollout status deployment/clinicaalma-frontend --timeout=300s

# Verificar status
echo "Status do deployment:"
kubectl get deployment clinicaalma-frontend
kubectl get pods -l app=clinicaalma-frontend

echo "Deploy do Frontend concluído com sucesso!"
