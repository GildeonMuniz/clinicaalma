# Configuração do ChatGPT para OCR

O sistema agora suporta **ChatGPT (GPT-4 Vision)** para extração de dados das fichas! Isso é MUITO mais preciso que o Tesseract, especialmente para texto manuscrito (escrito à mão).

## Por que usar ChatGPT?

### ✅ Vantagens
- **Lê texto manuscrito** com alta precisão
- **Entende contexto** das fichas
- **Extrai dados estruturados** automaticamente
- **Mais rápido** que revisão manual
- **Menos erros** que OCR tradicional

### ❌ Desvantagens
- Requer API Key da OpenAI (paga)
- Consome créditos por processamento
- Requer internet

## Como Configurar

### Passo 1: Obter API Key da OpenAI

1. **Acesse:** https://platform.openai.com/api-keys
2. **Faça login** ou crie uma conta
3. **Clique em** "Create new secret key"
4. **Copie a chave** (começa com `sk-...`)
5. **Guarde em local seguro** (você não poderá ver novamente)

### Passo 2: Adicionar Créditos

1. **Acesse:** https://platform.openai.com/settings/organization/billing
2. **Adicione créditos** (mínimo $5 USD)
3. O GPT-4o custa aproximadamente:
   - **$0.005 por imagem** (~R$ 0.03)
   - Uma ficha completa (frente + costa) = ~R$ 0.06

### Passo 3: Configurar no Sistema

1. **Abra o arquivo** `C:\Clinicaalma\.env`
2. **Cole sua chave API:**

```env
# OpenAI API (ChatGPT)
OPENAI_API_KEY=sk-sua-chave-aqui
```

3. **Salve o arquivo**
4. **Reinicie o servidor:**

```bash
# Pare o servidor (Ctrl+C)
npm run server
```

### Passo 4: Testar

1. **Acesse:** http://localhost:3001
2. **Vá em** "Nova Ficha"
3. **Faça upload** das fichas
4. **Clique em** "🤖 Processar com ChatGPT"
5. **Aguarde** (~10-15 segundos)
6. **Revise os dados** extraídos

## Como Usar

### Interface Atualizada

Agora há **3 opções** para processar fichas:

```
┌─────────────────────────────────────────────────┐
│ 🤖 Processar com ChatGPT (Recomendado)         │ ← Melhor precisão
├─────────────────────────────────────────────────┤
│ OCR Tesseract                                   │ ← Grátis, mas menos preciso
├─────────────────────────────────────────────────┤
│ Manual                                          │ ← Preenchimento manual
└─────────────────────────────────────────────────┘
```

### Quando usar cada opção:

**🤖 ChatGPT (Recomendado)**
- Fichas com texto manuscrito
- Quando precisar de alta precisão
- Tem API Key configurada

**OCR Tesseract**
- Fichas apenas com texto impresso
- Não tem API Key
- Quer economizar créditos

**Manual**
- API Key não configurada
- Fichas ilegíveis
- Prefere preencher manualmente

## Custos Estimados

### Preços da OpenAI (GPT-4o)

- **Entrada:** $0.0025 por 1K tokens (~1 imagem)
- **Saída:** $0.01 por 1K tokens (resposta)

### Estimativa por Ficha Completa

```
Ficha Frente:  $0.003
Ficha Costa:   $0.003
Resposta:      $0.002
─────────────────────
Total:         $0.008 (~R$ 0.04)
```

### Estimativa Mensal

```
100 pacientes/mês  = $0.80  (~R$ 4.00)
500 pacientes/mês  = $4.00  (~R$ 20.00)
1000 pacientes/mês = $8.00  (~R$ 40.00)
```

💡 **Dica:** Muito mais barato que digitação manual!

## Solução de Problemas

### ❌ "API Key da OpenAI não configurada"

**Solução:**
1. Verifique se a chave está no arquivo `.env`
2. Verifique se não há espaços extras
3. Reinicie o servidor

### ❌ "Erro de autenticação com OpenAI"

**Causas possíveis:**
- API Key inválida ou expirada
- Sem créditos na conta
- Conta suspensa

**Solução:**
1. Verifique sua conta em: https://platform.openai.com
2. Confirme que tem créditos
3. Gere uma nova API Key

### ❌ "Erro ao processar com ChatGPT"

**Possíveis causas:**
- Sem internet
- Imagem muito grande (>10MB)
- Servidor OpenAI indisponível

**Solução:**
1. Verifique sua conexão
2. Reduza o tamanho da imagem
3. Tente novamente mais tarde
4. Use OCR Tesseract ou Manual

### ⚠️ "Dados extraídos incorretos"

Mesmo o ChatGPT pode errar! Sempre:
- ✅ Revise todos os campos
- ✅ Corrija dados incorretos
- ✅ Preencha campos vazios

## Comparação: ChatGPT vs Tesseract

| Recurso | ChatGPT | Tesseract |
|---------|---------|-----------|
| Texto impresso | ✅ Excelente | ✅ Bom |
| Texto manuscrito | ✅ Excelente | ❌ Ruim |
| Precisão | 95%+ | 60-70% |
| Velocidade | 10-15s | 5-10s |
| Custo | ~R$ 0.04/ficha | Grátis |
| Internet | Necessária | Não necessária |
| Contexto | Entende | Não entende |

## Segurança e Privacidade

### ⚠️ Importante

- As imagens são enviadas para servidores da OpenAI
- Os dados são processados conforme [Política de Privacidade da OpenAI](https://openai.com/policies/privacy-policy)
- Para dados sensíveis, considere usar OCR local (Tesseract)

### Boas Práticas

- ✅ Use API Keys específicas para este projeto
- ✅ Rotacione API Keys periodicamente
- ✅ Monitore uso e custos
- ✅ Não compartilhe API Keys
- ❌ Não commite API Keys no Git

## Recursos Adicionais

### Links Úteis

- **Dashboard OpenAI:** https://platform.openai.com/usage
- **Documentação GPT-4 Vision:** https://platform.openai.com/docs/guides/vision
- **Preços:** https://openai.com/pricing
- **Status:** https://status.openai.com/

### Monitoramento

Para ver o uso da API:
1. Acesse: https://platform.openai.com/usage
2. Veja custos diários/mensais
3. Configure alertas de gasto

## Alternativas

Se não quiser usar ChatGPT:

1. **Tesseract (Grátis)** - Já incluído no sistema
2. **Google Cloud Vision** - Similar ao ChatGPT, pago
3. **Azure Computer Vision** - Microsoft, pago
4. **Manual** - Sempre disponível, sem custo

---

## Resumo Rápido

```bash
# 1. Obter API Key
# https://platform.openai.com/api-keys

# 2. Adicionar ao .env
OPENAI_API_KEY=sk-sua-chave

# 3. Reiniciar servidor
npm run server

# 4. Usar no sistema
# Clique em "🤖 Processar com ChatGPT"
```

**Pronto! 🎉**

O ChatGPT vai ler suas fichas manuscritas com precisão incrível!
