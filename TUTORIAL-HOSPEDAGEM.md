# Tutorial Completo - Hospedagem para Celular

## 🎯 Objetivo

Hospedar a aplicação para acessar no celular com HTTPS (necessário para câmera funcionar).

---

## Opções de Hospedagem

| Opção | Tempo | Custo | HTTPS | Complexidade |
|-------|-------|-------|-------|--------------|
| **Vercel** | 10 min | Grátis | ✅ Sim | ⭐ Fácil |
| **Firebase Hosting** | 15 min | Grátis | ✅ Sim | ⭐⭐ Médio |
| **Netlify** | 10 min | Grátis | ✅ Sim | ⭐ Fácil |
| **Render** | 15 min | Grátis | ✅ Sim | ⭐⭐ Médio |

**Recomendação:** **Vercel** (mais fácil e rápido)

---

# OPÇÃO 1: Vercel (RECOMENDADO) ⭐

## Vantagens:
- ✅ 100% gratuito
- ✅ HTTPS automático
- ✅ Deploy em 5 minutos
- ✅ URL bonita (clinica-alma.vercel.app)
- ✅ Updates automáticos

---

## Passo 1: Preparar Projeto

### 1.1. Build Local (Testar)

```bash
cd C:\Clinicaalma\client
npm run build
```

✅ **Se funcionar:** Prossiga
❌ **Se der erro:** Corrija antes de continuar

### 1.2. Criar Conta Vercel

1. Acesse: https://vercel.com/signup
2. Clique em **"Continue with GitHub"** (recomendado)
   - Ou use email/Google
3. Complete o cadastro (gratuito)

---

## Passo 2: Preparar Backend (Importante!)

O backend (Node.js) precisa rodar separadamente. Vamos usar **Render** para o backend.

### 2.1. Criar conta no Render

1. Acesse: https://render.com/
2. Clique em **"Get Started"**
3. Faça login com GitHub ou email

### 2.2. Criar Web Service

1. No dashboard, clique em **"New +"**
2. Selecione **"Web Service"**

### 2.3. Conectar Repositório

**Se NÃO tiver GitHub:**

1. Clique em **"Deploy without Git"** (ou "Public Git Repository")
2. Vamos fazer upload manual

**Se TIVER GitHub:**

1. Conecte sua conta GitHub
2. Selecione o repositório (se estiver no GitHub)

### 2.4. Configurar Backend

Preencha:

```
Name: clinica-alma-backend
Environment: Node
Region: Oregon (US West) - mais próximo
Branch: main (se usar Git)
```

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
node server/index.js
```

**Importante:** Clique em **"Advanced"** e adicione:

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
```

### 2.5. Deploy Backend

1. Clique em **"Create Web Service"**
2. Aguarde ~5 minutos
3. Copie a URL gerada (exemplo: `https://clinica-alma-backend.onrender.com`)

---

## Passo 3: Deploy Frontend na Vercel

### 3.1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 3.2. Login na Vercel

```bash
vercel login
```

- Digite seu email
- Confirme no email que receber
- Volte ao terminal

### 3.3. Configurar Backend URL

Edite `C:\Clinicaalma\client\vite.config.js`:

```javascript
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({ /* ... */ })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://clinica-alma-backend.onrender.com', // ← MUDE AQUI
        changeOrigin: true
      },
      '/uploads': {
        target: 'https://clinica-alma-backend.onrender.com', // ← MUDE AQUI
        changeOrigin: true
      }
    }
  },
  // ADICIONE ISSO (para build de produção):
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://clinica-alma-backend.onrender.com')
  }
})
```

### 3.4. Atualizar Axios (client/src/views/NovaFicha.vue)

No início do arquivo, adicione:

```javascript
const API_URL = import.meta.env.VITE_API_URL || ''
```

E mude todas as chamadas axios de:
```javascript
axios.post('/api/...')
```

Para:
```javascript
axios.post(`${API_URL}/api/...`)
```

### 3.5. Build e Deploy

```bash
cd C:\Clinicaalma\client

# Build
npm run build

# Deploy
vercel --prod
```

**Perguntas que aparecerão:**

```
? Set up and deploy "C:\Clinicaalma\client"? [Y/n]
→ Digite: Y

? Which scope do you want to deploy to?
→ Selecione sua conta

? Link to existing project? [y/N]
→ Digite: N

? What's your project's name?
→ Digite: clinica-alma

? In which directory is your code located?
→ Deixe em branco (pressione Enter)

? Want to override the settings? [y/N]
→ Digite: N
```

### 3.6. Aguarde Deploy

- Vercel faz build e upload
- ~2-3 minutos
- URL final aparece no terminal

**Exemplo:**
```
✅ Production: https://clinica-alma.vercel.app
```

### 3.7. Configurar Variáveis de Ambiente na Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **"clinica-alma"**
3. Vá em **Settings** > **Environment Variables**
4. Adicione todas as variáveis do `.env`:

```
VITE_FIREBASE_API_KEY = sua-api-key
VITE_FIREBASE_AUTH_DOMAIN = seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET = seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = seu-sender-id
VITE_FIREBASE_APP_ID = seu-app-id
VITE_API_URL = https://clinica-alma-backend.onrender.com
```

