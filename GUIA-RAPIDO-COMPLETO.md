# Guia Rápido - Do Zero ao Celular em 30 Minutos

## 📋 Checklist Completo

### ETAPA 1: Configurar Firebase (15 min)

- [ ] **1.1** Criar conta Google (se não tiver)
  - Acesse: https://accounts.google.com/signup

- [ ] **1.2** Criar projeto Firebase
  - Acesse: https://console.firebase.google.com/
  - Clique em "Adicionar projeto"
  - Nome: `clinica-alma`
  - Desmarque Google Analytics
  - Clique em "Criar projeto"

- [ ] **1.3** Ativar Firestore Database
  - Menu lateral > Firestore Database
  - "Criar banco de dados"
  - Modo: **Teste** (mais fácil para começar)
  - Localização: `southamerica-east1`
  - "Ativar"

- [ ] **1.4** Ativar Firebase Storage
  - Menu lateral > Storage
  - "Começar"
  - Nas regras, mude para: `allow read, write: if true;`
  - "Avançar" > "Concluído"

- [ ] **1.5** Registrar app web
  - Ícone de engrenagem > Configurações do projeto
  - Role até "Seus aplicativos"
  - Clique no ícone `</>` (Web)
  - Apelido: `clinica-alma-web`
  - NÃO marque Hosting
  - "Registrar app"

- [ ] **1.6** Copiar credenciais
  ```javascript
  // Copie TODOS esses valores:
  apiKey: "AIzaSy..."
  authDomain: "clinica-alma-xxx.firebaseapp.com"
  projectId: "clinica-alma-xxx"
  storageBucket: "clinica-alma-xxx.appspot.com"
  messagingSenderId: "12345..."
  appId: "1:12345..."
  ```

- [ ] **1.7** Criar arquivo .env
  ```bash
  cd C:\Clinicaalma\client
  copy .env.example .env
  ```

- [ ] **1.8** Editar .env com suas credenciais
  ```env
  VITE_FIREBASE_API_KEY=cole-aqui
  VITE_FIREBASE_AUTH_DOMAIN=cole-aqui
  VITE_FIREBASE_PROJECT_ID=cole-aqui
  VITE_FIREBASE_STORAGE_BUCKET=cole-aqui
  VITE_FIREBASE_MESSAGING_SENDER_ID=cole-aqui
  VITE_FIREBASE_APP_ID=cole-aqui
  ```

- [ ] **1.9** Testar localmente
  ```bash
  # Terminal 1
  cd C:\Clinicaalma
  npm run server

  # Terminal 2
  cd C:\Clinicaalma\client
  npm run dev
  ```

- [ ] **1.10** Verificar console (F12)
  - Procure: `✅ Firebase offline persistence enabled`
  - ✅ Funcionou? Próxima etapa!
  - ❌ Erro? Verifique credenciais no .env

---

### ETAPA 2: Hospedar Aplicação (15 min)

#### Opção A: Vercel (RECOMENDADO)

- [ ] **2.1** Criar conta Vercel
  - Acesse: https://vercel.com/signup
  - Login com GitHub ou email

- [ ] **2.2** Instalar Vercel CLI
  ```bash
  npm install -g vercel
  ```

- [ ] **2.3** Login no CLI
  ```bash
  vercel login
  # Confirme no email
  ```

- [ ] **2.4** Deploy frontend
  ```bash
  cd C:\Clinicaalma\client
  npm run build
  vercel --prod
  ```

  Perguntas:
  - Deploy? **Y**
  - Projeto existente? **N**
  - Nome do projeto: `clinica-alma`
  - Diretório: *deixe em branco*
  - Override settings? **N**

- [ ] **2.5** Copiar URL gerada
  ```
  Exemplo: https://clinica-alma.vercel.app
  ```

- [ ] **2.6** Configurar variáveis na Vercel
  - Acesse: https://vercel.com/dashboard
  - Clique em "clinica-alma"
  - Settings > Environment Variables
  - Adicione TODAS as variáveis do .env
  - Save
  - Deployments > Redeploy

- [ ] **2.7** Hospedar backend no Render
  - Acesse: https://render.com/
  - Get Started > Login
  - New + > Web Service
  - "Deploy without Git"
  - Name: `clinica-alma-backend`
  - Environment: **Node**
  - Build Command: `npm install`
  - Start Command: `node server/index.js`
  - Create Web Service

- [ ] **2.8** Copiar URL do backend
  ```
  Exemplo: https://clinica-alma-backend.onrender.com
  ```

- [ ] **2.9** Configurar CORS no backend

  Edite `C:\Clinicaalma\server\index.js`:
  ```javascript
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'https://clinica-alma.vercel.app', // ← Sua URL
      'https://*.vercel.app'
    ],
    credentials: true
  }))
  ```

