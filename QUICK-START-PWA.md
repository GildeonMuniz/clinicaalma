# Quick Start - PWA com Câmera e Offline

## O que foi implementado?

1. **Captura de documentos via câmera** - Botões "📷 Usar Câmera" em NovaFicha
2. **PWA instalável** - App funciona como aplicativo nativo
3. **Modo offline** - Dados salvos localmente, sincronização automática
4. **Firebase** - Armazenamento em nuvem quando offline

---

## Setup Rápido (5 minutos)

### 1. Configurar Firebase (OBRIGATÓRIO)

```bash
# 1. Acesse: https://console.firebase.google.com/
# 2. Crie projeto "clinica-alma"
# 3. Ative: Firestore Database + Storage
# 4. Copie credenciais em Project Settings > Web App

# 5. Configure variáveis de ambiente
cd client
cp .env.example .env
# Edite .env com suas credenciais Firebase
```

### 2. Iniciar Aplicação

```bash
# Terminal 1 - Backend
cd C:\Clinicaalma
npm run server

# Terminal 2 - Frontend
cd C:\Clinicaalma\client
npm run dev
```

Acesse: `http://localhost:5173`

---

## Como Usar a Câmera

1. Vá em **Nova Ficha**
2. Clique em **📷 Usar Câmera** (frente ou costa)
3. Permita acesso à câmera
4. Posicione documento e clique **Capturar**
5. Confirme ou tire outra foto

**IMPORTANTE:** Em celulares, só funciona com **HTTPS**. Para testar:
- Use ngrok: `ngrok http 5173`
- Acesse URL https://... gerada

---

## Testar Offline

1. Abra DevTools > Network
2. Marque "Offline"
3. Capture documentos normalmente
4. Desmarque "Offline" - sincronização automática!

Status no canto superior direito:
- 🟢 Online
- 🔴 Offline
- 🔄 Sincronizando

---

## Arquivos Importantes

```
client/
├── .env.example           # Template - COPIE para .env
├── vite.config.js         # Config PWA
├── src/
│   ├── components/
│   │   ├── CameraCapture.vue    # Modal da câmera
│   │   └── SyncStatus.vue       # Indicador online/offline
│   ├── services/
│   │   ├── camera.js            # API de câmera
│   │   ├── firebase.js          # Configuração Firebase
│   │   └── sync-service.js      # Sincronização
│   └── views/
│       └── NovaFicha.vue        # Atualizado com câmera
```

---

## Problemas Comuns

### "Firebase not configured"
→ Crie arquivo `.env` com credenciais (veja passo 1)

### Câmera não funciona no celular
→ Use HTTPS (ngrok ou deploy em produção)

### "Permission denied"
→ Permita câmera nas configurações do navegador

---

## Documentação Completa

Leia: `README-PWA.md` (raiz do projeto)

Inclui:
- Setup Firebase detalhado
- Deployment em produção
- Troubleshooting completo
- APIs e arquitetura

---

## Próximos Passos

1. Configure Firebase (5 min)
2. Teste câmera local
3. Teste modo offline
4. [Opcional] Adicione ícones PWA em `client/public/`
5. [Opcional] Deploy em produção (Vercel/Firebase)

---

**Dúvidas?** Veja `README-PWA.md` ou documentação Firebase.
