# Guia de Uso - Sistema Clínica Alma

## Como Cadastrar uma Nova Ficha

### Opção 1: Com OCR Automático (Recomendado)

1. **Acesse "Nova Ficha"** no menu
2. **Faça upload das fichas:**
   - Arraste e solte ou clique na área de upload
   - **Ficha Frente:** Dados do paciente
   - **Ficha Costa:** Receitas e tratamentos
3. **Clique em "Processar com OCR"**
   - O sistema irá extrair os dados automaticamente
   - Aguarde (pode levar 30-60 segundos)
   - Você verá o progresso no console do servidor
4. **Revise os dados extraídos**
   - O OCR não é 100% preciso, especialmente com texto manuscrito
   - Corrija qualquer campo que esteja incorreto
5. **Clique em "Salvar Ficha"**

### Opção 2: Entrada Manual (Se o OCR falhar)

1. **Faça upload das fichas** (frente e costa)
2. **Clique em "Pular OCR (Preencher Manualmente)"**
3. **Preencha todos os campos manualmente**
4. **Clique em "Salvar Ficha"**

## Sobre o OCR

### O que funciona bem:
- ✅ Texto impresso (formulário)
- ✅ Números
- ✅ Checkboxes marcados com X

### O que pode ter dificuldades:
- ⚠️ Texto manuscrito (escrita à mão)
- ⚠️ Imagens de baixa qualidade
- ⚠️ Fichas com manchas ou dobras

### Dicas para melhor reconhecimento:
- 📸 Use boa iluminação ao escanear
- 📸 Mantenha a ficha reta (não inclinada)
- 📸 Use scanner ou câmera de boa qualidade
- 📸 Evite sombras e reflexos

## Fluxo Completo de Atendimento

### 1. Recepção (Parte 1 do Formulário)
- Preencher dados pessoais do paciente
- Atribuir código do consulente

### 2. Atendimento Fraterno (Parte 2 - Ficha Frente)
- Marcar tratamentos recomendados (P1, P2, Long, etc.)
- Preencher indicações específicas
- Marcar tipo de Apometria/Bioenergia

### 3. Prescrição (Ficha Costa)
- Marcar tratamentos (água magnetizada, gotas, florais)
- Orientações complementares
- Agendar retornos

### 4. Digitalização
- Escanear ambas as fichas
- Fazer upload no sistema
- Processar com OCR ou preencher manualmente
- Salvar

## Consultar Histórico do Paciente

1. **Acesse "Pacientes"** no menu
2. **Use a busca** para encontrar por:
   - Nome do paciente
   - Código do consulente
3. **Clique em "Ver"** para ver:
   - Dados completos do paciente
   - Histórico de atendimentos
   - Fichas escaneadas originais

## Campos do Formulário

### Dados Pessoais
- **Código do Consulente:** Identificador único (obrigatório)
- **Nome Completo:** Nome do paciente (obrigatório)
- **Idade:** Idade em anos
- **Endereço Completo:** Rua, número, complemento
- **Bairro, Cidade, Estado**
- **Telefones:** Fixo e/ou Celular
- **Email:** Para contato

### Tipo de Tratamento
- **Bioenergia:** Tratamento energético com bioenergia
- **Apometria Energética:** Apometria com foco energético
- **Apometria Convencional:** Apometria tradicional

### Indicações Específicas
- Campo livre para observações sobre o tratamento
- Sintomas, queixas, orientações especiais

### Responsáveis
- **Preenchimento:** Quem preencheu a ficha
- **Orientação:** Quem fez o atendimento/orientação

## Solução de Problemas

### "O OCR não extraiu nada"
**Solução:** Clique em "Pular OCR" e preencha manualmente

### "Os dados estão incorretos"
**Solução:** Basta corrigir os campos antes de salvar

### "Já existe um paciente com este código"
**Solução:** O sistema automaticamente vincula à ficha existente

### "Erro ao salvar"
**Solução:** Verifique se preencheu nome e código (obrigatórios)

## Dicas de Uso

### ✅ Boas Práticas
- Sempre revise os dados do OCR antes de salvar
- Mantenha padrão nos códigos de consulente
- Preencha o máximo de informações possível
- Guarde as fichas originais em papel

### ⚠️ Cuidados
- Não feche o navegador durante upload
- Aguarde a conclusão do OCR (pode demorar)
- Verifique se as duas fichas foram enviadas
- Não salve sem revisar os dados

## Atalhos e Recursos

- **Dashboard:** Visão geral e estatísticas
- **Nova Ficha:** Cadastro rápido
- **Pacientes:** Lista e busca
- **Busca:** Busca por nome ou código
- **Histórico:** Todos os atendimentos do paciente

## Backup

### Importante!
- Os dados ficam salvos em `C:\Clinicaalma\database\clinica.db`
- As fichas escaneadas ficam em `C:\Clinicaalma\uploads\`
- Faça backup regular desses arquivos

### Como fazer backup:
```bash
# Copiar banco de dados
copy C:\Clinicaalma\database\clinica.db C:\Backup\

# Copiar fichas
xcopy C:\Clinicaalma\uploads C:\Backup\uploads\ /E /I
```

---

**Dúvidas ou problemas?**
Consulte o README.md ou INSTALACAO.md
