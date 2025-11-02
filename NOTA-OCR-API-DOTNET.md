# 🔍 Funcionalidade OCR na API .NET 8

## Status Atual

A API .NET 8 em `https://api.muniz.vps-kinghost.net` possui endpoints de OCR implementados, mas existem diferenças em relação ao backend Node.js original.

## Endpoints Disponíveis

### 1. OCR Completo
```
POST /api/ocr/ficha-completa
POST /api/Ocr/ficha-completa (também funciona - .NET é case-insensitive)
```

**Parâmetros esperados:**
- `ficha_frente` (IFormFile) - Imagem da ficha frente
- `ficha_costa` (IFormFile) - Imagem da ficha costa

### 2. OCR Individual
```
POST /api/ocr/ficha-frente
POST /api/ocr/ficha-costa
```

## Alterações Realizadas

### 1. Timeout Aumentado
**Arquivo:** [client/src/services/api.js](client/src/services/api.js:9)

```javascript
timeout: 120000  // 120 segundos (2 minutos)
```

**Motivo:** Processamento OCR pode demorar mais de 30 segundos, especialmente com:
- Imagens grandes
- GPT-4 Vision (se implementado)
- Servidor ocupado

### 2. Tratamento de Erros Melhorado
**Arquivo:** [client/src/views/NovaFicha.vue](client/src/views/NovaFicha.vue:371-392)

**Erros tratados:**
- ⏱️ **ECONNABORTED** - Timeout
- ❌ **400 Bad Request** - Dados inválidos
- ❌ **500 Internal Server Error** - Erro no servidor
- ❌ **API Key** - Configuração OpenAI

## Diferenças entre Node.js e .NET 8

### Backend Node.js Original

**Arquivo:** `server/routes/ocr-chatgpt.js`

**Características:**
- Usa OpenAI GPT-4 Vision API
- Prompts customizados em português
- Treinamento específico para campos da ficha (ver [TREINAR_CHATGPT.md](TREINAR_CHATGPT.md))
- Retorna dados estruturados em JSON
- Extração inteligente de:
  - Apometria (tipo, urgente)
  - Evocação (emocional, espiritual, física)
  - Campo de Proteção
  - Sessões (P1, P2, Long, etc.)
  - Tratamentos prescritos

### Backend .NET 8

**Implementação Esperada** (conforme [PROMPT-BACKEND-CSHARP.md](PROMPT-BACKEND-CSHARP.md:646-684)):

**Opções de OCR:**

1. **Tesseract.NET** (Open Source)
   - Gratuito
   - Precisão moderada
   - Rápido
   - Requer tessdata (dados de treinamento)

2. **Azure AI Vision** (Pago)
   - Alta precisão
   - Suporte a português
   - Requer chave Azure

3. **OpenAI GPT-4 Vision** (Pago - Opcional)
   - Melhor precisão
   - Entende contexto
   - Mais caro

## ⚠️ Pontos de Atenção

### 1. Implementação Atual Desconhecida

Não sabemos qual implementação de OCR a API .NET está usando:
- ❓ Tesseract?
- ❓ Azure Vision?
- ❓ GPT-4 Vision?

### 2. Estrutura de Resposta

A resposta pode ter formato diferente. Verificar:

**Node.js retorna:**
```json
{
  "extractedData": {
    "nome": "João Silva",
    "idade": 45,
    "apometria": {
      "realizar": true,
      "tipo": "Convencional",
      "urgente": false
    }
  }
}
```

**Verificar se .NET retorna no mesmo formato!**

### 3. Timeout em Produção

Se o timeout de 2 minutos não for suficiente, considere:
- Otimizar tamanho das imagens no frontend
- Implementar upload assíncrono com polling
- Aumentar timeout do servidor .NET

## 🧪 Como Testar

### 1. Teste Manual

```bash
# 1. Prepare duas imagens de teste
# 2. Acesse: http://localhost:5173/nova-ficha
# 3. Faça upload das fichas
# 4. Clique em "🤖 Processar com ChatGPT"
# 5. Observe o console do navegador (F12)
```

### 2. Verificar Resposta da API

Abra o console e procure por:
```javascript
console.log('Resposta da API:', response.data)
```

### 3. Comparar com Ficha Original

- Compare os dados extraídos com a ficha física
- Verifique se todos os campos foram capturados
- Valide checkboxes marcados

## 🔧 Solução de Problemas

### Problema: Timeout constante

**Soluções:**
1. Reduzir tamanho das imagens antes do upload
2. Verificar se o servidor .NET está respondendo
3. Verificar logs do servidor .NET
4. Aumentar timeout ainda mais (max recomendado: 5 minutos)

### Problema: Campos não extraídos corretamente

**Para Tesseract:**
- Melhorar qualidade da imagem
- Ajustar contraste/brilho antes do upload
- Usar resolução maior (300+ DPI)

**Para GPT-4 Vision:**
- Ajustar prompts no backend .NET
- Ver [TREINAR_CHATGPT.md](TREINAR_CHATGPT.md) para exemplos

### Problema: Erro 400 Bad Request

**Verificar:**
- Ambas as fichas foram selecionadas?
- Formato de arquivo correto (JPEG, PNG)?
- Tamanho do arquivo (< 10MB recomendado)
- Nomes dos campos: `ficha_frente` e `ficha_costa`

### Problema: Erro 500 Internal Server Error

**Verificar no servidor .NET:**
- Logs de erro
- Configuração da API Key (se usando OpenAI)
- Permissões de arquivo
- Espaço em disco

## 📊 Monitoramento

### Métricas Importantes

1. **Tempo de Resposta**
   - Ideal: < 10 segundos
   - Aceitável: < 60 segundos
   - Problema: > 120 segundos

2. **Taxa de Sucesso**
   - Ideal: > 95%
   - Aceitável: > 80%
   - Problema: < 80%

3. **Precisão dos Dados**
   - Campos obrigatórios: 100%
   - Checkboxes: > 90%
   - Texto manuscrito: > 80%

## 🚀 Próximos Passos

1. **Testar OCR com fichas reais**
   - Upload de fichas de teste
   - Validar dados extraídos
   - Medir tempo de resposta

2. **Comparar implementações**
   - Node.js vs .NET
   - Precisão
   - Velocidade
   - Custo

3. **Otimizar se necessário**
   - Ajustar prompts (se GPT-4)
   - Melhorar pré-processamento de imagens
   - Implementar cache para fichas já processadas

4. **Documentar diferenças**
   - Criar guia de migração completo
   - Atualizar TREINAR_CHATGPT.md se aplicável

## 📞 Suporte

**Em caso de dúvidas sobre a implementação .NET:**
- Verificar código-fonte do backend .NET
- Consultar logs do servidor
- Testar endpoints individualmente com Postman/Insomnia

---

**Última atualização:** 2025-11-02
**Status:** ⚠️ Em teste - Aguardando validação com dados reais
