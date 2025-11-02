const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');

// Configurar multer para upload de arquivos
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
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens (JPEG, PNG) são permitidas!'));
    }
  }
});

// Função para processar imagem e melhorar qualidade para OCR
// Retorna múltiplas versões processadas para tentar diferentes abordagens
async function preprocessImage(imagePath, mode = 'default') {
  const processedPath = imagePath.replace(/(\.\w+)$/, `-processed-${mode}$1`);

  // Obter metadados da imagem
  const metadata = await sharp(imagePath).metadata();
  const isLowQuality = metadata.width < 1500 || metadata.height < 1500;

  switch(mode) {
    case 'high-contrast':
      // Melhor para documentos escaneados com baixo contraste
      await sharp(imagePath)
        .resize(3500, null, {
          fit: 'inside',
          kernel: sharp.kernel.lanczos3, // Melhor qualidade de interpolação
          withoutEnlargement: false
        })
        .greyscale()
        .normalize() // Normalizar níveis de brilho
        .linear(1.5, -(128 * 1.5) + 128) // Aumentar contraste
        .sharpen({ sigma: 1.5 }) // Aumentar nitidez
        .median(3) // Reduzir ruído
        .threshold(140) // Binarização adaptativa
        .toFile(processedPath);
      break;

    case 'denoised':
      // Melhor para imagens com muito ruído ou manchas
      await sharp(imagePath)
        .resize(3500, null, {
          fit: 'inside',
          kernel: sharp.kernel.lanczos3,
          withoutEnlargement: false
        })
        .greyscale()
        .median(5) // Forte redução de ruído
        .normalize()
        .sharpen({ sigma: 1.2 })
        .linear(1.3, -(128 * 1.3) + 128)
        .threshold(135)
        .toFile(processedPath);
      break;

    case 'adaptive':
      // Processamento adaptativo baseado na qualidade da imagem
      const sharpInstance = sharp(imagePath)
        .resize(isLowQuality ? 4000 : 3200, null, {
          fit: 'inside',
          kernel: sharp.kernel.lanczos3,
          withoutEnlargement: false
        })
        .greyscale()
        .normalize();

      if (isLowQuality) {
        // Processamento mais agressivo para imagens de baixa qualidade
        await sharpInstance
          .convolve({
            width: 3,
            height: 3,
            kernel: [-1, -1, -1, -1, 9, -1, -1, -1, -1] // Filtro de nitidez
          })
          .median(4)
          .linear(1.6, -(128 * 1.6) + 128)
          .threshold(145)
          .toFile(processedPath);
      } else {
        // Processamento mais suave para imagens de boa qualidade
        await sharpInstance
          .sharpen({ sigma: 1.0 })
          .median(2)
          .linear(1.3, -(128 * 1.3) + 128)
          .threshold(130)
          .toFile(processedPath);
      }
      break;

    case 'default':
    default:
      // Processamento padrão balanceado
      await sharp(imagePath)
        .resize(3200, null, {
          fit: 'inside',
          kernel: sharp.kernel.lanczos3,
          withoutEnlargement: false
        })
        .greyscale()
        .normalize()
        .sharpen({ sigma: 1.2 })
        .median(3)
        .linear(1.4, -(128 * 1.4) + 128)
        .threshold(135)
        .toFile(processedPath);
      break;
  }

  return processedPath;
}

// Função para executar OCR com configurações otimizadas
async function performOCR(imagePath, lang = 'por') {
  const processedPaths = [];

  try {
    // Criar worker do Tesseract com configurações otimizadas
    const worker = await Tesseract.createWorker(lang, 1, {
      logger: info => {
        if (info.status === 'recognizing text') {
          console.log(`   OCR Progress: ${Math.round(info.progress * 100)}%`);
        }
      }
    });

    // Configurar parâmetros do Tesseract para melhor precisão
    await worker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.AUTO, // Detecção automática de layout
      tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY, // Usar apenas LSTM (mais preciso)
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÇÉÊÍÓÔÕÚàáâãçéêíóôõú0123456789 .,;:!?()[]{}@#$%&*+-=/\\|_\'"<>\n\t',
      preserve_interword_spaces: '1',
      tessedit_do_invert: '0'
    });

    let bestResult = null;
    let bestConfidence = 0;
    const modes = ['adaptive', 'high-contrast', 'denoised'];

    // Tentar diferentes modos de pré-processamento
    for (const mode of modes) {
      console.log(`   Tentando modo: ${mode}`);

      const processedPath = await preprocessImage(imagePath, mode);
      processedPaths.push(processedPath);

      const result = await worker.recognize(processedPath);

      console.log(`   Confiança (${mode}): ${result.data.confidence.toFixed(2)}%`);

      // Usar o resultado com maior confiança
      if (result.data.confidence > bestConfidence) {
        bestConfidence = result.data.confidence;
        bestResult = result;
      }

      // Se obteve confiança muito alta, pode parar
      if (result.data.confidence > 90) {
        console.log(`   ✓ Alta confiança alcançada (${result.data.confidence.toFixed(2)}%)`);
        break;
      }
    }

    await worker.terminate();

    console.log(`   Melhor resultado: ${bestConfidence.toFixed(2)}% de confiança`);

    return {
      text: bestResult.data.text,
      confidence: bestConfidence,
      words: bestResult.data.words,
      lines: bestResult.data.lines
    };

  } finally {
    // Limpar arquivos processados
    for (const path of processedPaths) {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }
  }
}

