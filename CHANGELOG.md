# Changelog - Sistema Clínica Alma

## [1.1.0] - 2025-01-14

### 🚀 Adicionado
- **Integração com ChatGPT (GPT-4 Vision)** para extração inteligente de dados
  - Lê texto manuscrito com alta precisão (95%+)
  - Entende contexto das fichas
  - Extração estruturada automática
  - Endpoint `/api/ocr-gpt/ficha-completa-gpt`

- **Interface melhorada** com 3 opções de processamento:
  - 🤖 ChatGPT (recomendado para texto manuscrito)
  - OCR Tesseract (grátis, para texto impresso)
  - Manual (preenchimento direto)

- **Documentação completa:**
  - `CHATGPT_SETUP.md` - Guia de configuração do ChatGPT
  - `GUIA_USO.md` - Guia completo de uso do sistema
  - `CHANGELOG.md` - Este arquivo

### 🔧 Melhorado
- Pré-processamento de imagens para melhor qualidade OCR
- Mensagens de erro mais claras e informativas
- Logs detalhados no servidor para debugging
- Formulário manual sempre disponível como fallback

### 📝 Alterado
- Botão "Processar com OCR" renomeado para "OCR Tesseract"
- Botão "Pular OCR" renomeado para "Manual"
- Adicionado botão principal "🤖 Processar com ChatGPT"

---

## [1.0.0] - 2025-01-14

### 🎉 Lançamento Inicial

#### Funcionalidades Principais
- ✅ Gestão completa de pacientes
- ✅ Fichas de atendimento digitalizadas
- ✅ Upload de fichas escaneadas (frente e costa)
- ✅ OCR com Tesseract.js
- ✅ Banco de dados SQLite
- ✅ Dashboard com estatísticas
- ✅ Histórico de atendimentos
- ✅ Busca de pacientes

#### Backend
- Node.js + Express
- Better-SQLite3 para banco de dados
- Tesseract.js para OCR
- Sharp para processamento de imagens
- Multer para upload de arquivos
- API RESTful completa

#### Frontend
- Vue 3 com Composition API
- Vue Router para navegação
- Axios para requisições HTTP
- Interface responsiva e moderna
- Upload drag-and-drop

#### Banco de Dados
- Schema completo com 4 tabelas
- Relacionamentos entre entidades
- Triggers automáticos
- Índices otimizados

#### Documentação
- README.md completo
- INSTALACAO.md passo a passo
- Comentários no código

---

## Roadmap Futuro

### Versão 1.2.0 (Planejada)
- [ ] Sistema de autenticação de usuários
- [ ] Controle de permissões (admin, atendente, etc)
- [ ] Relatórios em PDF
- [ ] Gráficos e estatísticas avançadas
- [ ] Exportação de dados (Excel, CSV)

### Versão 1.3.0 (Planejada)
- [ ] Agendamento de sessões
- [ ] Notificações de retorno (WhatsApp/Email)
- [ ] Calendário de atendimentos
- [ ] Backup automático
- [ ] Integração com WhatsApp

### Versão 2.0.0 (Futuro)
- [ ] Aplicativo mobile (React Native)
- [ ] Sistema multi-clínicas
- [ ] Assinatura digital de fichas
- [ ] Prontuário eletrônico completo
- [ ] Integração com sistemas de pagamento

---

## Notas de Versão

### Compatibilidade
- Node.js 16+
- Navegadores modernos (Chrome, Firefox, Edge, Safari)
- Windows, macOS, Linux

### Dependências Atualizadas
```json
{
  "openai": "^4.20.0",
  "express": "^4.18.2",
  "better-sqlite3": "^9.2.2",
  "tesseract.js": "^5.0.4",
  "sharp": "^0.33.2",
  "vue": "^3.3.11"
}
```

### Migrações de Banco de Dados
- Nenhuma migração necessária da v1.0.0 para v1.1.0
- Schema compatível com versão anterior

---

## Como Contribuir

Encontrou um bug ou tem uma sugestão?

1. Abra uma issue no repositório
2. Descreva o problema ou sugestão
3. Forneça prints e logs se possível

---

**Desenvolvido para Clínica Alma**
Sistema de Gestão de Terapias Espirituais
