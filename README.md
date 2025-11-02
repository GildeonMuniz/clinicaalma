# 🏥 Clínica Alma - Sistema de Gestão

Sistema de gestão para clínica de terapias espirituais com OCR inteligente para processamento de fichas de atendimento.

---

## 🏗️ Arquitetura

### Frontend
- **Framework**: Vue.js 3 + Vite
- **Hospedagem**: Firebase Hosting
- **PWA**: Suporte offline completo
- **Localização**: `./client/`

### Backend
- **Framework**: ASP.NET Core 8.0 Web API
- **Banco de Dados**: SQL Server
- **OCR**: GPT-4 Vision (OpenAI)
- **Hospedagem**: https://api.muniz.vps-kinghost.net

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# 1. Clonar o repositório
git clone <repository-url>
cd Clinicaalma

# 2. Instalar dependências do frontend
cd client
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
Clinicaalma/
├── client/                     # Frontend Vue.js
│   ├── src/
│   │   ├── views/             # Páginas da aplicação
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── services/          # Serviços (API, Firebase, Sync)
│   │   └── main.js            # Entry point
│   ├── public/                # Assets estáticos
│   ├── .env                   # Variáveis de ambiente
│   └── package.json
│
├── server-backup-nodejs/      # Backend Node.js (DEPRECATED)
├── database-backup-nodejs/    # SQLite (DEPRECATED)
├── uploads-backup-nodejs/     # Uploads antigos (DEPRECATED)
│
├── MIGRACAO-API-DOTNET.md    # Documentação da migração
├── PROMPTS-OCR-PARA-BACKEND-DOTNET.md  # Prompts do OCR
├── README-MIGRACAO-COMPLETA.md         # Guia completo
└── package.json               # Scripts do projeto
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie o arquivo `client/.env`:

```env
# API .NET 8
VITE_API_BASE_URL=https://api.muniz.vps-kinghost.net

# Firebase (opcional - para offline sync)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## 🎯 Funcionalidades

### ✅ Gestão de Pacientes
- Cadastro completo de pacientes
- Busca por nome ou código
- Histórico de atendimentos
- Visualização de fichas

### ✅ Fichas de Atendimento
- Upload de fichas escaneadas (frente e costa)
- OCR inteligente com GPT-4 Vision
- Preenchimento automático de formulários
- Edição manual quando necessário

### ✅ OCR (Reconhecimento de Texto)
- **Método 1**: GPT-4 Vision (recomendado)
  - Alta precisão
  - Reconhece caligrafia
  - Extrai dados estruturados

- **Método 2**: Tesseract OCR
  - Gratuito
  - Boa precisão em textos impressos

### ✅ Modo Offline
- Trabalhe sem internet
- Dados salvos localmente
- Sincronização automática ao reconectar

### ✅ PWA (Progressive Web App)
- Instalável no dispositivo
- Funciona offline
- Ícone na tela inicial

---

## 📚 Documentação

### Guias Principais
- **[README-MIGRACAO-COMPLETA.md](README-MIGRACAO-COMPLETA.md)** - Guia completo da migração para .NET
- **[MIGRACAO-API-DOTNET.md](MIGRACAO-API-DOTNET.md)** - Detalhes técnicos da migração
- **[PROMPTS-OCR-PARA-BACKEND-DOTNET.md](PROMPTS-OCR-PARA-BACKEND-DOTNET.md)** - Prompts e implementação do OCR
- **[NOTA-OCR-API-DOTNET.md](NOTA-OCR-API-DOTNET.md)** - Notas sobre funcionalidade OCR

### Guias de Desenvolvimento
- **[TREINAR_CHATGPT.md](TREINAR_CHATGPT.md)** - Como treinar o OCR do ChatGPT
- **[PROMPT-BACKEND-CSHARP.md](PROMPT-BACKEND-CSHARP.md)** - Documentação completa da API .NET

---

## 🔧 Scripts Disponíveis

### Frontend (raiz do projeto)

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (localhost:5173)

# Build
npm run build        # Build de produção (./client/dist)

# Preview
npm run preview      # Preview do build de produção
```

### Frontend (dentro de ./client)

```bash
cd client

# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

---

## 🌐 API Endpoints

Base URL: `https://api.muniz.vps-kinghost.net`