// Função para extrair dados específicos da ficha frente
function extractFichaFrenteData(text) {
  const data = {
    codigo_consulente: null,
    nome: null,
    idade: null,
    endereco: null,
    bairro: null,
    cidade: null,
    estado: null,
    cep: null,
    telefone_fixo: null,
    celular: null,
    email: null,
    data_cadastro: null,
    passes_humano_espirituais: null,
    passes_magneticos: null,
    bioenergia: false,
    apometria_realizar: false,
    apometria_tipo: null,
    apometria_urgente: false,
    apometria_energetica: false,
    apometria_convencional: false,
    evocacao_emocional: false,
    evocacao_espiritual: false,
    evocacao_fisica: false,
    campo_protecao_casa: false,
    campo_protecao_consciente: false,
    campo_protecao_casa_consulente: false,
    indicacoes_especificas: null,
    responsavel_preenchimento: null,
    responsavel_orientacao: null,
    sessoes: []
  };

  // Extrair código do consulente
  const codigoMatch = text.match(/Código\s+do\s+consulente[:\s]*(\d+)/i);
  if (codigoMatch) data.codigo_consulente = codigoMatch[1];

  // Extrair nome
  const nomeMatch = text.match(/Nome[:\s]+([A-ZÀ-Ú\s]+?)(?=\s+Idade|\n)/i);
  if (nomeMatch) data.nome = nomeMatch[1].trim();

  // Extrair idade
  const idadeMatch = text.match(/Idade[:\s]*(\d+)/i);
  if (idadeMatch) data.idade = parseInt(idadeMatch[1]);

  // Extrair endereço
  const enderecoMatch = text.match(/Endereço[:\s]+(.+?)(?=Bairro|\n)/i);
  if (enderecoMatch) data.endereco = enderecoMatch[1].trim();

  // Extrair bairro
  const bairroMatch = text.match(/Bairro[:\s]+(.+?)(?=Cidade|\n)/i);
  if (bairroMatch) data.bairro = bairroMatch[1].trim();

  // Extrair cidade
  const cidadeMatch = text.match(/Cidade[:\s]+(.+?)(?=Estado|\n)/i);
  if (cidadeMatch) data.cidade = cidadeMatch[1].trim();

  // Extrair estado
  const estadoMatch = text.match(/Estado[:\s]*([A-Z]{2})/i);
  if (estadoMatch) data.estado = estadoMatch[1].toUpperCase();

  // Extrair CEP
  const cepMatch = text.match(/CEP[:\s]*(\d{5}[-\s]?\d{3})/i);
  if (cepMatch) data.cep = cepMatch[1];

  // Extrair telefone fixo
  const telFixoMatch = text.match(/Tel\.?\s*fixo[:\s]*([\d\s()-]+)/i);
  if (telFixoMatch) data.telefone_fixo = telFixoMatch[1].trim();

  // Extrair celular
  const celularMatch = text.match(/Celular[:\s]*([\d\s()-]+)/i);
  if (celularMatch) data.celular = celularMatch[1].trim();

  // Extrair email
  const emailMatch = text.match(/E-?mail[:\s]+([^\s]+@[^\s]+)/i);
  if (emailMatch) data.email = emailMatch[1].trim();

  // Extrair data
  const dataMatch = text.match(/Data[:\s]*(\d{2}\/\d{2}\/\d{2,4})/i);
  if (dataMatch) data.data_cadastro = dataMatch[1];

  // Verificar Bioenergia
  data.bioenergia = /Bioenergia.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Bioenergia/i.test(text);

  // Verificar Apometria - novo formato estruturado
  data.apometria_realizar = /Apometria.*?[xX✓✔☑]/i.test(text) ||
                            /Realizar.*?Apometria.*?[xX✓✔☑]/i.test(text) ||
                            /\[x\].*?Apometria/i.test(text);

  // Verificar tipo de Apometria
  if (/Apometria.*?Energética.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Energética/i.test(text)) {
    data.apometria_tipo = 'Energética';
    data.apometria_energetica = true;
  } else if (/Apometria.*?Convencional.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Convencional/i.test(text)) {
    data.apometria_tipo = 'Convencional';
    data.apometria_convencional = true;
  }

  // Verificar se é urgente
  data.apometria_urgente = /urgente.*?[xX✓✔☑]/i.test(text) ||
                           /\[x\].*?urgente/i.test(text) ||
                           /URGENTE/i.test(text);

  // Verificar Evocação
  data.evocacao_emocional = /Evoca[çc][ãa]o.*?Emocional.*?[xX✓✔☑]/i.test(text) ||
                            /\[x\].*?Evoca[çc][ãa]o.*?Emocional/i.test(text);
  data.evocacao_espiritual = /Evoca[çc][ãa]o.*?Espiritual.*?[xX✓✔☑]/i.test(text) ||
                             /\[x\].*?Evoca[çc][ãa]o.*?Espiritual/i.test(text);
  data.evocacao_fisica = /Evoca[çc][ãa]o.*?F[íi]sica.*?[xX✓✔☑]/i.test(text) ||
                         /\[x\].*?Evoca[çc][ãa]o.*?F[íi]sica/i.test(text);

  // Verificar Campo de Proteção
  data.campo_protecao_casa = /Campo.*?Prote[çc][ãa]o.*?Casa[^C]*?[xX✓✔☑]/i.test(text) ||
                             /\[x\].*?Campo.*?Casa/i.test(text);
  data.campo_protecao_consciente = /Campo.*?Prote[çc][ãa]o.*?Consciente.*?[xX✓✔☑]/i.test(text) ||
                                   /\[x\].*?Consciente/i.test(text);
  data.campo_protecao_casa_consulente = /Campo.*?Prote[çc][ãa]o.*?Casa.*?Consulente.*?[xX✓✔☑]/i.test(text) ||
                                        /Casa.*?Consulente.*?[xX✓✔☑]/i.test(text) ||
                                        /\[x\].*?Casa.*?Consulente/i.test(text);

  // Extrair responsáveis
  const respPreenchMatch = text.match(/Responsável\s+pelo\s+preenchimento[:\s]+([A-ZÀ-Ú\s]+?)(?=Responsável|\n|$)/i);
  if (respPreenchMatch) data.responsavel_preenchimento = respPreenchMatch[1].trim();

  const respOrientMatch = text.match(/Responsável\s+pela\s+orientação[:\s]+([A-ZÀ-Ú\s]+?)(?=\n|$)/i);
  if (respOrientMatch) data.responsavel_orientacao = respOrientMatch[1].trim();

  return data;
}

