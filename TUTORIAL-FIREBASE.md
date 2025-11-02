# Tutorial Completo - Configuração Firebase

## Passo 1: Criar Conta Google (se não tiver)

1. Acesse: https://accounts.google.com/signup
2. Crie uma conta Gmail (gratuita)
3. Confirme o email

---

## Passo 2: Acessar Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Clique em **"Adicionar projeto"** ou **"Create a project"**

---

## Passo 3: Criar Projeto Firebase

### 3.1. Nome do Projeto

```
Nome: clinica-alma
(pode usar qualquer nome, mas recomendo esse)
```

Clique em **"Continuar"**

### 3.2. Google Analytics (Opcional)

- Desmarque "Ativar Google Analytics" (não é necessário)
- Ou deixe marcado se quiser estatísticas (recomendo desmarcar)

Clique em **"Criar projeto"**

### 3.3. Aguarde

- Espere ~30 segundos enquanto o projeto é criado
- Clique em **"Continuar"** quando aparecer

---

## Passo 4: Ativar Firestore Database

### 4.1. Acessar Firestore

No menu lateral esquerdo:
1. Clique em **"Criar"** (ou "Build")
2. Clique em **"Firestore Database"**

### 4.2. Criar Banco de Dados

1. Clique em **"Criar banco de dados"** (ou "Create database")

### 4.3. Escolher Modo

Duas opções aparecem:

**Modo de produção:**
- Mais seguro
- Requer regras de segurança
- **Escolha este** se for usar em produção

**Modo de teste:**
- Acesso público por 30 dias
- Mais fácil para desenvolvimento
- **Escolha este** para começar rápido

✅ **RECOMENDAÇÃO:** Escolha **Modo de teste** para começar

Clique em **"Avançar"** (ou "Next")

### 4.4. Escolher Localização

Selecione:
```
southamerica-east1 (São Paulo)
```

Essa é a localização mais próxima do Brasil = mais rápido

Clique em **"Ativar"** (ou "Enable")

### 4.5. Aguarde

- Espere ~30 segundos
- Firestore está pronto quando aparecer a tela de coleções

---

## Passo 5: Ativar Firebase Storage (OPCIONAL)

⚠️ **ATENÇÃO:** Storage requer upgrade para plano Blaze (pagar conforme uso)

### Você tem 2 opções:

#### Opção A: PULAR Storage (RECOMENDADO - 100% Grátis)
- ✅ **Não precisa de cartão**
- ✅ **100% gratuito garantido**
- ✅ Imagens armazenadas no Firestore (Base64)
- ✅ Funciona perfeitamente
- ➡️ **PULE para o Passo 6** e use `firebase-firestore-only.js`

#### Opção B: Ativar Storage (Requer Cartão)
- ⚠️ Requer upgrade para plano Blaze
- ⚠️ Precisa adicionar cartão de crédito
- ✅ Grátis até 5GB storage + 1GB/dia transferência
- ✅ Melhor performance para imagens
- ➡️ Continue abaixo

---

### 5.1. Acessar Storage (SOMENTE se escolheu Opção B)

No menu lateral esquerdo:
1. Clique em **"Criar"** (ou "Build")
2. Clique em **"Storage"**

### 5.2. Upgrade para Plano Blaze

Vai aparecer uma mensagem:

```
⚠️ Para usar Storage, faça upgrade do plano de faturamento
```

1. Clique em **"Upgrade"** ou **"Modificar plano"**
2. Selecione **"Blaze (Pagar conforme o uso)"**
3. Clique em **"Continuar"**
4. Adicione seu **cartão de crédito**
5. Configure **orçamento mensal** (recomendo R$ 5,00)
6. Clique em **"Comprar"**

### 5.3. Começar Storage (após upgrade)

1. Volte para **Storage**
2. Clique em **"Começar"** (ou "Get started")

### 5.3. Regras de Segurança

Aparece uma tela com regras padrão:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Para **desenvolvimento**, vamos permitir acesso público temporariamente:

**MUDE PARA:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **ATENÇÃO:** Isso permite qualquer pessoa fazer upload! Use apenas para testes.

Clique em **"Avançar"** (ou "Next")

### 5.4. Localização

- Usa a mesma localização do Firestore (southamerica-east1)
- Clique em **"Concluído"** (ou "Done")

### 5.5. Aguarde

- Espere ~30 segundos
- Storage está pronto!

---

## Passo 6: Obter Credenciais do Projeto

### 6.1. Adicionar App Web

1. Na página inicial do projeto, procure **"Seus aplicativos"**
2. Clique no ícone **Web** `</>`
3. Ou vá em **Configurações do Projeto** (ícone de engrenagem) > Role até **"Seus aplicativos"**