### Pacientes
```
GET    /api/pacientes              # Listar todos
GET    /api/pacientes/{id}         # Buscar por ID
GET    /api/pacientes/codigo/{cod} # Buscar por código
GET    /api/pacientes/{id}/fichas  # Fichas do paciente
POST   /api/pacientes              # Criar
PUT    /api/pacientes/{id}         # Atualizar
DELETE /api/pacientes/{id}         # Deletar
```

### Fichas de Atendimento
```
GET    /api/fichas                 # Listar todas
GET    /api/fichas/{id}            # Buscar por ID
POST   /api/fichas                 # Criar
PUT    /api/fichas/{id}            # Atualizar
DELETE /api/fichas/{id}            # Deletar
```

### OCR
```
POST   /api/ocr/ficha-frente       # Processar frente
POST   /api/ocr/ficha-costa        # Processar costa
POST   /api/ocr/ficha-completa     # Processar completa (recomendado)
```

### Health Check
```
GET    /health                     # Status da API
```

---

## 🧪 Testando a Aplicação

### 1. Testar API
```bash
curl https://api.muniz.vps-kinghost.net/health
```

### 2. Testar Frontend Local
```bash
npm run dev
# Abra: http://localhost:5173
```

### 3. Testar OCR
1. Acesse a aplicação
2. Vá em "Nova Ficha de Atendimento"
3. Faça upload de duas imagens (frente e costa)
4. Clique em "🤖 Processar com ChatGPT"
5. Aguarde até 4 minutos
6. Verifique se os campos foram preenchidos

---

## 🐛 Troubleshooting

### Erro: "Connection Refused"
**Causa**: API não está acessível
**Solução**: Verifique se a URL da API está correta no `.env`

### Erro: "Timeout"
**Causa**: OCR está demorando mais que 4 minutos
**Solução**:
- Reduza o tamanho das imagens
- Verifique se a API está respondendo
- Tente novamente mais tarde

### Formulário não preenche automaticamente
**Causa**: Estrutura de dados da API diferente
**Solução**: Verifique o console (F12) para ver os dados retornados

### Firebase não funciona
**Causa**: Credenciais não configuradas
**Solução**: Configure as variáveis `VITE_FIREBASE_*` no `.env`

---

## 📦 Deploy

### Frontend (Firebase Hosting)

```bash
# 1. Build de produção
cd client
npm run build

# 2. Deploy
firebase deploy --only hosting
```

### Backend (.NET)
Consulte: [PROMPT-BACKEND-CSHARP.md](PROMPT-BACKEND-CSHARP.md#deploy)

---

## 🔐 Segurança

### Nunca commite:
- ❌ Arquivo `.env`
- ❌ API Keys
- ❌ Credenciais do Firebase
- ❌ Connection Strings

### Sempre:
- ✅ Use `.env.example` como template
- ✅ Adicione `.env` ao `.gitignore`
- ✅ Rotacione API keys periodicamente

---

## 📊 Tecnologias

### Frontend
- Vue.js 3
- Vite
- Axios
- Firebase (Firestore + Storage)
- LocalForage (offline storage)
- Vue Router
- Workbox (PWA)

### Backend
- ASP.NET Core 8.0
- Entity Framework Core
- SQL Server
- OpenAI GPT-4 Vision
- Azure (opcional)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes

---

## 📞 Suporte

- **Documentação Completa**: Ver arquivos `*.md` na raiz do projeto
- **Issues**: Abra uma issue no GitHub
- **API .NET**: Consulte [PROMPT-BACKEND-CSHARP.md](PROMPT-BACKEND-CSHARP.md)

---

## 🎉 Changelog

### v2.0.0 (2025-11-02)
- ✅ Migração completa para backend .NET 8
- ✅ OCR com GPT-4 Vision
- ✅ Remoção do backend Node.js
- ✅ Timeout aumentado para OCR (4 minutos)
- ✅ Conversão automática de dados snake_case → camelCase
- ✅ Documentação completa atualizada

### v1.0.0 (2023-10-17)
- ✅ Backend Node.js + Express
- ✅ SQLite como banco de dados
- ✅ OCR com Tesseract
- ✅ PWA com modo offline

---

**Desenvolvido com ❤️ para Clínica Alma**