// Função para extrair dados da ficha costa (tratamentos)
function extractFichaCostaData(text) {
  const data = {
    agua_magnetizada: false,
    agua_magnetizada_detalhes: null,
    agua_viva: false,
    gotas: false,
    gotas_prescricao: null,
    gel: false,
    banho: false,
    escalda_pes: false,
    floral_rescue: false,
    atendimento_terapeutico_pnl: false,
    conversa_fraterna: false,
    terapia_florais: false,
    culto_evangelho_lar: false,
    colegiado_guardioes: false,
    leitura_recomendada: null,
    reuniao_pais_velhos_caboclos: false,
    reuniao_pais_velhos_caboclos_data: null,
    orientacoes_complementares: null,
    observacoes: null
  };

  // Verificar tratamentos marcados (com múltiplos padrões de checkbox)
  data.agua_magnetizada = /Água\s+magnetizada.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Água.*?magnetizada/i.test(text);
  data.agua_viva = /Água\s+[Vv]iva.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Água.*?[Vv]iva/i.test(text);
  data.gotas = /Gotas.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Gotas/i.test(text);
  data.gel = /Gel.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Gel/i.test(text);
  data.banho = /Banho.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Banho/i.test(text);
  data.escalda_pes = /Escalda.*?p[ée]s.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Escalda/i.test(text);
  data.floral_rescue = /[Ff]loral\s+[Rr]escue.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Floral.*?Rescue/i.test(text);
  data.atendimento_terapeutico_pnl = /PNL.*?[xX✓✔☑]/i.test(text) || /\[x\].*?PNL/i.test(text);
  data.conversa_fraterna = /Conversa\s+[Ff]raterna.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Conversa.*?Fraterna/i.test(text);
  data.terapia_florais = /Terapia.*?[Ff]lorais.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Terapia.*?Florais/i.test(text);
  data.culto_evangelho_lar = /Culto.*?[Ee]vangelho.*?lar.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Culto.*?Evangelho/i.test(text);
  data.colegiado_guardioes = /[Cc]olegiado.*?[Gg]uardi[õo]es.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Colegiado.*?Guardi/i.test(text);
  data.reuniao_pais_velhos_caboclos = /Pais.*?[Vv]elhos.*?[Cc]aboclos.*?[xX✓✔☑]/i.test(text) || /\[x\].*?Pais.*?Velhos/i.test(text);

  // Extrair leitura recomendada
  const leituraMatch = text.match(/[Ll]eitura.*?livro.*?[:\s]+(.+?)(?=\n|Reunião|$)/i);
  if (leituraMatch) data.leitura_recomendada = leituraMatch[1].trim();

  // Extrair orientações complementares
  const orientacoesMatch = text.match(/Orientações\s+complementares[:\s]+(.+?)(?=Observações|$)/is);
  if (orientacoesMatch) data.orientacoes_complementares = orientacoesMatch[1].trim();

  return data;
}

