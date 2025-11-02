# Guia de Instalação - Sistema Clínica Alma

## Requisitos do Sistema

- Windows 10/11, macOS ou Linux
- Node.js versão 16 ou superior
- npm (vem com Node.js)
- 500MB de espaço em disco

## Passo a Passo Completo

### 1. Verificar Node.js

Abra o terminal/prompt de comando e execute:

```bash
node --version
```

Se não tiver o Node.js instalado, baixe em: https://nodejs.org/

### 2. Navegar até a pasta do projeto

```bash
cd C:\Clinicaalma
```

### 3. Instalar dependências do Backend

```bash
npm install
```

Aguarde a instalação de todos os pacotes (Express, SQLite, Tesseract, etc.)

### 4. Instalar dependências do Frontend

```bash
cd client
npm install
cd ..
```

### 5. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

No Linux/Mac:
```bash
cp .env.example .env
```

### 6. Inicializar o Banco de Dados

```bash
npm run db:init
```

Você verá:
```
📁 Diretório database criado
📁 Diretório uploads criado
📊 Inicializando banco de dados...
✅ Banco de dados inicializado com sucesso!
```

### 7. Iniciar o Sistema

**Opção 1 - Modo Desenvolvimento (Recomendado para testes):**

```bash
npm run dev
```

Isso iniciará:
- Backend na porta 3000
- Frontend na porta 5173

**Opção 2 - Backend e Frontend separados:**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 8. Acessar o Sistema

Abra o navegador e acesse:

**Modo Desenvolvimento:**
```
http://localhost:5173
```

**Modo Produção (após build):**
```
http://localhost:3000
```

## Estrutura de Pastas Criadas

Após a instalação, você terá:

```
C:\Clinicaalma\
├── node_modules/          (dependências backend)
├── client/
│   └── node_modules/      (dependências frontend)
├── database/
│   └── clinica.db         (banco de dados SQLite)
├── uploads/               (fichas enviadas)
└── .env                   (configurações)
```

## Testando o Sistema

### 1. Teste Básico

1. Acesse http://localhost:5173
2. Você verá o Dashboard com estatísticas zeradas
3. Clique em "Nova Ficha"

### 2. Teste de Upload

1. Na página "Nova Ficha"
2. Faça upload das fichas em `documentos/FichaFrente.jpeg` e `documentos/FichaCosta.jpeg`
3. Clique em "Processar Fichas com OCR"
4. Aguarde a extração dos dados
5. Revise e salve

### 3. Verificar Paciente

1. Vá em "Pacientes"
2. Veja o paciente cadastrado
3. Clique em "Ver" para ver detalhes

## Solução de Problemas

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
rm -rf node_modules
npm install

# Ou no Windows:
rmdir /s node_modules
npm install
```

### Erro: "Port 3000 already in use"

Opção 1 - Mudar a porta no arquivo `.env`:
```
PORT=3001
```

Opção 2 - Finalizar o processo que está usando a porta 3000

### Erro: "Database locked"

Feche todas as instâncias do servidor e reinicie:
```bash
npm run server
```

### Erro no OCR: "Tesseract not found"

O Tesseract.js baixa automaticamente os arquivos necessários na primeira execução. Se falhar:

1. Verifique sua conexão com internet
2. Aguarde alguns minutos na primeira execução
3. Os arquivos serão armazenados em cache

### Erro: "Cannot create directory"

Execute o terminal como Administrador (Windows) ou use `sudo` (Linux/Mac)

## Backup do Banco de Dados

Para fazer backup dos dados:

```bash
# Copiar o arquivo do banco
copy database\clinica.db database\clinica_backup.db
```

No Linux/Mac:
```bash
cp database/clinica.db database/clinica_backup.db
```

## Restaurar Backup

```bash
# Substituir banco atual pelo backup
copy database\clinica_backup.db database\clinica.db
```

## Atualização do Sistema

Se houver atualizações no código:

```bash
# Atualizar dependências
npm install
cd client && npm install && cd ..

# Atualizar banco (se necessário)
npm run db:init
```

## Modo Produção

Para usar em produção:

1. **Build do frontend:**
```bash
npm run build
```

2. **Configurar .env para produção:**
```
PORT=80
NODE_ENV=production
```

3. **Iniciar servidor:**
```bash
npm start
```

4. **Acessar:**
```
http://localhost
```

## Desinstalação

Para remover o sistema:

```bash
# Remover dependências
rm -rf node_modules
rm -rf client/node_modules

# Remover banco e uploads (ATENÇÃO: isso apaga os dados!)
rm -rf database
rm -rf uploads
```

## Suporte Técnico

Se encontrar problemas:

1. Verifique se todas as dependências foram instaladas
2. Consulte os logs no terminal
3. Verifique o arquivo `README.md` para mais informações
4. Entre em contato com o administrador do sistema

---

**Sistema Clínica Alma v1.0**
