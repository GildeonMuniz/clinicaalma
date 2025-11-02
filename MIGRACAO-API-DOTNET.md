# Migração para API .NET 8

Este documento descreve as alterações realizadas para migrar a aplicação do backend Node.js/Express para o backend .NET 8.

## Resumo das Mudanças

A aplicação Vue.js agora se comunica com a API .NET 8 hospedada em `https://api.muniz.vps-kinghost.net`.

## Arquivos Alterados

### 1. Configuração (.env)

**Arquivo:** `c:\Clinicaalma\.env`

Adicionada a variável de ambiente para a URL base da API:

```env
VITE_API_BASE_URL=https://api.muniz.vps-kinghost.net
```

### 2. Novo Serviço de API

**Arquivo:** `c:\Clinicaalma\client\src\services\api.js` (NOVO)

Criado um serviço centralizado para todas as chamadas à API com:

- Configuração do Axios com a URL base da API .NET 8
- Interceptors para logging e tratamento de erros
- Métodos organizados por recurso (pacientes, fichas, OCR, health)

**Benefícios:**
- Código mais organizado e reutilizável
- Fácil manutenção e alteração da URL da API
- Tratamento de erros centralizado
- Suporte a timeout de 30 segundos

**Exemplo de uso:**
```javascript
import { pacientesAPI, fichasAPI, ocrAPI } from '@/services/api'

// Listar pacientes
const response = await pacientesAPI.listar()

// Buscar por código
const paciente = await pacientesAPI.buscarPorCodigo('001')

// Criar ficha
await fichasAPI.criar(dadosFicha)
```

### 3. Componentes Vue Atualizados

#### a) Pacientes.vue

**Mudanças:**
- Substituído `import axios from 'axios'` por `import { pacientesAPI } from '../services/api'`
- Substituído `axios.get('/api/pacientes')` por `pacientesAPI.listar()`
- Adicionado suporte para nomes de campos em camelCase e snake_case

#### b) NovaFicha.vue

**Mudanças:**
- Importado `{ pacientesAPI, fichasAPI, ocrAPI }` ao invés de axios direto
- Atualizado método `processarFichasGPT()` para usar `ocrAPI.processarCompleta()`
- Atualizado método `processarFichas()` para usar `ocrAPI.processarCompleta()`
- Atualizado método `salvarFicha()`:
  - Usa `pacientesAPI.buscarPorCodigo()` e `pacientesAPI.criar()`
  - Usa `fichasAPI.criar()`
  - Converte nomes de campos de snake_case para camelCase (conforme API .NET)

**Mapeamento de campos:**
```javascript
// Antes (Node.js)
codigo_consulente, telefone_fixo, apometria_realizar

// Agora (.NET)
codigoConsulente, telefoneFixo, apometriaRealizar
```

#### c) DetalhePaciente.vue

**Mudanças:**
- Substituído axios por `pacientesAPI`
- Usa `pacientesAPI.buscarPorId()` e `pacientesAPI.listarFichas()`

### 4. Serviço de Sincronização

**Arquivo:** `c:\Clinicaalma\client\src\services\sync-service.js`

**Mudanças:**
- Importado o novo serviço de API
- Substituído chamadas `axios.post()` por `pacientesAPI.criar()` e `fichasAPI.criar()`
- Mantida compatibilidade com sistema de fila offline

## Endpoints da API .NET 8

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

### OCR (Processamento de Imagens)

```
POST   /api/ocr/ficha-frente       # Processar frente
POST   /api/ocr/ficha-costa        # Processar costa
POST   /api/ocr/ficha-completa     # Processar completa
```

### Health Check

```
GET    /health                     # Status da API
```

## Convenções de Nomenclatura

A API .NET 8 usa **camelCase** para nomes de propriedades JSON, diferente do backend Node.js que usava **snake_case**.

### Exemplos de Conversão:

| Node.js (snake_case) | .NET 8 (camelCase) |
|---------------------|-------------------|
| `codigo_consulente` | `codigoConsulente` |
| `telefone_fixo` | `telefoneFixo` |
| `data_atendimento` | `dataAtendimento` |
| `apometria_realizar` | `apometriaRealizar` |
| `apometria_tipo` | `apometriaTipo` |
| `evocacao_emocional` | `evocacaoEmocional` |
| `campo_protecao_casa` | `campoProtecaoCasa` |
| `indicacoes_especificas` | `indicacoesEspecificas` |
| `responsavel_preenchimento` | `responsavelPreenchimento` |
| `paciente_id` | `pacienteId` |

## Como Testar

### 1. Verificar Conectividade

```bash
curl -I https://api.muniz.vps-kinghost.net/health
```

Deve retornar `200 OK`.

### 2. Rodar o Frontend

```bash
cd client
npm run dev
```

O Vite carregará automaticamente a variável `VITE_API_BASE_URL` do arquivo `.env`.

### 3. Testar Funcionalidades

1. **Listar Pacientes**: Navegue para `/pacientes`
2. **Criar Nova Ficha**: Navegue para `/nova-ficha`
3. **Detalhes do Paciente**: Clique em "Ver" em um paciente

## Compatibilidade com Modo Offline

O sistema de sincronização offline continua funcionando:

- Dados são salvos em LocalForage quando offline
- Firebase Firestore continua como backup
- Ao reconectar, a fila de sincronização usa a nova API .NET

## Rollback (Se Necessário)

Para reverter para o backend Node.js:

1. Altere o `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```

2. Inicie o servidor Node.js:
   ```bash
   npm run dev
   ```

## Problemas Resolvidos

### 1. Proxy do Vite
- **Problema**: Proxy redirecionava `/api` para `localhost:3000`
- **Solução**: Removido proxy do [vite.config.js](client/vite.config.js)

### 2. Variável de Ambiente
- **Problema**: `VITE_API_BASE_URL` não estava no arquivo `.env` do client
- **Solução**: Adicionado em [client/.env](client/.env)

### 3. Formato do FormData OCR
- **Problema**: Enviando campos como `ficha` ao invés de `ficha_frente` e `ficha_costa`
- **Solução**: Corrigido em [NovaFicha.vue](client/src/views/NovaFicha.vue) linhas 352-353 e 394-395
- **Documentação**: Segundo [PROMPT-BACKEND-CSHARP.md](PROMPT-BACKEND-CSHARP.md:677-679), o endpoint espera `IFormFile ficha_frente` e `IFormFile ficha_costa`

## Próximos Passos

- [ ] Testar todos os endpoints com dados reais
- [ ] Verificar tratamento de erros da API .NET
- [ ] Ajustar campos que possam ter nomes diferentes
- [ ] Testar upload de imagens OCR
- [ ] Validar sincronização offline
- [ ] Monitorar logs de erro no console do navegador

## Suporte

Para problemas ou dúvidas sobre a API .NET 8, verifique:
- Arquivo: `PROMPT-BACKEND-CSHARP.md`
- URL da API: `https://api.muniz.vps-kinghost.net`
- Health Check: `https://api.muniz.vps-kinghost.net/health`

---

**Data da Migração:** 2025-11-01
**Versão da API:** .NET 8
**Status:** ✅ Concluído