// Endpoint para upload e OCR de ficha frente
router.post('/ficha-frente', upload.single('ficha'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    console.log('📄 Processando ficha frente:', req.file.filename);

    // Executar OCR otimizado
    const ocrResult = await performOCR(req.file.path, 'por');

    // Extrair dados estruturados
    const extractedData = extractFichaFrenteData(ocrResult.text);

    console.log(`✅ OCR concluído - Confiança: ${ocrResult.confidence.toFixed(2)}%`);

    res.json({
      success: true,
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      extractedData: extractedData
    });
  } catch (error) {
    console.error('Erro ao processar OCR:', error);
    res.status(500).json({ error: 'Erro ao processar imagem', details: error.message });
  }
});

// Endpoint para upload e OCR de ficha costa
router.post('/ficha-costa', upload.single('ficha'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    console.log('📄 Processando ficha costa:', req.file.filename);

    // Executar OCR otimizado
    const ocrResult = await performOCR(req.file.path, 'por');

    // Extrair dados estruturados
    const extractedData = extractFichaCostaData(ocrResult.text);

    console.log(`✅ OCR concluído - Confiança: ${ocrResult.confidence.toFixed(2)}%`);

    res.json({
      success: true,
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      extractedData: extractedData
    });
  } catch (error) {
    console.error('Erro ao processar OCR:', error);
    res.status(500).json({ error: 'Erro ao processar imagem', details: error.message });
  }
});

// Endpoint para upload completo (frente e costa)
router.post('/ficha-completa', upload.fields([
  { name: 'ficha_frente', maxCount: 1 },
  { name: 'ficha_costa', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files.ficha_frente || !req.files.ficha_costa) {
      return res.status(400).json({ error: 'Ambas as fichas (frente e costa) devem ser enviadas' });
    }

    console.log('📄 Processando ficha completa...');

    const fichaFrente = req.files.ficha_frente[0];
    const fichaCosta = req.files.ficha_costa[0];

    console.log('📄 Processando ficha frente:', fichaFrente.filename);
    // Processar ficha frente com OCR otimizado
    const ocrFrente = await performOCR(fichaFrente.path, 'por');
    console.log('✅ OCR Frente concluído. Confiança:', ocrFrente.confidence.toFixed(2) + '%');
    const dataFrente = extractFichaFrenteData(ocrFrente.text);
    console.log('📋 Dados extraídos da frente:', Object.keys(dataFrente).filter(k => dataFrente[k]).length, 'campos preenchidos');

    console.log('📄 Processando ficha costa:', fichaCosta.filename);
    // Processar ficha costa com OCR otimizado
    const ocrCosta = await performOCR(fichaCosta.path, 'por');
    console.log('✅ OCR Costa concluído. Confiança:', ocrCosta.confidence.toFixed(2) + '%');
    const dataCosta = extractFichaCostaData(ocrCosta.text);
    console.log('📋 Dados extraídos da costa:', Object.keys(dataCosta).filter(k => dataCosta[k]).length, 'campos preenchidos');

    res.json({
      success: true,
      ficha_frente: {
        filename: fichaFrente.filename,
        url: `/uploads/${fichaFrente.filename}`,
        text: ocrFrente.text,
        confidence: ocrFrente.confidence,
        data: dataFrente
      },
      ficha_costa: {
        filename: fichaCosta.filename,
        url: `/uploads/${fichaCosta.filename}`,
        text: ocrCosta.text,
        confidence: ocrCosta.confidence,
        data: dataCosta
      },
      extractedData: {
        ...dataFrente,
        tratamento: dataCosta
      },
      overallConfidence: ((ocrFrente.confidence + ocrCosta.confidence) / 2).toFixed(2)
    });
  } catch (error) {
    console.error('Erro ao processar fichas:', error);
    res.status(500).json({ error: 'Erro ao processar imagens' });
  }
});

module.exports = router;
