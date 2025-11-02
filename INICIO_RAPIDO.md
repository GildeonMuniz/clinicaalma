# Início Rápido - Clínica Alma 🚀

## 5 Minutos para Começar!

### 1️⃣ Configurar API do ChatGPT (Opcional, mas recomendado)

```bash
# Obter chave em: https://platform.openai.com/api-keys
# Editar arquivo .env e adicionar:
OPENAI_API_KEY=sk-sua-chave-aqui
```

**Pular esta etapa?** Sem problemas! Você pode usar OCR grátis ou entrada manual.

### 2️⃣ Iniciar o Sistema

```bash
# Reiniciar servidor (se já estiver rodando, Ctrl+C primeiro)
npm run server
```

### 3️⃣ Acessar

```
http://localhost:3001
```

### 4️⃣ Cadastrar Primeira Ficha

1. Clique em **"Nova Ficha"**
2. **Upload** das fichas (frente e costa)
3. Escolha uma opção:
   - 🤖 **ChatGPT** (melhor precisão, requer API Key)
   - **Tesseract** (grátis, texto impresso)
   - **Manual** (preencher à mão)
4. **Revise** os dados
5. **Salve!** ✅

---

## Fluxo Completo

```
📋 Recepção
    ↓
📄 Escanear Fichas (frente + costa)
    ↓
💻 Upload no Sistema
    ↓
🤖 Processar com IA (ou Manual)
    ↓
✅ Revisar e Salvar
    ↓
👥 Consultar Histórico do Paciente
```

---

## Comandos Úteis

```bash
# Iniciar servidor backend
npm run server

# Iniciar frontend (modo desenvolvimento)
cd client && npm run dev

# Compilar frontend para produção
npm run build

# Inicializar banco de dados
npm run db:init

# Iniciar tudo junto (dev)
npm run dev
```

---

## Estrutura Rápida

```
C:\Clinicaalma\
├── client/          # Frontend Vue.js
├── server/          # Backend Node.js
├── database/        # Banco SQLite
├── uploads/         # Fichas enviadas
└── documentos/      # Exemplos de fichas
```

---

## URLs Importantes

| Serviço | URL |
|---------|-----|
| **Sistema** | http://localhost:3001 |
| **API** | http://localhost:3001/api |
| **Pacientes** | http://localhost:3001/api/pacientes |
| **Fichas** | http://localhost:3001/api/fichas |

---

## Atalhos do Sistema

| Página | O que faz |
|--------|-----------|
| **/ (Home)** | Dashboard com estatísticas |
| **/pacientes** | Lista todos os pacientes |
| **/nova-ficha** | Cadastrar nova ficha |
| **/paciente/:id** | Ver detalhes do paciente |

---

## Primeiro Teste

Use as fichas de exemplo em `C:\Clinicaalma\documentos\`:
- **FichaFrente.jpeg** - Dados do paciente
- **FichaCosta.jpeg** - Receitas e tratamentos

---

## Precisa de Ajuda?

📖 **Documentação Completa:**
- [README.md](README.md) - Visão geral
- [INSTALACAO.md](INSTALACAO.md) - Instalação detalhada
- [CHATGPT_SETUP.md](CHATGPT_SETUP.md) - Configurar IA
- [GUIA_USO.md](GUIA_USO.md) - Como usar
- [CHANGELOG.md](CHANGELOG.md) - Novidades

---

## Dicas para Começar

### ✅ Faça
- Configure a API do ChatGPT para melhor precisão
- Sempre revise os dados antes de salvar
- Faça backup do banco regularmente
- Teste com as fichas de exemplo primeiro

### ❌ Evite
- Não feche o navegador durante upload
- Não salve sem revisar os dados do OCR
- Não compartilhe sua API Key
- Não esqueça de fazer backup

---

## Status do Sistema

Verifique se está tudo funcionando:

```bash
# O servidor deve mostrar:
🚀 Servidor Backend rodando na porta 3001
📁 Uploads: C:\Clinicaalma\uploads
🌐 API: http://localhost:3001/api
✅ Frontend disponível em: http://localhost:3001
```

---

## Problemas Comuns

### ❌ Porta 3001 em uso
```bash
# Mudar porta no .env
PORT=3002
```

### ❌ ChatGPT não funciona
- Verifique se configurou OPENAI_API_KEY no `.env`
- Use Tesseract ou Manual como alternativa

### ❌ Banco de dados vazio
```bash
npm run db:init
```

---

## Próximos Passos

Depois de dominar o básico:

1. ✅ Configure backup automático
2. ✅ Personalize os tipos de tratamento
3. ✅ Treine a equipe no sistema
4. ✅ Migre fichas antigas gradualmente
5. ✅ Configure relatórios personalizados

---

**Pronto para começar! 🎉**

Se tiver dúvidas, consulte a documentação completa ou a comunidade.

**Boa sorte com sua clínica!** 🏥✨
