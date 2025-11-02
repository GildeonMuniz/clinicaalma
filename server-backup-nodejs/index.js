const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fs = require('fs');

// Routers
const pacientesRouter = require('./routes/pacientes');
const fichasRouter = require('./routes/fichas');
const ocrRouter = require('./routes/ocr');
const ocrChatGPTRouter = require('./routes/ocr-chatgpt');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas da API
app.use('/api/pacientes', pacientesRouter);
app.use('/api/fichas', fichasRouter);
app.use('/api/ocr', ocrRouter);
app.use('/api/ocr-gpt', ocrChatGPTRouter);

// Servir frontend compilado se existir, senão mostrar instruções
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Clínica Alma - Sistema de Gestão</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              background: white;
              color: #333;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            h1 { color: #667eea; }
            code {
              background: #f4f4f4;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: monospace;
            }
            .step {
              background: #f8f9fa;
              padding: 15px;
              margin: 10px 0;
              border-left: 4px solid #667eea;
              border-radius: 4px;
            }
            .success {
              background: #d4edda;
              border-left-color: #28a745;
              color: #155724;
            }
            a {
              color: #667eea;
              text-decoration: none;
              font-weight: bold;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🏥 Clínica Alma - Sistema de Gestão</h1>
            <p><strong>Backend API está rodando!</strong></p>

            <h2>📋 Como acessar o sistema:</h2>

            <div class="step">
              <h3>Opção 1 - Modo Desenvolvimento (Recomendado)</h3>
              <p>Abra um novo terminal e execute:</p>
              <code>cd C:\\Clinicaalma\\client</code><br>
              <code>npm run dev</code><br><br>
              <p>Depois acesse: <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></p>
            </div>

            <div class="step">
              <h3>Opção 2 - Modo Produção</h3>
              <p>Compile o frontend primeiro:</p>
              <code>cd C:\\Clinicaalma</code><br>
              <code>npm run build</code><br><br>
              <p>Depois reinicie este servidor e acesse: <a href="http://localhost:3000">http://localhost:3000</a></p>
            </div>

            <div class="step success">
              <h3>✅ API Endpoints disponíveis:</h3>
              <ul>
                <li><a href="/api/pacientes">/api/pacientes</a> - Listar pacientes</li>
                <li><a href="/api/fichas">/api/fichas</a> - Listar fichas</li>
                <li>POST /api/ocr/ficha-completa - Upload de fichas</li>
              </ul>
            </div>

            <h2>📚 Documentação:</h2>
            <ul>
              <li><strong>README.md</strong> - Documentação completa</li>
              <li><strong>INSTALACAO.md</strong> - Guia de instalação</li>
            </ul>
          </div>
        </body>
      </html>
    `);
  });
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend rodando na porta ${PORT}`);
  console.log(`📁 Uploads: ${path.join(__dirname, '../uploads')}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log('');
  if (!fs.existsSync(distPath)) {
    console.log('⚠️  Frontend não compilado!');
    console.log('📌 Para acessar o sistema, execute em outro terminal:');
    console.log('   cd client && npm run dev');
    console.log('   Depois acesse: http://localhost:5173');
  } else {
    console.log('✅ Frontend disponível em: http://localhost:${PORT}');
  }
});