### 6.2. Registrar App

1. **Apelido do app:** `clinica-alma-web`
2. **Hosting:** NÃO marque (vamos configurar depois)
3. Clique em **"Registrar app"**

### 6.3. Copiar Credenciais

Aparece um código JavaScript assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "clinica-alma-xxxxx.firebaseapp.com",
  projectId: "clinica-alma-xxxxx",
  storageBucket: "clinica-alma-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

📋 **COPIE TODAS ESSAS INFORMAÇÕES!** Vamos usar no próximo passo.

Clique em **"Continuar no console"**

---

## Passo 7: Configurar Projeto Local

### 7.1. Escolher Versão do Firebase

Dependendo se você ativou Storage ou não:

**Se PULOU o Storage (Opção A - Recomendado):**
```bash
cd C:\Clinicaalma\client\src\services
# Renomear arquivo
ren firebase.js firebase-with-storage.js.bak
ren firebase-firestore-only.js firebase.js
```

**Se ATIVOU o Storage (Opção B):**
```bash
# Manter firebase.js original
# Nada a fazer aqui
```

### 7.2. Abrir Terminal no Projeto

```bash
cd C:\Clinicaalma\client
```

### 7.3. Criar Arquivo .env

```bash
# Copiar o template
copy .env.example .env
```

Ou crie manualmente:
- Abra a pasta `C:\Clinicaalma\client\`
- Crie um arquivo chamado `.env` (sem extensão .txt)

### 7.3. Editar .env

Abra o arquivo `.env` e preencha com suas credenciais:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=clinica-alma-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=clinica-alma-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=clinica-alma-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**IMPORTANTE:**
- Substitua os valores `xxxxx` pelos valores reais que você copiou
- NÃO coloque aspas
- NÃO adicione espaços antes ou depois do `=`

### 7.4. Salvar Arquivo

Salve e feche o arquivo.

---

## Passo 8: Testar Configuração

### 8.1. Iniciar Aplicação

```bash
# Terminal 1 - Backend
cd C:\Clinicaalma
npm run server

# Terminal 2 - Frontend
cd C:\Clinicaalma\client
npm run dev
```

### 8.2. Abrir no Navegador

Acesse: `http://localhost:5173`

### 8.3. Abrir Console do Navegador

1. Pressione `F12` (Chrome/Edge)
2. Vá na aba **"Console"**

### 8.4. Verificar Mensagem

Procure por:
```
✅ Firebase offline persistence enabled
```

✅ **Se aparecer:** Firebase configurado com sucesso!
❌ **Se aparecer erro:** Verifique as credenciais no `.env`

---

## Passo 9: Configurar Regras (Opcional - Recomendado)

### 9.1. Regras do Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **"Regras"**
3. Cole o código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos (DESENVOLVIMENTO)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Clique em **"Publicar"**

⚠️ **Para produção**, mude para autenticação:
```javascript
allow read, write: if request.auth != null;
```

### 9.2. Regras do Storage

1. No Firebase Console, vá em **Storage**
2. Clique na aba **"Regras"**
3. Cole o código:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir upload e download para todos (DESENVOLVIMENTO)
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

4. Clique em **"Publicar"**

---

## ✅ Checklist de Configuração

- [ ] Conta Google criada
- [ ] Projeto Firebase criado
- [ ] Firestore Database ativado
- [ ] Firebase Storage ativado
- [ ] App Web registrado
- [ ] Credenciais copiadas
- [ ] Arquivo `.env` criado
- [ ] Credenciais coladas no `.env`
- [ ] Aplicação testada localmente
- [ ] Console mostra "Firebase enabled"
- [ ] Regras configuradas

---

## 🆘 Problemas Comuns

### Erro: "Firebase not configured"

**Causa:** Arquivo `.env` não foi criado ou está errado

**Solução:**
1. Verifique se o arquivo `.env` existe em `C:\Clinicaalma\client\.env`
2. Abra o arquivo e confirme as credenciais
3. Reinicie o servidor (`Ctrl+C` e `npm run dev` novamente)

### Erro: "Permission denied"

**Causa:** Regras do Firestore/Storage muito restritivas

**Solução:**
1. Vá em Firestore > Regras
2. Mude para `allow read, write: if true;`
3. Publique as regras

### Erro: "Request failed with status code 403"

**Causa:** API Key inválida ou projeto não ativado

**Solução:**
1. Verifique se copiou a API Key completa
2. Confirme que Firestore e Storage estão ativos
3. Aguarde 5 minutos (propagação de configurações)

---

## 🎉 Pronto!

Firebase configurado com sucesso! Agora vamos para a hospedagem.
