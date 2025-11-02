# 🤖 Prompts OCR para Backend .NET 8

Este documento contém os prompts completos usados para extrair dados das fichas usando GPT-4 Vision.

---

## 📋 Estrutura de Implementação

### Modelo Recomendado
```
gpt-4o (GPT-4 Omni)
```

### Configurações
```csharp
Temperature: 0.1f        // Baixa aleatoriedade para maior precisão
MaxTokens: 2000          // Suficiente para JSON completo
```

---

## 📄 PROMPT 1: FICHA FRENTE

### Descrição
Extrai dados da **frente** da ficha de atendimento (dados pessoais, apometria, sessões, etc.)

### Prompt Completo

```
Você está lendo a FRENTE de uma ficha de atendimento de uma clínica espiritual. A imagem contém texto impresso e manuscrito. Seu trabalho é extrair todas as informações visíveis.

IMPORTANTE: Leia com atenção todos os campos, inclusive os manuscritos à mão (ex: datas de sessões, observações, responsáveis). Retorne um JSON com a estrutura abaixo. Preencha com os dados disponíveis. Se algum campo não puder ser lido, use null.

{
  "codigo_consulente": string | null,
  "nome": string | null,
  "idade": number | null,
  "endereco": string | null,
  "bairro": string | null,
  "cidade": string | null,
  "estado": string | null,
  "cep": string | null,
  "telefone_fixo": string | null,
  "celular": string | null,
  "email": string | null,
  "data_cadastro": "DD/MM/AAAA" | null,
  "passes_humano_espirituais": string[] | null,
  "passes_magneticos": string[] | null,
  "sessoes": [
    {
      "tipo": string,
      "datas": string[]
    }
  ],
  "bioenergia": boolean,
  "apometria": {
    "realizar": boolean (Sim ou Não marcado na pergunta "Apometria?"),
    "tipo": "Energética" | "Convencional" | null (qual está marcado),
    "urgente": boolean (Sim ou Não marcado na pergunta "Urgente?")
  },
  "evocacao": {
    "emocional": boolean,
    "espiritual": boolean,
    "fisica": boolean
  },
  "campo_protecao": {
    "casa": boolean,
    "consciente": boolean,
    "casa_consulente": boolean
  },
  "exclusivo_tratamento_medico": {
    "procedimentos_especiais": boolean,
    "limpeza_energetica": boolean,
    "limpeza_energetica_campo_protecao": boolean,
    "ectoplasma": boolean
  },
  "indicacoes_especificas": string | null,
  "responsavel_preenchimento": string | null,
  "responsavel_orientacao": string | null
}

INSTRUÇÕES ESPECÍFICAS PARA CADA SEÇÃO:

1. **APOMETRIA** - Esta seção tem 3 perguntas:
   - "Apometria?" com opções □ Energética ☒ Convencional → capture qual está marcado no campo "tipo"
   - "Urgente?" com opções □ Sim ☒ Não → capture true/false no campo "urgente"
   - Se houver "□ Sim ☒ Não" na linha "Apometria?" → "realizar": false

2. **EVOCAÇÃO** - Retorne um objeto com 3 booleanos (emocional, espiritual, fisica) indicando quais estão marcados

3. **CAMPO DE PROTEÇÃO** - Retorne um objeto com 3 booleanos (casa, consciente, casa_consulente)

4. **SESSÕES** - Na tabela, cada linha (P1, P2, Long, etc) tem colunas com datas. Capture todas as datas visíveis para cada tipo de sessão.

5. **INDICAÇÕES ESPECÍFICAS** - Leia TODO o texto manuscrito desta seção, inclusive anotações nas margens

Leia com atenção tudo que estiver escrito à mão, mesmo que esteja fora da estrutura. Retorne apenas o JSON sem explicações adicionais.
```

---

## 📄 PROMPT 2: FICHA COSTA

### Descrição
Extrai dados da **costa** (verso) da ficha de atendimento (tratamentos, prescrições, recomendações)

### Prompt Completo

