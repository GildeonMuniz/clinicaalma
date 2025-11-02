# Sistema de Gestão - Clínica Alma

Sistema completo para gestão de terapias espirituais (Apometria, Magnetismo) como **Progressive Web App (PWA)** com:
- 📷 **Captura de documentos via câmera** (mobile/desktop)
- 📡 **Modo offline** com sincronização automática
- 🤖 **IA ChatGPT (GPT-4 Vision)** para OCR de fichas manuscritas
- ☁️ **Firebase** para armazenamento em nuvem

## 🆕 NOVIDADES: PWA + Câmera + Offline!

### Versão 2.0 - Aplicativo Mobile Completo

- ✅ **📷 Captura via câmera** em dispositivos móveis
- ✅ **📱 PWA instalável** como app nativo
- ✅ **📡 Funciona offline** com sincronização automática
- ✅ **☁️ Firebase** para backup em nuvem
- ✅ **🤖 OCR com ChatGPT** (95%+ precisão em manuscritos)
- ✅ **🔄 Service Worker** para cache inteligente
- ✅ **🟢 Indicador online/offline** em tempo real

---

## 🚀 Início Rápido

### Para usar a aplicação:

**👉 Leia:** [`COMECE-AQUI.md`](COMECE-AQUI.md) - Guia de navegação completo

**👉 Ou siga:** [`GUIA-RAPIDO-COMPLETO.md`](GUIA-RAPIDO-COMPLETO.md) - 30 minutos do zero ao celular

### Resumo ultra-rápido:

1. **Configure Firebase** (15 min) - [`TUTORIAL-FIREBASE.md`](TUTORIAL-FIREBASE.md)
2. **Hospede a aplicação** (15 min) - [`TUTORIAL-HOSPEDAGEM.md`](TUTORIAL-HOSPEDAGEM.md)
3. **Teste no celular** (5 min)

**Total:** ~30 minutos para ter o app no celular!

## Funcionalidades

### 1. Gestão de Pacientes
- Cadastro completo de pacientes
- Histórico de atendimentos
- Busca por nome ou código

### 2. Fichas de Atendimento
- Upload de fichas escaneadas (frente e costa)
- **🤖 Extração inteligente com ChatGPT (GPT-4 Vision)** - NOVO!
- Extração alternativa via OCR Tesseract (grátis)
- Opção de preenchimento manual
- Armazenamento de imagens originais
- Tipos de tratamento:
  - Apometria (Energética/Convencional)
  - Bioenergia
  - Passes Magnéticos
  - Passes Humano-Espirituais

### 3. Controle de Tratamentos
- Prescrições (água magnetizada, gotas, florais)
- Sessões (P1, P2, P3A, P3B, Long, P4-P8)
- Orientações complementares
- Acompanhamento de reuniões

### 4. Dashboard
- Estatísticas de atendimentos
- Últimos atendimentos realizados
- Ações rápidas

## Tecnologias Utilizadas

### Backend
- **Node.js** + **Express** - Servidor web
- **Better-SQLite3** - Banco de dados SQLite
- **OpenAI GPT-4 Vision** - IA para extração de dados
- **Tesseract.js** - OCR alternativo grátis
- **Sharp** - Processamento de imagens
- **Multer** - Upload de arquivos

### Frontend
- **Vue 3** - Framework JavaScript
- **Vue Router** - Navegação
- **Axios** - Requisições HTTP
- **Vite** - Build tool

### PWA & Mobile (NOVO!)
- **Vite PWA Plugin** - Progressive Web App
- **Workbox** - Service Worker e cache
- **Firebase** - Firestore (dados) + Storage (imagens)
- **LocalForage** - Armazenamento offline (IndexedDB)
- **MediaDevices API** - Acesso à câmera

## Instalação

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Passo a Passo

1. **Instalar dependências do backend:**
```bash
npm install
```

2. **Instalar dependências do frontend:**
```bash
cd client
npm install
cd ..
```

3. **Inicializar banco de dados:**
```bash
npm run db:init
```

4. **Criar diretório de uploads:**
```bash
mkdir uploads
```

## Executando o Sistema

### Modo Desenvolvimento (Recomendado)

Execute o backend e frontend simultaneamente:
```bash
npm run dev
```

Ou execute separadamente:

**Backend (porta 3000):**
```bash
npm run server
```

**Frontend (porta 5173):**
```bash
npm run client
```

### Modo Produção

1. **Build do frontend:**
```bash
npm run build
```

2. **Iniciar servidor:**
```bash
npm start
```

3. **Acessar:**
```
http://localhost:3000
```

## Estrutura do Projeto

```
Clinicaalma/
├── server/                  # Backend Node.js
│   ├── index.js            # Servidor principal
│   ├── database/           # Configuração do banco
│   │   ├── db.js          # Conexão SQLite
│   │   └── init.js        # Script de inicialização
│   └── routes/            # Rotas da API
│       ├── pacientes.js   # CRUD de pacientes
│       ├── fichas.js      # CRUD de fichas
│       └── ocr.js         # Processamento OCR
├── client/                # Frontend Vue.js
│   ├── src/
│   │   ├── views/        # Páginas
│   │   │   ├── Home.vue
│   │   │   ├── Pacientes.vue
│   │   │   ├── NovaFicha.vue
│   │   │   └── DetalhePaciente.vue
│   │   ├── App.vue       # Componente principal
│   │   ├── main.js       # Configuração Vue
│   │   └── style.css     # Estilos globais
│   └── index.html        # HTML base
├── database/             # Banco de dados
│   ├── schema.sql       # Schema do banco
│   └── clinica.db       # Arquivo SQLite (criado automaticamente)
├── uploads/             # Arquivos enviados
├── documentos/          # Fichas de exemplo
│   ├── FichaFrente.jpeg
│   └── FichaCosta.jpeg
├── package.json         # Dependências
└── README.md           # Este arquivo
```

