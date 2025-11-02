# Kubernetes Frontend Deployment

Arquivos de configuração para deploy do frontend Vue.js no Kubernetes.

## Arquivos

- `deployment.yaml` - Configuração do Deployment
- `service.yaml` - Configuração do Service
- `deploy-frontend.sh` - Script automatizado de deploy

## Como usar

### 1. Copiar arquivos para o servidor

```bash
scp -r k8s/frontend/* user@server:/root/k8s/frontend/
```

### 2. No servidor, executar o deploy

```bash
export TAG=20251102213203
export DOCKER_USER=filipesmota
cd /root/k8s/frontend
./deploy-frontend.sh
```

## Correções aplicadas

### Problema original
O erro `mapping values are not allowed in this context` na linha 19 ocorria por:
- Sintaxe YAML incorreta
- Falta de espaçamento adequado
- Possível uso de tabs em vez de espaços

### Solução
- Reescrito com sintaxe YAML correta
- Usa variáveis de ambiente `${DOCKER_USER}` e `${TAG}`
- O script `deploy-frontend.sh` usa `envsubst` para substituir as variáveis
- Indentação consistente com 2 espaços

## Variáveis de ambiente necessárias

- `TAG` - Tag da imagem Docker (ex: 20251102213203)
- `DOCKER_USER` - Usuário do Docker Hub (padrão: filipesmota)

## Verificar deployment

```bash
kubectl get deployments
kubectl get pods -l app=clinicaalma-frontend
kubectl get services clinicaalma-frontend
kubectl logs -l app=clinicaalma-frontend
```

## Troubleshooting

### Verificar sintaxe YAML
```bash
kubectl apply --dry-run=client -f deployment.yaml
```

### Ver logs de erro
```bash
kubectl describe deployment clinicaalma-frontend
kubectl describe pods -l app=clinicaalma-frontend
```

### Rollback se necessário
```bash
kubectl rollout undo deployment/clinicaalma-frontend
```
