# Clínica Alma - PWA com Captura de Câmera e Sincronização Offline

## Funcionalidades Implementadas

### 1. Progressive Web App (PWA)
- Instalável em dispositivos móveis e desktop
- Funciona offline
- Service Worker para cache inteligente
- Manifest configurado para app standalone

### 2. Captura de Câmera
- Captura de documentos usando câmera do dispositivo
- Suporte para câmera frontal e traseira
- Preview em tempo real
- Captura otimizada para OCR
- Funciona em dispositivos móveis e desktop

### 3. Sincronização Offline com Firebase
- Dados salvos localmente quando offline
- Sincronização automática quando voltar online
- Fila de sincronização gerenciável
- Indicador visual de status (online/offline)
- Firebase Firestore para dados
- Firebase Storage para imagens

---

## Configuração Inicial

### Passo 1: Instalar Dependências

Já instaladas automaticamente. Caso precise reinstalar:

```bash
cd client
npm install
```

Dependências adicionadas:
- `vite-plugin-pwa` - Plugin PWA para Vite
- `workbox-window` - Service Worker
- `firebase` - SDK do Firebase
- `localforage` - Armazenamento local offline

### Passo 2: Configurar Firebase

#### 2.1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome: `clinica-alma` (ou o que preferir)
4. Siga os passos de criação

#### 2.2. Ativar Firestore Database

1. No menu lateral, vá em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Modo: **Produção** (ou Teste para desenvolvimento)
4. Localização: `southamerica-east1` (São Paulo)

#### 2.3. Ativar Firebase Storage

1. No menu lateral, vá em **Storage**
2. Clique em "Começar"
3. Aceite as regras padrão

#### 2.4. Configurar Regras de Segurança

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita autenticado ou em desenvolvimento
    match /{document=**} {
      allow read, write: if true; // Para desenvolvimento
      // Em produção, adicione autenticação adequada
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Para desenvolvimento
      // Em produção, adicione autenticação adequada
    }
  }
}
```

#### 2.5. Obter Credenciais

1. Vá em **Configurações do Projeto** (ícone de engrenagem)
2. Role até "Seus aplicativos"
3. Clique em "Adicionar app" > Web (ícone `</>`)
4. Registre o app
5. Copie as credenciais exibidas

#### 2.6. Configurar Variáveis de Ambiente

1. Na pasta `client/`, copie o arquivo `.env.example`:
```bash
cd client
cp .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:
```env
VITE_FIREBASE_API_KEY=sua-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

---

## Como Usar

### 1. Iniciar Aplicação

```bash
# Terminal 1 - Backend
cd C:\Clinicaalma
npm run server

# Terminal 2 - Frontend
cd C:\Clinicaalma\client
npm run dev
```

Acesse: `http://localhost:5173`

### 2. Capturar Documentos com Câmera

1. Vá em **Nova Ficha**
2. Clique no botão **📷 Usar Câmera** (frente ou costa)
3. Permita o acesso à câmera quando solicitado
4. Posicione o documento dentro da área demarcada
5. Clique em **Capturar**
6. Revise a imagem
7. Clique em **Confirmar** ou **Tirar Outra**

**Atalhos:**
- Botão **🔄 Trocar Câmera**: Alterna entre câmera frontal e traseira
- Botão **Cancelar**: Fecha sem capturar

### 3. Trabalhar Offline

#### Modo Offline Automático

Quando perder conexão:
- Indicador muda para 🔴 **Offline**
- Dados são salvos localmente
- Imagens capturadas ficam em fila
- Interface continua funcionando normalmente

#### Sincronização

Quando voltar online:
- Indicador muda para 🟢 **Online**
- Sincronização automática inicia
- Progresso visível no indicador
- Notificações de sucesso/erro

#### Sincronização Manual

Clique no botão 🔄 no indicador de sincronização para forçar.

### 4. Verificar Status de Sincronização

No canto superior direito:
- 🟢 **Online** - Conectado
- 🔴 **Offline** - Sem conexão
- 🔄 **Sincronizando...** - Em progresso
- **X pendentes** - Itens aguardando sincronização

---

## Estrutura de Arquivos Criados

```
client/
├── src/
│   ├── components/
│   │   ├── CameraCapture.vue      # Componente de captura de câmera
│   │   └── SyncStatus.vue         # Indicador de sincronização
│   ├── services/
│   │   ├── camera.js              # Serviço de câmera
│   │   ├── firebase.js            # Configuração Firebase
│   │   └── sync-service.js        # Sincronização offline
│   ├── views/
│   │   └── NovaFicha.vue          # Atualizado com câmera
│   └── App.vue                    # Atualizado com SyncStatus
├── vite.config.js                 # Configuração PWA
├── .env.example                   # Template de configuração
├── .env                           # Suas credenciais (criar)
└── .gitignore                     # Ignora .env
```

---

## Funcionalidades Detalhadas

### Camera Service (`camera.js`)

**Métodos principais:**
- `isAvailable()` - Verifica suporte à câmera
- `startCamera(videoElement, facingMode)` - Inicia câmera
- `capturePhoto(videoElement, canvas)` - Captura foto
- `switchCamera()` - Alterna câmera frontal/traseira
- `stopCamera()` - Para câmera

**Parâmetros de captura:**
- Resolução: até 1920x1080
- Formato: JPEG
- Qualidade: 92%
- Otimização para OCR

### Firebase Service (`firebase.js`)