```
Você está analisando a parte de TRÁS (COSTA) da ficha de uma clínica espiritual. Ela contém prescrições, recomendações e observações. Leia todos os checkboxes e textos manuscritos com atenção.

Retorne um JSON com a seguinte estrutura:

{
  "agua_magnetizada": boolean,
  "agua_magnetizada_detalhes": string | null,
  "agua_viva": boolean,
  "gotas": boolean,
  "gotas_prescricao": string | null,
  "gel": boolean,
  "banho": boolean,
  "escalda_pes": boolean,
  "floral_rescue": boolean,
  "atendimento_terapeutico_pnl": boolean,
  "conversa_fraterna": boolean,
  "terapia_florais": boolean,
  "culto_evangelho_lar": boolean,
  "colegiado_guardioes": boolean,
  "reuniao_pais_velhos_caboclos": boolean,
  "reuniao_pais_velhos_caboclos_data": string | null,
  "leitura_recomendada": string | null,
  "orientacoes_complementares": string | null,
  "observacoes": string | null,
  "outros_itens_marcados": string[] | null
}

Observações:
- Extraia todos os textos escritos à mão com o máximo de fidelidade.
- Se existirem campos riscados, ainda tente reconhecer o que está escrito.
- "outros_itens_marcados" deve listar qualquer outro checkbox marcado que não esteja previsto na estrutura acima.

Retorne apenas o JSON, sem comentários ou explicações adicionais.
```

---

## 💻 Implementação C# - Exemplo Completo

### 1. Método para Processar Ficha Completa

```csharp
[HttpPost("ficha-completa")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> ProcessarFichaCompleta(
    IFormFile ficha_frente,
    IFormFile ficha_costa)
{
    try
    {
        if (ficha_frente == null || ficha_costa == null)
        {
            return BadRequest(new { error = "Ambas as fichas (frente e costa) devem ser enviadas" });
        }

        // 1. Salvar arquivos (Firebase Storage ou local)
        var urlFrente = await _storageService.UploadFileAsync(ficha_frente);
        var urlCosta = await _storageService.UploadFileAsync(ficha_costa);

        // 2. Processar OCR da frente
        var dadosFrente = await ProcessarFichaFrenteAsync(ficha_frente);

        // 3. Processar OCR da costa
        var dadosCosta = await ProcessarFichaCostaAsync(ficha_costa);

        // 4. Retornar resposta no formato esperado pelo frontend
        return Ok(new
        {
            frente = new
            {
                data = dadosFrente,
                fileUrl = urlFrente
            },
            costa = new
            {
                data = dadosCosta,
                fileUrl = urlCosta
            }
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Erro ao processar fichas");
        return StatusCode(500, new { error = "Erro ao processar fichas", details = ex.Message });
    }
}
```

### 2. Método para Processar Frente

```csharp
private async Task<FichaFrenteData> ProcessarFichaFrenteAsync(IFormFile file)
{
    // Converter para Base64
    using var memoryStream = new MemoryStream();
    await file.CopyToAsync(memoryStream);
    var base64Image = Convert.ToBase64String(memoryStream.ToArray());

    // Chamar OpenAI API
    var chatCompletionsOptions = new ChatCompletionsOptions
    {
        DeploymentName = "gpt-4o",
        Messages =
        {
            new ChatRequestUserMessage(
                new ChatMessageTextContentItem(PROMPT_FICHA_FRENTE),
                new ChatMessageImageContentItem(new Uri($"data:image/jpeg;base64,{base64Image}"))
            )
        },
        MaxTokens = 2000,
        Temperature = 0.1f
    };

    var response = await _openAIClient.GetChatCompletionsAsync(chatCompletionsOptions);
    var jsonText = response.Value.Choices[0].Message.Content;

    // Extrair JSON (pode vir em bloco markdown ```json ... ```)
    var json = ExtractJsonFromText(jsonText);

    // Deserializar para objeto C#
    return JsonSerializer.Deserialize<FichaFrenteData>(json);
}
```

### 3. Método para Processar Costa

```csharp
private async Task<FichaCostaData> ProcessarFichaCostaAsync(IFormFile file)
{
    using var memoryStream = new MemoryStream();
    await file.CopyToAsync(memoryStream);
    var base64Image = Convert.ToBase64String(memoryStream.ToArray());

    var chatCompletionsOptions = new ChatCompletionsOptions
    {
        DeploymentName = "gpt-4o",
        Messages =
        {
            new ChatRequestUserMessage(
                new ChatMessageTextContentItem(PROMPT_FICHA_COSTA),
                new ChatMessageImageContentItem(new Uri($"data:image/jpeg;base64,{base64Image}"))
            )
        },
        MaxTokens = 2000,
        Temperature = 0.1f
    };

    var response = await _openAIClient.GetChatCompletionsAsync(chatCompletionsOptions);
    var jsonText = response.Value.Choices[0].Message.Content;
    var json = ExtractJsonFromText(jsonText);

    return JsonSerializer.Deserialize<FichaCostaData>(json);
}
```

### 4. Helper para Extrair JSON

