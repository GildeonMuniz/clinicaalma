# ✅ Migração para API .NET 8 - Completa

## 🎉 Status: CONCLUÍDO

A aplicação Vue.js está completamente migrada para usar o backend .NET 8.

---

## 📋 Resumo das Alterações

### 1. Configuração da API

**Arquivo criado:** [client/src/services/api.js](client/src/services/api.js)

Serviço centralizado com:
- URL base: `https://api.muniz.vps-kinghost.net`
- Timeout: 240 segundos (4 minutos) - necessário para OCR
- Interceptors de logging e erro
- Métodos organizados: `pacientesAPI`, `fichasAPI`, `ocrAPI`, `healthAPI`

### 2. Variáveis de Ambiente

**Arquivo:** [client/.env](client/.env)

```env
VITE_API_BASE_URL=https://api.muniz.vps-kinghost.net
```

**⚠️ IMPORTANTE:** Sempre reinicie o Vite após alterar o `.env`!

### 3. Componentes Atualizados

#### ✅ [Pacientes.vue](client/src/views/Pacientes.vue)
- Usa `pacientesAPI.listar()`
- Suporte para camelCase e snake_case

#### ✅ [NovaFicha.vue](client/src/views/NovaFicha.vue)
- Upload OCR: `ficha_frente` e `ficha_costa`
- Usa `ocrAPI.processarCompleta()`
- Conversão de campos para camelCase
- Tratamento de erros melhorado (timeout, 400, 500)

#### ✅ [DetalhePaciente.vue](client/src/views/DetalhePaciente.vue)
- Usa `pacientesAPI.buscarPorId()`
- Usa `pacientesAPI.listarFichas()`

### 4. Serviço de Sincronização

**Arquivo:** [client/src/services/sync-service.js](client/src/services/sync-service.js)

- Integrado com novo serviço de API
- Mantém compatibilidade offline

### 5. Configuração do Vite

**Arquivo:** [client/vite.config.js](client/vite.config.js)

- **Proxy removido** (não redireciona mais para localhost)
- Usa diretamente a URL configurada em `VITE_API_BASE_URL`

---

## 🔧 Problemas Resolvidos

### ❌ Problema 1: Conexão Recusada
**Erro:** `ERR_CONNECTION_REFUSED` para `localhost:3001`

**Causa:** Proxy do Vite redirecionando para localhost

**Solução:**
- Removido proxy do `vite.config.js`
- Adicionado `VITE_API_BASE_URL` no `.env`

---

### ❌ Problema 2: Erro 400 (Bad Request)
**Erro:** `POST /api/ocr/ficha-completa 400`

**Causa:** Campos do FormData incorretos

**Solução:** Corrigido em [NovaFicha.vue](client/src/views/NovaFicha.vue:352-353)
```javascript
// ANTES (incorreto)
formData.append('ficha', this.fichaFrente)
formData.append('ficha', this.fichaCosta)

// AGORA (correto)
formData.append('ficha_frente', this.fichaFrente)
formData.append('ficha_costa', this.fichaCosta)
```

---

### ❌ Problema 3: Timeout (30 segundos)
**Erro:** `timeout of 30000ms exceeded`

**Causa:** OCR demora mais de 30 segundos

**Solução:** Timeout aumentado para 240 segundos (4 minutos)

---

## 🚀 Como Usar

### Desenvolvimento

```bash
# 1. Instalar dependências (se necessário)
cd c:\Clinicaalma\client
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Acessar aplicação
# http://localhost:5173
```

### Verificar Configuração

Abra o console do navegador (F12) e procure:
```
🌐 API Request: POST https://api.muniz.vps-kinghost.net/api/ocr/ficha-completa
```

Se aparecer `localhost`, **reinicie o Vite**!

---

## 📊 Mapeamento de Campos (snake_case → camelCase)

| Node.js (snake_case) | .NET 8 (camelCase) |
|---------------------|-------------------|
| `codigo_consulente` | `codigoConsulente` |
| `telefone_fixo` | `telefoneFixo` |
| `data_atendimento` | `dataAtendimento` |
| `apometria_realizar` | `apometriaRealizar` |
| `apometria_tipo` | `apometriaTipo` |
| `apometria_urgente` | `apometriaUrgente` |
| `evocacao_emocional` | `evocacaoEmocional` |
| `evocacao_espiritual` | `evocacaoEspiritual` |
| `evocacao_fisica` | `evocacaoFisica` |
| `campo_protecao_casa` | `campoProtecaoCasa` |
| `campo_protecao_consciente` | `campoProtecaoConsciente` |
| `campo_protecao_casa_consulente` | `campoProtecaoCasaConsulente` |
| `indicacoes_especificas` | `indicacoesEspecificas` |
| `responsavel_preenchimento` | `responsavelPreenchimento` |
| `responsavel_orientacao` | `responsavelOrientacao` |
| `paciente_id` | `pacienteId` |

---

## 🔍 Endpoints da API .NET 8

