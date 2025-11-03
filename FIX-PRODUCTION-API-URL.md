# 🔧 Fix: ERR_CONNECTION_REFUSED em Produção

## 🐛 Problema

Em produção, o frontend estava tentando conectar em `http://localhost:3001` em vez de `https://api.muniz.vps-kinghost.net`, resultando no erro:

```
POST http://localhost:3001/api/ocr/ficha-completa net::ERR_CONNECTION_REFUSED
```

## 🔍 Causa Raiz

O workflow do GitHub Actions ([.github/workflows/deploy-frontend.yml](.github/workflows/deploy-frontend.yml)) **não estava criando o arquivo `.env`** antes de fazer o build do Vue.js.

Quando o Vite faz o build sem o arquivo `.env`, ele usa o valor padrão definido no código:

```javascript
// client/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
```

Como `import.meta.env.VITE_API_BASE_URL` não estava definido, o build usava `localhost:3001`.

## ✅ Solução Implementada

### 1. Corrigir o GitHub Actions Workflow

Adicionado step para criar o arquivo `.env` antes do build:

```yaml
- name: Create .env file with production variables
  run: |
    cd client
    echo "VITE_API_BASE_URL=${{ secrets.VITE_API_BASE_URL }}" > .env
    echo "VITE_FIREBASE_API_KEY=${{ secrets.VITE_FIREBASE_API_KEY }}" >> .env
    echo "VITE_FIREBASE_AUTH_DOMAIN=${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}" >> .env
    echo "VITE_FIREBASE_PROJECT_ID=${{ secrets.VITE_FIREBASE_PROJECT_ID }}" >> .env
    echo "VITE_FIREBASE_STORAGE_BUCKET=${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}" >> .env
    echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}" >> .env
    echo "VITE_FIREBASE_APP_ID=${{ secrets.VITE_FIREBASE_APP_ID }}" >> .env

- name: Build Vue.js project
  run: |
    cd client
    npm run build
```

### 2. Configurar GitHub Secrets

Você precisa adicionar os seguintes secrets no GitHub:

1. Acesse: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

2. Adicione os seguintes secrets:

| Secret Name | Valor |
|-------------|-------|
| `VITE_API_BASE_URL` | `https://api.muniz.vps-kinghost.net` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyALOwv1te8Ii72WxRGRiPNI-Lt6C55BzBs` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `clinica-alma-cf5eb.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `clinica-alma-cf5eb` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `clinica-alma-cf5eb.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `29698139253` |
| `VITE_FIREBASE_APP_ID` | `1:29698139253:web:fa8ed326dba0838af0043c` |

### 3. Fazer um Novo Deploy

Após configurar os secrets, faça um commit e push para disparar o workflow:

```bash
git add .github/workflows/deploy-frontend.yml
git commit -m "fix: Adicionar variáveis de ambiente no build de produção"
git push origin main
```

### 4. Limpar Cache do Service Worker

Após o deploy, os usuários precisam limpar o cache do PWA:

1. Abra o site em produção
2. Pressione **F12** (DevTools)
3. Vá em **Application** → **Service Workers**
4. Clique em **Unregister** para remover service workers antigos
5. Vá em **Storage** → **Clear site data**
6. Recarregue a página (**Ctrl+Shift+R** ou **Cmd+Shift+R**)

## 🔐 Segurança

⚠️ **IMPORTANTE**: As credenciais do Firebase estão expostas no código atual. Para produção, considere:

1. **Mover credenciais sensíveis para variáveis de ambiente**
2. **Usar Firebase Security Rules** para proteger o acesso aos dados
3. **Rotacionar as API keys** periodicamente
4. **Habilitar App Check** no Firebase para validar requisições

## 📚 Arquivos Modificados

- [.github/workflows/deploy-frontend.yml](.github/workflows/deploy-frontend.yml) - Workflow do GitHub Actions
- Este documento de troubleshooting

## ✅ Verificação

Após o deploy, você pode verificar se está correto:

```bash
# 1. Baixar o bundle JavaScript
curl https://seu-site.com.br > index.html

# 2. Procurar pela URL da API
grep -o "api.muniz.vps-kinghost.net" index.html

# Se encontrar a URL, está correto!
```

Ou via DevTools do navegador:

1. Abra o site em produção
2. F12 → **Sources** → **Page** → **assets** → `index-*.js`
3. Procure por `api.muniz.vps-kinghost.net`

## 🎯 Resultado Esperado

Após aplicar esta correção:

- ✅ Frontend em produção usa `https://api.muniz.vps-kinghost.net`
- ✅ Chamadas de API funcionam corretamente
- ✅ OCR processa fichas sem erros de conexão
- ✅ Não há mais erros `ERR_CONNECTION_REFUSED`

## 📞 Suporte

Se o problema persistir:

1. Verifique se os GitHub Secrets foram configurados corretamente
2. Verifique os logs do GitHub Actions para ver se o `.env` foi criado
3. Verifique o bundle JavaScript para confirmar a URL correta
4. Limpe completamente o cache do navegador e service worker

---

**Última atualização**: 2025-11-03