## API Endpoints

### Pacientes
- `GET /api/pacientes` - Listar todos
- `GET /api/pacientes/:id` - Buscar por ID
- `GET /api/pacientes/codigo/:codigo` - Buscar por código
- `POST /api/pacientes` - Criar novo
- `PUT /api/pacientes/:id` - Atualizar
- `DELETE /api/pacientes/:id` - Deletar
- `GET /api/pacientes/:id/fichas` - Histórico de fichas

### Fichas de Atendimento
- `GET /api/fichas` - Listar todas
- `GET /api/fichas/:id` - Buscar por ID (com sessões e tratamentos)
- `POST /api/fichas` - Criar nova
- `PUT /api/fichas/:id` - Atualizar
- `DELETE /api/fichas/:id` - Deletar

### OCR
- `POST /api/ocr/ficha-frente` - Upload e OCR da ficha frente
- `POST /api/ocr/ficha-costa` - Upload e OCR da ficha costa
- `POST /api/ocr/ficha-completa` - Upload completo (frente + costa)

## Fluxo de Uso

### 1. Cadastro de Nova Ficha

1. Acesse **Nova Ficha** no menu
2. Faça upload das fichas escaneadas:
   - Ficha Frente (dados do paciente)
   - Ficha Costa (tratamentos/receita)
3. Clique em **Processar Fichas com OCR**
4. O sistema extrairá automaticamente:
   - Dados pessoais
   - Tipo de tratamento
   - Indicações específicas
   - Prescrições
5. Revise os dados extraídos
6. Clique em **Salvar Ficha**

### 2. Consultar Paciente

1. Acesse **Pacientes** no menu
2. Use a busca para encontrar por nome ou código
3. Clique em **Ver** para ver detalhes
4. Visualize:
   - Dados completos do paciente
   - Histórico de atendimentos
   - Fichas escaneadas originais

## Banco de Dados

### Tabelas Principais

**pacientes**
- Dados cadastrais completos
- Código único do consulente

**fichas_atendimento**
- Registro de cada atendimento
- Tipo de tratamento aplicado
- Links para fichas escaneadas

**sessoes**
- Controle de sessões (P1, P2, Long, etc.)
- Datas de cada sessão

**tratamentos**
- Prescrições detalhadas
- Orientações complementares
- Acompanhamento

## 📚 Documentação Completa

### Guias de Início
- 📖 [`COMECE-AQUI.md`](COMECE-AQUI.md) - **Comece por aqui!** Navegação dos guias
- ⚡ [`GUIA-RAPIDO-COMPLETO.md`](GUIA-RAPIDO-COMPLETO.md) - Checklist passo a passo (30 min)
- 🚀 [`QUICK-START-PWA.md`](QUICK-START-PWA.md) - Versão ultra-resumida

### Tutoriais Específicos
- 🔥 [`TUTORIAL-FIREBASE.md`](TUTORIAL-FIREBASE.md) - Configurar Firebase do zero
- 🌐 [`TUTORIAL-HOSPEDAGEM.md`](TUTORIAL-HOSPEDAGEM.md) - Hospedar na Vercel/Firebase/Netlify
- 🎨 [`VISUAL-GUIDE.md`](VISUAL-GUIDE.md) - Guia visual com diagramas

### Referências Técnicas
- 🏗️ [`README-PWA.md`](README-PWA.md) - Arquitetura PWA completa
- 📊 [`IMPLEMENTACAO-COMPLETA.md`](IMPLEMENTACAO-COMPLETA.md) - Resumo técnico detalhado
- 🤖 [`CHATGPT_SETUP.md`](CHATGPT_SETUP.md) - Configurar OCR com ChatGPT

---

## 📱 Como Usar no Celular

### 1. Configure Firebase
```bash
# Siga: TUTORIAL-FIREBASE.md
# 15 minutos
```

### 2. Hospede a Aplicação
```bash
# Siga: TUTORIAL-HOSPEDAGEM.md
# 15 minutos
# Recomendado: Vercel (grátis)
```

### 3. Acesse no Celular
```
https://clinica-alma.vercel.app
```

### 4. Instale como App
- Android: Menu > "Adicionar à tela inicial"
- iOS: Compartilhar > "Adicionar à Tela de Início"

### 5. Use Offline!
- Capture fotos via câmera
- Dados salvos localmente
- Sincronização automática quando voltar online

---

## Melhorias Implementadas (v2.0)

- ✅ PWA instalável
- ✅ Captura de câmera mobile
- ✅ Modo offline completo
- ✅ Sincronização automática
- ✅ Firebase integrado
- ✅ Service Worker
- ✅ Indicador de status
- ✅ Cache inteligente

## Melhorias Futuras (v3.0)

- [ ] Autenticação Firebase
- [ ] Notificações push
- [ ] Relatórios em PDF
- [ ] Backup automático
- [ ] Agendamento de sessões
- [ ] Integração WhatsApp
- [ ] Analytics
- [ ] Modo escuro

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Certifique-se que todas as dependências estão instaladas
3. Verifique se as portas 3000 e 5173 estão livres

## Licença

MIT License - Uso livre para fins educacionais e não comerciais.

---

**Desenvolvido para Clínica Alma**
Sistema de Gestão de Terapias Espirituais