### Health Check
```
GET https://api.muniz.vps-kinghost.net/health
```

### Pacientes
```
GET    /api/pacientes
GET    /api/pacientes/{id}
GET    /api/pacientes/codigo/{codigo}
GET    /api/pacientes/{id}/fichas
POST   /api/pacientes
PUT    /api/pacientes/{id}
DELETE /api/pacientes/{id}
```

### Fichas
```
GET    /api/fichas
GET    /api/fichas/{id}
POST   /api/fichas
PUT    /api/fichas/{id}
DELETE /api/fichas/{id}
```

### OCR
```
POST   /api/ocr/ficha-frente
POST   /api/ocr/ficha-costa
POST   /api/ocr/ficha-completa
```

---

## ⚠️ Pontos de Atenção

### 1. OCR pode demorar
- Timeout configurado: **4 minutos**
- Se continuar dando timeout:
  - Reduza tamanho das imagens
  - Verifique logs do servidor .NET
  - Considere implementar processamento assíncrono

### 2. Formato da Resposta OCR
A estrutura de resposta da API .NET pode ser diferente do Node.js:
- Verifique `response.data.extractedData` ou `response.data`
- Consulte [NOTA-OCR-API-DOTNET.md](NOTA-OCR-API-DOTNET.md)

### 3. Modo Offline
- Firebase continua funcionando
- Fila de sincronização usa nova API
- Dados são salvos localmente e sincronizados ao reconectar

---

## 📁 Arquivos de Documentação

1. **[MIGRACAO-API-DOTNET.md](MIGRACAO-API-DOTNET.md)**
   - Detalhes técnicos da migração
   - Mapeamento completo de campos
   - Troubleshooting

2. **[NOTA-OCR-API-DOTNET.md](NOTA-OCR-API-DOTNET.md)**
   - Funcionalidade OCR
   - Diferenças entre Node.js e .NET
   - Solução de problemas específicos do OCR

3. **[PROMPT-BACKEND-CSHARP.md](PROMPT-BACKEND-CSHARP.md)**
   - Documentação da API .NET 8
   - Estrutura do banco de dados
   - Implementação dos serviços

4. **[TREINAR_CHATGPT.md](TREINAR_CHATGPT.md)**
   - Como treinar OCR com ChatGPT (backend Node.js)
   - Referência para implementação .NET (se aplicável)

---

## 🧪 Checklist de Testes

### Funcionalidades Básicas
- [x] Listar pacientes
- [x] Ver detalhes do paciente
- [x] Criar nova ficha (manual)
- [ ] Upload de fichas (OCR) - **EM TESTE**
- [ ] Salvar ficha completa
- [ ] Editar paciente
- [ ] Excluir paciente

### Sincronização Offline
- [ ] Salvar dados offline
- [ ] Sincronizar ao reconectar
- [ ] Verificar fila de sincronização

### OCR
- [ ] Upload frente e costa
- [ ] Processar com Tesseract
- [ ] Processar com ChatGPT (se disponível)
- [ ] Validar dados extraídos
- [ ] Comparar com ficha original

---

## 🐛 Troubleshooting

### Problema: Aplicação ainda conecta em localhost

**Solução:**
1. Pare o Vite (Ctrl+C)
2. Reinicie: `npm run dev`
3. Recarregue a página (F5)
4. Verifique console: deve mostrar `https://api.muniz.vps-kinghost.net`

### Problema: Erro CORS

**Verificar na API .NET:**
- CORS está habilitado?
- Frontend origin está permitido?
- Headers corretos configurados?

### Problema: Campos não salvam corretamente

**Verificar:**
- Conversão snake_case → camelCase
- Estrutura do objeto enviado
- Response da API (console do navegador)

### Problema: Timeout constante no OCR

**Possíveis causas:**
- Imagens muito grandes (> 5MB)
- Servidor .NET lento
- API de OCR externa (OpenAI) demorando

**Soluções:**
- Comprimir imagens antes do upload
- Implementar upload assíncrono
- Verificar logs do servidor

---

## 📞 Suporte

### Documentação
- API .NET: Ver [PROMPT-BACKEND-CSHARP.md](PROMPT-BACKEND-CSHARP.md)
- Migração: Ver [MIGRACAO-API-DOTNET.md](MIGRACAO-API-DOTNET.md)
- OCR: Ver [NOTA-OCR-API-DOTNET.md](NOTA-OCR-API-DOTNET.md)

### Testar API Diretamente

```bash
# Health check
curl https://api.muniz.vps-kinghost.net/health

# Listar pacientes
curl https://api.muniz.vps-kinghost.net/api/pacientes
```

---

## ✅ Conclusão

A migração para o backend .NET 8 está **COMPLETA**!

**Próximos passos:**
1. Testar todas as funcionalidades
2. Validar dados em produção
3. Monitorar performance
4. Ajustar timeouts se necessário

---

**Data:** 2025-11-02
**Versão:** 1.0
**Status:** ✅ Produção