**Métodos principais:**
- `savePaciente(data)` - Salva paciente no Firestore
- `saveFicha(data)` - Salva ficha no Firestore
- `uploadImage(file, path)` - Upload para Storage
- `addToSyncQueue(action, data)` - Adiciona à fila

**Collections:**
- `pacientes` - Dados de pacientes
- `fichas_atendimento` - Fichas cadastradas
- `sync_queue` - Fila de sincronização

### Sync Service (`sync-service.js`)

**Métodos principais:**
- `addToSyncQueue(action, data)` - Adiciona item
- `syncAll()` - Sincroniza todos pendentes
- `getPendingSyncItems()` - Lista pendentes
- `getSyncQueueCount()` - Conta pendentes
- `retryFailedItems()` - Reprocessa erros

**Eventos:**
- `online` - Conexão restaurada
- `offline` - Conexão perdida
- `sync_start` - Sincronização iniciada
- `sync_complete` - Sincronização concluída
- `sync_error` - Erro na sincronização
- `queue_add` - Item adicionado à fila

---

## Testando PWA

### 1. Testar em Desktop (Chrome/Edge)

1. Abra `http://localhost:5173`
2. Clique no ícone de instalação na barra de endereço (ou menu > Instalar)
3. App será instalado como aplicativo standalone

### 2. Testar em Dispositivo Móvel

#### Opção A: Via Rede Local

1. No PC, descubra seu IP:
```bash
ipconfig
# Procure por "Endereço IPv4": ex: 192.168.1.100
```

2. No celular, acesse:
```
http://192.168.1.100:5173
```

3. No navegador mobile, abra o menu > "Adicionar à tela inicial"

#### Opção B: Via HTTPS (Necessário para câmera)

Para usar câmera em dispositivos móveis, **HTTPS é obrigatório**.

**Solução rápida com ngrok:**

1. Instale [ngrok](https://ngrok.com/download)
2. Execute:
```bash
ngrok http 5173
```
3. Acesse a URL HTTPS gerada no celular

### 3. Testar Modo Offline

1. Abra a aplicação
2. Abra DevTools > Network
3. Marque "Offline"
4. Tente usar a aplicação normalmente
5. Desmarque "Offline" para sincronizar

---

## Deployment em Produção

### 1. Build da Aplicação

```bash
cd client
npm run build
```

Arquivos gerados em `client/dist/`

### 2. Hospedagem Recomendada

**Opções:**
- **Vercel** - Melhor para PWAs, HTTPS automático
- **Netlify** - Simples, HTTPS automático
- **Firebase Hosting** - Integração nativa
- **Servidor próprio** - Nginx com SSL

### 3. Deploy no Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar hosting
firebase init hosting

# Configurar:
# - Public directory: client/dist
# - Single-page app: Yes
# - GitHub deploys: No (ou Yes se preferir)

# Deploy
firebase deploy --only hosting
```

### 4. Configurar HTTPS (Servidor Próprio)

Câmera **REQUER** HTTPS em produção.

**Com Certbot (Let's Encrypt):**
```bash
sudo certbot --nginx -d seudominio.com
```

---

## Troubleshooting

### Erro: "Camera not available"

**Possíveis causas:**
- Sem HTTPS (mobile requer HTTPS)
- Permissão negada
- Câmera em uso por outro app

**Soluções:**
1. Use HTTPS (ngrok para testes)
2. Verifique permissões do navegador
3. Feche outros apps usando câmera

### Erro: "Firebase not configured"

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Verifique se `.env` existe
2. Confirme credenciais corretas
3. Reinicie servidor de desenvolvimento

### Erro: "Failed to sync"

**Possíveis causas:**
- Backend offline
- CORS bloqueado
- Erro nas credenciais

**Soluções:**
1. Verifique se backend está rodando
2. Confirme configurações CORS no servidor
3. Revise regras do Firestore/Storage

### PWA não instala

**Possíveis causas:**
- Sem HTTPS
- Manifest inválido
- Service Worker não registrado

**Soluções:**
1. Use HTTPS ou localhost
2. Abra DevTools > Application > Manifest (verificar erros)
3. Verifique Service Worker em Application > Service Workers

---

## Próximos Passos (Opcional)

### 1. Adicionar Autenticação

Firebase Auth para segurança:
```bash
cd client
npm install firebase/auth
```

### 2. Adicionar Notificações Push

Para notificar usuários de novas fichas:
```bash
npm install firebase/messaging
```

### 3. Analytics

Rastrear uso da aplicação:
```bash
npm install firebase/analytics
```

### 4. Melhorias de OCR

- Pré-processamento de imagem com IA
- Detecção automática de bordas
- Correção de perspectiva

---

## Suporte e Documentação

### Documentação Oficial

- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Camera API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

### Arquivos Importantes

- `vite.config.js` - Configuração PWA
- `client/src/services/firebase.js` - Firebase setup
- `client/src/services/camera.js` - Camera API
- `client/src/services/sync-service.js` - Sincronização

---

## Checklist de Implementação

- [x] Instalar dependências PWA
- [x] Configurar Vite para PWA
- [x] Criar serviço de câmera
- [x] Implementar componente CameraCapture
- [x] Integrar câmera no NovaFicha
- [x] Configurar Firebase
- [x] Criar serviço de sincronização
- [x] Adicionar indicador de status
- [x] Configurar offline persistence
- [x] Documentar setup e uso

---

## Licença

MIT - Clínica Alma 2025
