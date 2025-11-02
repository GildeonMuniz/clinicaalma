const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

// =================== CONFIG UPLOAD ===================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens (JPEG, PNG) são permitidas!'));
    }
  }
});

// =================== OPENAI HELPERS ===================
function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

function encodeImageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

// Parser robusto para extrair JSON mesmo quando vem em bloco markdown
function extractJSONFromText(text) {
  const jsonRegex = /```(?:json)?([\s\S]*?)```|(\{[\s\S]*\})/;
  const match = text.match(jsonRegex);
  if (!match) return null;
  const jsonString = match[1] || match[2];
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Erro ao parsear JSON:", e);
    return null;
  }
}

// =================== PROMPTS ===================
const PROMPT_FICHA_FRENTE = `Você está lendo a FRENTE de uma ficha de atendimento de uma clínica espiritual. A imagem contém texto impresso e manuscrito. Seu trabalho é extrair todas as informações visíveis.

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

Leia com atenção tudo que estiver escrito à mão, mesmo que esteja fora da estrutura. Retorne apenas o JSON sem explicações adicionais.`;

const PROMPT_FICHA_COSTA = `Você está analisando a parte de TRÁS (COSTA) da ficha de uma clínica espiritual. Ela contém prescrições, recomendações e observações. Leia todos os checkboxes e textos manuscritos com atenção.

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

Retorne apenas o JSON, sem comentários ou explicações adicionais.`;

// =================== ENDPOINTS ===================
router.post('/ficha-completa-gpt', upload.fields([
  { name: 'ficha_frente', maxCount: 1 },
  { name: 'ficha_costa', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'API Key da OpenAI não configurada. Configure OPENAI_API_KEY no arquivo .env'
      });
    }

    if (!req.files || !req.files.ficha_frente || !req.files.ficha_costa) {
      return res.status(400).json({ error: 'Ambas as fichas (frente e costa) devem ser enviadas' });
    }

    console.log('🤖 Processando fichas com ChatGPT...');
    const openai = getOpenAI();

    // --- Frente ---
    const fichaFrente = req.files.ficha_frente[0];
    console.log('📄 Analisando ficha frente:', fichaFrente.filename);
    const imageFrenteBase64 = encodeImageToBase64(fichaFrente.path);

    const responseFrente = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT_FICHA_FRENTE },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageFrenteBase64}` } }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    });

    const textFrenteResponse = responseFrente.choices[0].message.content;
    const dataFrente = extractJSONFromText(textFrenteResponse) || {};
  console.log('✅ Dados capturados da FRENTE:', JSON.stringify(dataFrente, null, 2));
    // --- Costa ---
    const fichaCosta = req.files.ficha_costa[0];
    console.log('📄 Analisando ficha costa:', fichaCosta.filename);
    const imageCostaBase64 = encodeImageToBase64(fichaCosta.path);

    const responseCosta = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT_FICHA_COSTA },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageCostaBase64}` } }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    });

    const textCostaResponse = responseCosta.choices[0].message.content;
    const dataCosta = extractJSONFromText(textCostaResponse) || {};
  console.log('✅ Dados capturados da COSTA:', JSON.stringify(dataCosta, null, 2));
    res.json({
      success: true,
      method: 'chatgpt',
      ficha_frente: {
        filename: fichaFrente.filename,
        url: `/uploads/${fichaFrente.filename}`,
        data: dataFrente,
        raw_response: textFrenteResponse
      },
      ficha_costa: {
        filename: fichaCosta.filename,
        url: `/uploads/${fichaCosta.filename}`,
        data: dataCosta,
        raw_response: textCostaResponse
      },
      extractedData: {
        ...dataFrente,
        tratamento: dataCosta
      }
    });

  } catch (error) {
    console.error('❌ Erro ao processar com ChatGPT:', error);
    res.status(500).json({ error: 'Erro ao processar imagens com ChatGPT', details: error.message });
  }
});

router.post('/ficha-frente-gpt', upload.single('ficha'), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'API Key da OpenAI não configurada' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    console.log('🤖 Processando ficha frente com ChatGPT:', req.file.filename);
    const imageBase64 = encodeImageToBase64(req.file.path);
    const openai = getOpenAI();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT_FICHA_FRENTE },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    });

    const textResponse = response.choices[0].message.content;
    const extractedData = extractJSONFromText(textResponse) || {};

    console.log('✅ Dados capturados da FRENTE (apenas frente):', JSON.stringify(extractedData, null, 2));

    res.json({
      success: true,
      method: 'chatgpt',
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      extractedData,
      raw_response: textResponse
    });

  } catch (error) {
    console.error('Erro ao processar com ChatGPT:', error);
    res.status(500).json({ error: 'Erro ao processar imagem', details: error.message });
  }
});

module.exports = router;