- [ ] **2.10** Fazer upload do backend
  - No Render, clique em "Manual Deploy"
  - Faça upload da pasta `C:\Clinicaalma\server`
  - Aguarde deploy

#### Opção B: Firebase Hosting (Alternativa)

- [ ] **2B.1** Instalar Firebase CLI
  ```bash
  npm install -g firebase-tools
  ```

- [ ] **2B.2** Login
  ```bash
  firebase login
  ```

- [ ] **2B.3** Inicializar hosting
  ```bash
  cd C:\Clinicaalma\client
  firebase init hosting
  ```
  - Projeto existente: **Y**
  - Selecione: `clinica-alma`
  - Public directory: `dist`
  - Single-page app: **Y**
  - GitHub deploys: **N**

- [ ] **2B.4** Deploy
  ```bash
  npm run build
  firebase deploy --only hosting
  ```

- [ ] **2B.5** Copiar URL
  ```
  Hosting URL: https://clinica-alma-xxx.web.app
  ```

---

### ETAPA 3: Testar no Celular (5 min)

- [ ] **3.1** Abrir URL no celular
  - Chrome/Safari: Acesse `https://clinica-alma.vercel.app`

- [ ] **3.2** Testar funcionalidades básicas
  - Navegação funciona?
  - Indicador online aparece (🟢)?

- [ ] **3.3** Testar câmera
  - Nova Ficha > 📷 Usar Câmera
  - Permitir acesso
  - Capturar foto
  - ✅ Funcionou? Perfeito!

- [ ] **3.4** Instalar PWA

  **Android (Chrome/Edge):**
  - Menu (⋮) > "Adicionar à tela inicial"
  - Confirmar

  **iOS (Safari):**
  - Botão Compartilhar
  - "Adicionar à Tela de Início"

- [ ] **3.5** Testar modo offline
  - Ative modo avião
  - Capture uma foto
  - Veja contador "X pendentes"
  - Desative modo avião
  - Sincronização automática!

---

## ⏱️ Tempo Total Estimado

- Firebase: 15 minutos
- Hospedagem: 15 minutos
- Teste no celular: 5 minutos

**Total: ~35 minutos**

---

## 🆘 Ajuda Rápida

### Erro mais comum: "Firebase not configured"

**Solução:**
1. Verifique se `.env` existe em `C:\Clinicaalma\client\.env`
2. Confirme se todas as variáveis estão preenchidas
3. Reinicie o servidor (Ctrl+C e `npm run dev`)

### Câmera não funciona

**Causa:** Sem HTTPS

**Solução:** Use Vercel/Firebase Hosting (têm HTTPS automático)

### Backend não conecta

**Causa:** CORS bloqueado

**Solução:** Configure CORS no `server/index.js` (Etapa 2.9)

---

## 📚 Documentação Completa

- **Firebase detalhado:** `TUTORIAL-FIREBASE.md`
- **Hospedagem completa:** `TUTORIAL-HOSPEDAGEM.md`
- **Arquitetura PWA:** `README-PWA.md`

---

## 🎯 Resultado Final

Após completar este guia, você terá:

✅ Aplicação PWA instalável no celular
✅ Captura de documentos via câmera
✅ Modo offline com sincronização automática
✅ URL compartilhável (https://...)
✅ Armazenamento em nuvem (Firebase)

---

## 🚀 Próximos Passos (Opcional)

1. **Adicionar ícones customizados**
   - Veja: `client/public/README-ICONS.md`

2. **Configurar autenticação**
   - Firebase Auth para segurança

3. **Melhorar regras de segurança**
   - Mude `allow read, write: if true` para autenticação

4. **Adicionar notificações push**
   - Firebase Cloud Messaging

5. **Analytics**
   - Rastrear uso da aplicação

---

## ✅ Verificação Final

Teste todas as funcionalidades no celular:

- [ ] App abre normalmente
- [ ] Nova ficha carrega
- [ ] Câmera abre e captura
- [ ] Upload de arquivo funciona
- [ ] OCR processa imagem
- [ ] Formulário salva dados
- [ ] Modo offline funciona
- [ ] Sincronização funciona
- [ ] PWA pode ser instalada

**Tudo funcionando? 🎉 Parabéns!**

---

## 📞 Suporte

Encontrou problemas? Verifique:

1. **Console do navegador (F12)** - Mensagens de erro
2. **Network tab** - Requisições falhando?
3. **Application tab** - Service Worker registrado?
4. **Firebase Console** - Firestore/Storage estão ativos?

---

**Data de criação:** 2025-11-01
**Versão:** 1.0
**Status:** Produção