5. Clique em **"Save"**
6. Vá em **"Deployments"**
7. Clique nos 3 pontinhos do último deploy > **"Redeploy"**

---

## Passo 4: Testar no Celular

### 4.1. Acessar URL

No celular, abra o navegador e acesse:
```
https://clinica-alma.vercel.app
```

### 4.2. Testar Câmera

1. Vá em **Nova Ficha**
2. Clique em **📷 Usar Câmera**
3. Permita acesso à câmera
4. Tire uma foto!

✅ **Funcionou?** Sucesso!
❌ **Erro de CORS?** Configure backend (próximo passo)

---

## Passo 5: Configurar CORS no Backend

Edite `C:\Clinicaalma\server\index.js`:

```javascript
const cors = require('cors')

// MUDE DE:
app.use(cors())

// PARA:
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://clinica-alma.vercel.app',  // ← Adicione sua URL
    'https://*.vercel.app'              // ← Permite subdominios
  ],
  credentials: true
}))
```

**Fazer commit e push** (se usar Git) ou:

1. No Render dashboard, vá em **"Manual Deploy"**
2. Clique em **"Deploy latest commit"**

---

## Passo 6: Instalar PWA no Celular

### Android (Chrome/Edge)

1. Acesse a URL no Chrome
2. Menu (⋮) > **"Adicionar à tela inicial"**
3. Confirme
4. Ícone aparece na home screen!

### iOS (Safari)

1. Acesse a URL no Safari
2. Botão **Compartilhar** (quadrado com seta)
3. Role para baixo > **"Adicionar à Tela de Início"**
4. Confirme

---

# OPÇÃO 2: Firebase Hosting (Alternativa)

## Vantagens:
- Integração nativa com Firebase
- Mesma conta/projeto
- HTTPS automático

---

## Passo 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

## Passo 2: Login

```bash
firebase login
```

- Abre o navegador
- Faça login com a mesma conta Google
- Autorize

## Passo 3: Inicializar Hosting

```bash
cd C:\Clinicaalma\client
firebase init hosting
```

**Perguntas:**

```
? Please select an option:
→ Use an existing project

? Select a default Firebase project:
→ Selecione: clinica-alma (o projeto que criou)

? What do you want to use as your public directory?
→ Digite: dist

? Configure as a single-page app (rewrite all urls to /index.html)?
→ Digite: Y

? Set up automatic builds and deploys with GitHub?
→ Digite: N
```

## Passo 4: Build

```bash
npm run build
```

## Passo 5: Deploy

```bash
firebase deploy --only hosting
```

**URL final:**
```
✔ Deploy complete!

Hosting URL: https://clinica-alma-xxxxx.web.app
```

## Passo 6: Acessar no Celular

Abra a URL `https://clinica-alma-xxxxx.web.app` no navegador do celular.

---

# OPÇÃO 3: Netlify (Alternativa)

## Passo 1: Build

```bash
cd C:\Clinicaalma\client
npm run build
```

## Passo 2: Deploy Manual

### 2.1. Criar Conta

1. Acesse: https://www.netlify.com/
2. **"Sign up"** com GitHub/Email

### 2.2. Drag & Drop

1. Após login, vá em **"Sites"**
2. Role até encontrar área de **"Drag and drop"**
3. Arraste a pasta `C:\Clinicaalma\client\dist` para lá
4. Aguarde upload
5. URL gerada automaticamente!

### 2.3. Configurar Variáveis

1. Clique no site criado
2. **Site settings** > **Environment variables**
3. Adicione todas as variáveis do `.env`

### 2.4. Redeploy

1. **Deploys** > **Trigger deploy** > **Deploy site**

---

# Comparação Final

## Vercel
- ✅ Mais rápido
- ✅ CLI simples
- ✅ Integração Git automática
- ⚠️ Backend separado (Render)

## Firebase Hosting
- ✅ Mesma conta Firebase
- ✅ Integração nativa
- ⚠️ Mais comandos
- ⚠️ Backend separado

## Netlify
- ✅ Drag & drop fácil
- ✅ Interface simples
- ⚠️ Backend separado

---

# Checklist Final

- [ ] Backend no Render/Railway
- [ ] Frontend na Vercel/Firebase/Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado no backend
- [ ] URL HTTPS funcionando
- [ ] Testado no celular
- [ ] Câmera funcionando
- [ ] PWA instalada no celular

---

# 🆘 Troubleshooting

## Erro: "Failed to load resource"

**Causa:** Backend não está rodando ou CORS bloqueado

**Solução:**
1. Verifique se backend está online (acesse URL do Render)
2. Configure CORS (Passo 5)

## Erro: "Camera permission denied"

**Causa:** Permissão não foi concedida

**Solução:**
1. Configurações do navegador > Permissões > Câmera
2. Permita para o site

## PWA não instala

**Causa:** Service Worker não registrado ou sem HTTPS

**Solução:**
1. Verifique se está em HTTPS
2. Abra DevTools > Application > Service Workers
3. Force atualização

---

# 🎉 Pronto!

Aplicação hospedada e acessível no celular!

**Próximos passos:**
1. Compartilhe a URL com sua equipe
2. Instale a PWA em todos os dispositivos
3. Configure autenticação (se necessário)
4. Adicione ícones customizados