```csharp
private string ExtractJsonFromText(string text)
{
    // GPT pode retornar JSON em bloco markdown: ```json { ... } ```
    var jsonRegex = new Regex(@"```(?:json)?([\s\S]*?)```|(\{[\s\S]*\})");
    var match = jsonRegex.Match(text);

    if (!match.Success)
        return text;

    return match.Groups[1].Success ? match.Groups[1].Value : match.Groups[2].Value;
}
```

---

## 📦 Classes de Modelo (DTOs)

### FichaFrenteData.cs

```csharp
public class FichaFrenteData
{
    [JsonPropertyName("codigo_consulente")]
    public string? CodigoConsulente { get; set; }

    [JsonPropertyName("nome")]
    public string? Nome { get; set; }

    [JsonPropertyName("idade")]
    public int? Idade { get; set; }

    [JsonPropertyName("endereco")]
    public string? Endereco { get; set; }

    [JsonPropertyName("bairro")]
    public string? Bairro { get; set; }

    [JsonPropertyName("cidade")]
    public string? Cidade { get; set; }

    [JsonPropertyName("estado")]
    public string? Estado { get; set; }

    [JsonPropertyName("cep")]
    public string? Cep { get; set; }

    [JsonPropertyName("telefone_fixo")]
    public string? TelefoneFixo { get; set; }

    [JsonPropertyName("celular")]
    public string? Celular { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("data_cadastro")]
    public string? DataCadastro { get; set; }

    [JsonPropertyName("passes_humano_espirituais")]
    public List<string>? PassesHumanoEspirituais { get; set; }

    [JsonPropertyName("passes_magneticos")]
    public List<string>? PassesMagneticos { get; set; }

    [JsonPropertyName("sessoes")]
    public List<SessaoData>? Sessoes { get; set; }

    [JsonPropertyName("bioenergia")]
    public bool Bioenergia { get; set; }

    [JsonPropertyName("apometria")]
    public ApometriaData? Apometria { get; set; }

    [JsonPropertyName("evocacao")]
    public EvocacaoData? Evocacao { get; set; }

    [JsonPropertyName("campo_protecao")]
    public CampoProtecaoData? CampoProtecao { get; set; }

    [JsonPropertyName("exclusivo_tratamento_medico")]
    public ExclusivoTratamentoData? ExclusivoTratamentoMedico { get; set; }

    [JsonPropertyName("indicacoes_especificas")]
    public string? IndicacoesEspecificas { get; set; }

    [JsonPropertyName("responsavel_preenchimento")]
    public string? ResponsavelPreenchimento { get; set; }

    [JsonPropertyName("responsavel_orientacao")]
    public string? ResponsavelOrientacao { get; set; }
}

public class SessaoData
{
    [JsonPropertyName("tipo")]
    public string? Tipo { get; set; }

    [JsonPropertyName("datas")]
    public List<string>? Datas { get; set; }
}

public class ApometriaData
{
    [JsonPropertyName("realizar")]
    public bool Realizar { get; set; }

    [JsonPropertyName("tipo")]
    public string? Tipo { get; set; } // "Energética" ou "Convencional"

    [JsonPropertyName("urgente")]
    public bool Urgente { get; set; }
}

public class EvocacaoData
{
    [JsonPropertyName("emocional")]
    public bool Emocional { get; set; }

    [JsonPropertyName("espiritual")]
    public bool Espiritual { get; set; }

    [JsonPropertyName("fisica")]
    public bool Fisica { get; set; }
}

public class CampoProtecaoData
{
    [JsonPropertyName("casa")]
    public bool Casa { get; set; }

    [JsonPropertyName("consciente")]
    public bool Consciente { get; set; }

    [JsonPropertyName("casa_consulente")]
    public bool CasaConsulente { get; set; }
}

public class ExclusivoTratamentoData
{
    [JsonPropertyName("procedimentos_especiais")]
    public bool ProcedimentosEspeciais { get; set; }

    [JsonPropertyName("limpeza_energetica")]
    public bool LimpezaEnergetica { get; set; }

    [JsonPropertyName("limpeza_energetica_campo_protecao")]
    public bool LimpezaEnergeticaCampoProtecao { get; set; }

    [JsonPropertyName("ectoplasma")]
    public bool Ectoplasma { get; set; }
}
```

### FichaCostaData.cs

