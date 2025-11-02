# 🎓 Como Treinar o ChatGPT para Cada Campo da Ficha

## 📋 Visão Geral

O ChatGPT já está treinado para ler TODAS as partes da ficha. Mas você pode melhorar a precisão ajustando o prompt para campos específicos.

---

## 🔧 Estrutura Atual dos Prompts

### Localização do Código
```
C:\Clinicaalma\server\routes\ocr-chatgpt.js
```

### Duas Constantes Principais:
1. **`PROMPT_FICHA_FRENTE`** - Ficha frente (dados pessoais, apometria, sessões)
2. **`PROMPT_FICHA_COSTA`** - Ficha costa (tratamentos, prescrições)

---

## 📝 Como Está Configurado Agora

### ✅ Apometria (CORRIGIDO)

**Estrutura JSON esperada:**
```json
"apometria": {
  "realizar": true,        // Sim ou Não na pergunta "Apometria?"
  "tipo": "Convencional",  // "Energética" ou "Convencional"
  "urgente": false         // Sim ou Não na pergunta "Urgente?"
}
```

**O que o ChatGPT lê:**
- Checkbox marcado em "□ Energética" ou "☒ Convencional"
- Checkbox marcado em "□ Sim" ou "☒ Não" (Urgente?)

**Exemplo de retorno:**
```json
"apometria": {
  "realizar": true,
  "tipo": "Convencional",
  "urgente": false
}
```

---

## 🎯 Outros Campos Estruturados

### 1. Evocação

**JSON esperado:**
```json
"evocacao": {
  "emocional": false,
  "espiritual": true,
  "fisica": false
}
```

**O que buscar na ficha:**
- □ Emocional
- ☒ Espiritual
- □ Física

---

### 2. Campo de Proteção

**JSON esperado:**
```json
"campo_protecao": {
  "casa": true,
  "consciente": false,
  "casa_consulente": true
}
```

**O que buscar:**
- ☒ Casa
- □ Consciente
- ☒ Casa + Consulente

---

### 3. Exclusivo para Tratamento Médico Espiritual

**JSON esperado:**
```json
"exclusivo_tratamento_medico": {
  "procedimentos_especiais": true,
  "limpeza_energetica": true,
  "limpeza_energetica_campo_protecao": false,
  "ectoplasma": false
}
```

---

### 4. Sessões (P1, P2, Long, etc)

**JSON esperado:**
```json
"sessoes": [
  {
    "tipo": "P1",
    "datas": ["15/10", "22/10", "29/10", "5/11"]
  },
  {
    "tipo": "Long",
    "datas": ["19/10", "25/10"]
  }
]
```

**O que buscar:**
- Tabela com linhas: P1, P2, P3A, P3B, Long, P4, P5, P6, P7, P8
- Cada linha pode ter até 4 colunas com datas

---

## 🛠️ Como Personalizar o Prompt

### Passo 1: Abrir o Arquivo
```bash
C:\Clinicaalma\server\routes\ocr-chatgpt.js
```

### Passo 2: Localizar o Prompt
Procure por:
```javascript
const PROMPT_FICHA_FRENTE = `...`
```

### Passo 3: Adicionar Instruções Específicas

**Exemplo - Melhorar captura da Apometria:**

```javascript
1. **APOMETRIA** - Esta seção tem 3 perguntas:
   - Linha 1: "Apometria?"
     * □ Energética ☒ Convencional
     * Se nenhum marcado: "tipo": null

   - Linha 2: "Urgente?"
     * □ Sim ☒ Não
     * Capture exatamente qual tem X ou ☒

   - IMPORTANTE:
     * Se "Apometria?" tiver "Sim" marcado → "realizar": true
     * Se "Apometria?" tiver "Não" marcado → "realizar": false
```

---

## 📖 Exemplos de Customização

### Exemplo 1: Adicionar Novo Campo

Se a ficha tiver um novo checkbox "Harmonização", adicione:

```javascript
// No JSON esperado:
"harmonizacao": boolean,

// Nas instruções:
6. **HARMONIZAÇÃO** - Procure checkbox com texto "Harmonização"
   - Se marcado com X ou ☒ → true
   - Caso contrário → false
```

### Exemplo 2: Capturar Texto Específico

Se quiser capturar melhor as "Indicações Específicas":

