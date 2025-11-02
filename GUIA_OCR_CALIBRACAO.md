# Guia de Calibração e Otimização do OCR Tesseract

## Melhorias Implementadas

O sistema OCR do Tesseract foi **significativamente otimizado** com as seguintes melhorias:

### 1. Pré-processamento Avançado de Imagens

O sistema agora utiliza **4 modos diferentes** de processamento de imagem:

#### **Modo Adaptativo** (Padrão)
- Detecta automaticamente a qualidade da imagem
- Ajusta parâmetros baseado na resolução
- Imagens baixa qualidade (< 1500px): processamento agressivo
- Imagens alta qualidade: processamento suave

#### **Modo Alto Contraste** (high-contrast)
- Ideal para documentos escaneados com baixo contraste
- Aumenta contraste em 50%
- Binarização em threshold 140
- Melhor para fichas com tinta fraca ou desbotada

#### **Modo Redução de Ruído** (denoised)
- Ideal para imagens com manchas, sujeira ou ruído
- Filtro mediano forte (5px)
- Remove artefatos e imperfeições
- Melhor para fichas antigas ou sujas

#### **Modo Padrão** (default)
- Processamento balanceado
- Funciona bem para a maioria dos casos
- Redimensiona para 3200px
- Contraste aumentado em 40%

### 2. Configurações Otimizadas do Tesseract

```javascript
Parâmetros configurados:
- tessedit_pageseg_mode: AUTO (detecção automática de layout)
- tessedit_ocr_engine_mode: LSTM_ONLY (motor mais preciso)
- tessedit_char_whitelist: Caracteres permitidos em português
- preserve_interword_spaces: Preserva espaços entre palavras
```

### 3. Sistema Multi-Tentativa Inteligente

O OCR agora tenta **até 3 modos diferentes** e escolhe o resultado com **maior confiança**:

1. Tenta modo adaptativo
2. Se confiança < 90%, tenta alto contraste
3. Se ainda < 90%, tenta redução de ruído
4. Retorna o melhor resultado

### 4. Melhorias nas Expressões Regulares

Agora detecta múltiplos formatos de checkbox:
- `[x]` - Checkbox texto
- `x`, `X` - Letra x
- `✓`, `✔`, `☑` - Símbolos de check

Novos campos detectados:
- `apometria_realizar` - Se deve realizar apometria
- `apometria_tipo` - "Convencional" ou "Energética"
- `apometria_urgente` - Flag de urgência
- `evocacao_emocional`, `evocacao_espiritual`, `evocacao_fisica`
- `campo_protecao_casa`, `campo_protecao_consciente`, `campo_protecao_casa_consulente`

## Como Usar

### Teste o OCR Melhorado

1. **Reinicie o servidor:**
```bash
cd c:\Clinicaalma
npm run dev
```

2. **Faça upload de uma ficha** através da interface web em `http://localhost:3000/nova-ficha`

3. **Verifique a confiança** retornada no console:
```
✅ OCR concluído - Confiança: 87.34%
```

### Indicadores de Qualidade

| Confiança | Qualidade | Ação Recomendada |
|-----------|-----------|------------------|
| > 90% | Excelente | Dados podem ser confiáveis |
| 80-90% | Boa | Revisar campos importantes |
| 70-80% | Regular | Revisar todos os campos |
| < 70% | Baixa | Melhorar qualidade da imagem |

## Dicas para Melhor Qualidade

### Para o Scanner/Foto

1. **Resolução mínima:** 300 DPI
2. **Iluminação:** Uniforme, sem sombras
3. **Foco:** Imagem nítida, sem desfoque
4. **Contraste:** Documento limpo, tinta preta em papel branco
5. **Ângulo:** Documento reto, sem inclinação
6. **Formato:** PNG ou JPEG de alta qualidade

### Se a Qualidade Estiver Baixa

#### Problema: Texto muito claro ou desbotado
**Solução:** O modo "alto contraste" será automaticamente tentado

#### Problema: Imagem com manchas ou ruído
**Solução:** O modo "redução de ruído" será automaticamente tentado

#### Problema: Imagem pequena (< 1500px)
**Solução:** O modo adaptativo aumentará resolução para 4000px

#### Problema: Documento inclinado
**Solução:** Tente escanear novamente com documento reto

## Calibração Manual (Avançado)

Se quiser ajustar manualmente os parâmetros, edite o arquivo:
`server/routes/ocr.js`

### Ajustar Threshold (Binarização)

Linha 133:
```javascript
.threshold(135)  // Valores: 100-180
                 // Menor = mais pixels pretos
                 // Maior = mais pixels brancos
```

### Ajustar Contraste

Linha 131:
```javascript
.linear(1.4, -(128 * 1.4) + 128)  // 1.4 = 40% mais contraste
                                   // Valores: 1.0 a 2.0
```

### Ajustar Nitidez

Linha 129:
```javascript
.sharpen({ sigma: 1.2 })  // Valores: 0.5 a 2.0
                          // Maior = mais nitidez
```

### Ajustar Redução de Ruído

Linha 130:
```javascript
.median(3)  // Valores: 1 a 9
            // Maior = mais suavização
```

## Logs de Diagnóstico

O sistema agora exibe logs detalhados:

```
📄 Processando ficha frente: 1234567890-ficha.jpg
   Tentando modo: adaptive
   OCR Progress: 25%
   OCR Progress: 50%
   OCR Progress: 75%
   OCR Progress: 100%
   Confiança (adaptive): 85.67%
   Tentando modo: high-contrast
   OCR Progress: 100%
   Confiança (high-contrast): 91.23%
   ✓ Alta confiança alcançada (91.23%)
   Melhor resultado: 91.23% de confiança
✅ OCR concluído - Confiança: 91.23%
📋 Dados extraídos da frente: 18 campos preenchidos
```

## Monitoramento de Performance

### Tempos Esperados

- **Modo único:** 3-5 segundos por ficha
- **Multi-tentativa (2 modos):** 6-10 segundos
- **Multi-tentativa (3 modos):** 9-15 segundos

### Memória

- Cada worker Tesseract: ~100-200MB RAM
- Sharp (processamento): ~50-100MB RAM
- Total estimado: ~500MB RAM durante OCR

## Próximos Passos (Opcional)

Para melhorias futuras, considere:

1. **Treinamento customizado do Tesseract**
   - Criar dataset específico para suas fichas
   - Treinar modelo LSTM personalizado
   - Precisão pode chegar a 95-98%

2. **API de OCR comercial como fallback**
   - Google Cloud Vision API
   - Microsoft Azure Computer Vision
   - AWS Textract

3. **Pré-processamento com IA**
   - Usar modelos de ML para correção de inclinação
   - Detecção de borda automática
   - Remoção de sombras

## Suporte

Se continuar com problemas:

1. Verifique os logs no console do servidor
2. Teste com imagens de diferentes qualidades
3. Ajuste manualmente os parâmetros (veja seção acima)
4. Considere usar a opção "Pular OCR" e preencher manualmente

---

**Versão:** 2.0
**Data:** Janeiro 2025
**Motor OCR:** Tesseract.js 5.0.4 + Sharp 0.33.2