```csharp
public class FichaCostaData
{
    [JsonPropertyName("agua_magnetizada")]
    public bool AguaMagnetizada { get; set; }

    [JsonPropertyName("agua_magnetizada_detalhes")]
    public string? AguaMagnetizadaDetalhes { get; set; }

    [JsonPropertyName("agua_viva")]
    public bool AguaViva { get; set; }

    [JsonPropertyName("gotas")]
    public bool Gotas { get; set; }

    [JsonPropertyName("gotas_prescricao")]
    public string? GotasPrescricao { get; set; }

    [JsonPropertyName("gel")]
    public bool Gel { get; set; }

    [JsonPropertyName("banho")]
    public bool Banho { get; set; }

    [JsonPropertyName("escalda_pes")]
    public bool EscaldaPes { get; set; }

    [JsonPropertyName("floral_rescue")]
    public bool FloralRescue { get; set; }

    [JsonPropertyName("atendimento_terapeutico_pnl")]
    public bool AtendimentoTerapeuticoPNL { get; set; }

    [JsonPropertyName("conversa_fraterna")]
    public bool ConversaFraterna { get; set; }

    [JsonPropertyName("terapia_florais")]
    public bool TerapiaFlorais { get; set; }

    [JsonPropertyName("culto_evangelho_lar")]
    public bool CultoEvangelhoLar { get; set; }

    [JsonPropertyName("colegiado_guardioes")]
    public bool ColegiadoGuardioes { get; set; }

    [JsonPropertyName("reuniao_pais_velhos_caboclos")]
    public bool ReuniaoPaisVelhosCaboclos { get; set; }

    [JsonPropertyName("reuniao_pais_velhos_caboclos_data")]
    public string? ReuniaoPaisVelhosCaboclosData { get; set; }

    [JsonPropertyName("leitura_recomendada")]
    public string? LeituraRecomendada { get; set; }

    [JsonPropertyName("orientacoes_complementares")]
    public string? OrientacoesComplementares { get; set; }

    [JsonPropertyName("observacoes")]
    public string? Observacoes { get; set; }

    [JsonPropertyName("outros_itens_marcados")]
    public List<string>? OutrosItensMarcados { get; set; }
}
```

---

## ⚙️ Configuração no appsettings.json

```json
{
  "OpenAI": {
    "ApiKey": "sk-proj-...",
    "Endpoint": "https://api.openai.com/v1",
    "Model": "gpt-4o"
  }
}
```

---

## 🔑 Pacotes NuGet Necessários

```bash
dotnet add package Azure.AI.OpenAI --version 1.0.0-beta.12
dotnet add package System.Text.Json
```

---

## 📊 Formato de Resposta Esperado pelo Frontend

```json
{
  "frente": {
    "data": {
      "nome": "DANIEL BORDIN SCHUMACHER",
      "idade": 49,
      "codigo_consulente": "12",
      "bioenergia": false,
      "apometria": {
        "realizar": false,
        "tipo": null,
        "urgente": false
      }
    },
    "fileUrl": "https://api.muniz.vps-kinghost.net/api/files/abc123"
  },
  "costa": {
    "data": {
      "agua_magnetizada": true,
      "gotas": false
    },
    "fileUrl": "https://api.muniz.vps-kinghost.net/api/files/def456"
  }
}
```

---

## 🧪 Testando os Prompts

### Curl de Teste

```bash
curl -X POST https://api.muniz.vps-kinghost.net/api/ocr/ficha-completa \
  -F "ficha_frente=@ficha-frente.jpg" \
  -F "ficha_costa=@ficha-costa.jpg"
```

### Exemplo de Log (sucesso)

```
🤖 Processando ficha frente...
✅ Dados extraídos da frente: { "nome": "...", "idade": 49 }
🤖 Processando ficha costa...
✅ Dados extraídos da costa: { "agua_magnetizada": true }
```

---

## 📝 Notas Importantes

1. **API Key**: Obtenha em https://platform.openai.com/api-keys
2. **Custo**: GPT-4 Vision tem custo por token. Monitore o uso!
3. **Timeout**: Configure timeout adequado (2-3 minutos)
4. **Logs**: Sempre logue as respostas do GPT para debug
5. **Validação**: Valide o JSON retornado antes de deserializar

---

## 🔗 Referências

- [OpenAI Vision API Docs](https://platform.openai.com/docs/guides/vision)
- [Azure.AI.OpenAI NuGet](https://www.nuget.org/packages/Azure.AI.OpenAI)
- [TREINAR_CHATGPT.md](TREINAR_CHATGPT.md) - Guia de treinamento detalhado

---

**Última atualização:** 2025-11-02
**Testado com:** GPT-4 Omni (gpt-4o)
**Status:** ✅ Funcionando no backend Node.js