```javascript
7. **INDICAÇÕES ESPECÍFICAS**
   - Esta seção está na parte inferior da ficha
   - Leia TODO o texto manuscrito (escrito à mão)
   - Inclua anotações nas margens
   - Inclua textos destacados ou sublinhados
   - Capture exatamente como está escrito
```

---

## 🧪 Como Testar Alterações

### 1. Editar o Prompt
```bash
# Edite o arquivo
notepad C:\Clinicaalma\server\routes\ocr-chatgpt.js
```

### 2. Reiniciar Servidor
```bash
# Ctrl+C no terminal onde o servidor está rodando
npm run server
```

### 3. Recompilar Frontend (se alterou interface)
```bash
npm run build
```

### 4. Testar
```
1. Acesse http://localhost:3001
2. Nova Ficha → Upload → 🤖 ChatGPT
3. Verifique os dados extraídos
4. Compare com a ficha original
```

---

## 💡 Dicas para Melhorar a Precisão

### ✅ Boas Práticas

1. **Seja específico sobre localização**
   ```
   ❌ "Procure o campo Apometria"
   ✅ "Na seção inferior esquerda, procure 'Apometria?' com checkboxes Energética/Convencional"
   ```

2. **Descreva marcações visuais**
   ```
   ❌ "Veja se está marcado"
   ✅ "Procure X, ☒, ✓ ou ✔ dentro do checkbox"
   ```

3. **Dê exemplos**
   ```
   "Exemplo de captura correta:
   - Se vir '☒ Convencional', retorne: {\"tipo\": \"Convencional\"}
   - Se vir '□ Energética', retorne: {\"tipo\": null}"
   ```

4. **Use estruturas claras**
   ```json
   // Objeto aninhado é melhor que arrays
   ✅ "evocacao": { "emocional": true, "espiritual": false }
   ❌ "evocacao": ["emocional"]
   ```

---

## 📊 Campos Já Treinados

### ✅ Funcionando Bem
- [x] Nome, idade, endereço
- [x] Telefones, email
- [x] Código do consulente
- [x] **Apometria** (corrigido!)
- [x] Sessões (P1, P2, Long, etc)
- [x] Indicações específicas
- [x] Responsáveis

### ⚠️ Precisa Atenção
- [ ] Datas em formatos diferentes (DD/MM vs DD/MM/AA)
- [ ] Checkboxes muito pequenos ou apagados
- [ ] Texto manuscrito muito ilegível

---

## 🔍 Debugging

### Ver o que o ChatGPT retornou

Olhe o console do servidor:
```bash
✅ Dados capturados da FRENTE: {
  "apometria": {
    "realizar": true,
    "tipo": "Convencional",
    "urgente": false
  }
}
```

### Se algo estiver errado:

1. **Verifique a ficha original**
   - O checkbox está marcado?
   - Está visível na imagem?

2. **Ajuste o prompt**
   - Seja mais específico
   - Dê exemplos

3. **Teste novamente**

---

## 📞 Perguntas Frequentes

### Q: Posso treinar para reconhecer caligrafia específica?
**R:** O ChatGPT já é muito bom com manuscrito. Se houver problemas recorrentes, adicione exemplos específicos no prompt.

### Q: E se a ficha tiver layout diferente?
**R:** Ajuste as instruções de localização ("seção superior esquerda", "abaixo dos dados pessoais", etc).

### Q: Posso adicionar validações?
**R:** Sim! Adicione no backend (server/routes/fichas.js) validações extras após o ChatGPT processar.

### Q: Como salvar múltiplas versões de prompt?
**R:** Faça backup do arquivo antes de editar:
```bash
copy ocr-chatgpt.js ocr-chatgpt.backup.js
```

---

## 🎯 Resultado Esperado

Com o prompt atual, você deve ver:

```json
{
  "apometria": {
    "realizar": true,
    "tipo": "Convencional",
    "urgente": false
  },
  "evocacao": {
    "emocional": false,
    "espiritual": true,
    "fisica": false
  },
  "campo_protecao": {
    "casa": true,
    "consciente": false,
    "casa_consulente": true
  }
}
```

**Pronto para usar! 🚀**

---

**Precisa de ajuda para treinar um campo específico? Me avise qual campo e como ele aparece na ficha!**
