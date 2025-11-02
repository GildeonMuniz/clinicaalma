# PROMPT: Backend C# com ASP.NET Core e SQL Server
## Sistema de Gestão - Clínica Alma

---

## 📋 CONTEXTO

Você é um desenvolvedor sênior .NET especializado em ASP.NET Core Web API e SQL Server. Precisa criar um backend completo para um sistema de gestão de uma clínica de terapias espirituais.

**Tecnologias obrigatórias:**
- ASP.NET Core 8.0 Web API
- Entity Framework Core 8.0
- SQL Server 2019+ (ou SQL Server Express)
- Swagger/OpenAPI para documentação
- Azure.AI.Vision.ImageAnalysis (OCR) ou Tesseract.NET
- Azure.AI.OpenAI (opcional, para OCR com GPT-4 Vision)

**Arquitetura:**
- Clean Architecture / Onion Architecture
- Repository Pattern
- Dependency Injection
- DTOs para transferência de dados
- CORS habilitado (para integração com frontend Vue.js hospedado no Firebase)

---

## 🗄️ 1. ESTRUTURA DO BANCO DE DADOS SQL SERVER

### 1.1. Schema Completo

Crie as seguintes tabelas no SQL Server:

```sql
-- =====================================================
-- TABELA: Pacientes
-- =====================================================
CREATE TABLE Pacientes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CodigoConsulente NVARCHAR(50) UNIQUE NOT NULL,
    Nome NVARCHAR(255) NOT NULL,
    Idade INT NULL,
    Endereco NVARCHAR(500) NULL,
    Bairro NVARCHAR(100) NULL,
    Cidade NVARCHAR(100) NULL,
    Estado NVARCHAR(2) NULL,
    CEP NVARCHAR(10) NULL,
    TelefoneFixo NVARCHAR(20) NULL,
    Celular NVARCHAR(20) NULL,
    Email NVARCHAR(255) NULL,
    DataCadastro DATE NULL,
    DataCriacao DATETIME2 DEFAULT GETDATE(),
    DataAtualizacao DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_Pacientes_CodigoConsulente ON Pacientes(CodigoConsulente);
CREATE INDEX IX_Pacientes_Nome ON Pacientes(Nome);

-- =====================================================
-- TABELA: FichasAtendimento
-- =====================================================
CREATE TABLE FichasAtendimento (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PacienteId INT NOT NULL,
    DataAtendimento DATE NULL,

    -- Passes
    PassesHumanoEspirituais NVARCHAR(MAX) NULL,
    PassesMagneticos NVARCHAR(MAX) NULL,

    -- Bioenergia
    Bioenergia BIT DEFAULT 0,

    -- Apometria
    ApometriaRealizar BIT DEFAULT 0,
    ApometriaTipo NVARCHAR(50) NULL, -- "Convencional" ou "Energética"
    ApometriaEnergetica BIT DEFAULT 0,
    ApometriaConvencional BIT DEFAULT 0,
    ApometriaSim BIT DEFAULT 0,
    ApometriaNao BIT DEFAULT 0,
    ApometriaUrgente BIT DEFAULT 0,

    -- Evocação
    EvocacaoEmocional BIT DEFAULT 0,
    EvocacaoEspiritual BIT DEFAULT 0,
    EvocacaoFisica BIT DEFAULT 0,

    -- Campo de Proteção
    CampoProtecaoCasa BIT DEFAULT 0,
    CampoProtecaoConsciente BIT DEFAULT 0,
    CampoProtecaoCasaConsulente BIT DEFAULT 0,

    -- Procedimentos Exclusivos
    ProcedimentosEspeciais BIT DEFAULT 0,
    LimpezaEnergetica BIT DEFAULT 0,
    LimpezaEnergeticaCampoProtecao BIT DEFAULT 0,
    Ectoplasma BIT DEFAULT 0,

    -- Indicações específicas
    IndicacoesEspecificas NVARCHAR(MAX) NULL,

    -- Responsáveis
    ResponsavelPreenchimento NVARCHAR(255) NULL,
    ResponsavelOrientacao NVARCHAR(255) NULL,

    -- URLs dos arquivos (armazenados no Azure Blob Storage ou Firebase Storage)
    FichaFrenteUrl NVARCHAR(500) NULL,
    FichaCostaUrl NVARCHAR(500) NULL,

    DataCriacao DATETIME2 DEFAULT GETDATE(),
    DataAtualizacao DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_FichasAtendimento_Pacientes
        FOREIGN KEY (PacienteId) REFERENCES Pacientes(Id) ON DELETE CASCADE
);

CREATE INDEX IX_FichasAtendimento_PacienteId ON FichasAtendimento(PacienteId);
CREATE INDEX IX_FichasAtendimento_DataAtendimento ON FichasAtendimento(DataAtendimento);

-- =====================================================
-- TABELA: Sessoes (P1, P2, P3A, P3B, Long, etc.)
-- =====================================================
CREATE TABLE Sessoes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FichaId INT NOT NULL,
    TipoSessao NVARCHAR(10) NOT NULL, -- P1, P2, P3A, P3B, Long, P4, P5, P6, P7, P8
    DataSessao1 DATE NULL,
    DataSessao2 DATE NULL,
    DataSessao3 DATE NULL,
    DataSessao4 DATE NULL,
    Observacoes NVARCHAR(MAX) NULL,

    CONSTRAINT FK_Sessoes_FichasAtendimento
        FOREIGN KEY (FichaId) REFERENCES FichasAtendimento(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Sessoes_FichaId ON Sessoes(FichaId);

-- =====================================================
-- TABELA: Tratamentos (Ficha Costa - Receitas)
-- =====================================================
CREATE TABLE Tratamentos (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FichaId INT NOT NULL,

    -- Água magnetizada
    AguaMagnetizada BIT DEFAULT 0,
    AguaMagnetizadaDetalhes NVARCHAR(MAX) NULL,

    -- Água Viva
    AguaViva BIT DEFAULT 0,
    AguaVivaDetalhes NVARCHAR(MAX) NULL,

    -- Gotas
    Gotas BIT DEFAULT 0,
    GotasPrescricao NVARCHAR(MAX) NULL,

    -- Gel/Banho/Escalda-pés
    Gel BIT DEFAULT 0,
    Banho BIT DEFAULT 0,
    EscaldaPes BIT DEFAULT 0,
    OrientacaoUso NVARCHAR(MAX) NULL,

    -- Floral Rescue
    FloralRescue BIT DEFAULT 0,

    -- Outros tratamentos
    MeninasGerais BIT DEFAULT 0,
    GrupoPsicosocratico BIT DEFAULT 0,
    AtendimentoTerapeuticoPNL BIT DEFAULT 0,
    ConversaFraterna BIT DEFAULT 0,
    TerapiaFlorais BIT DEFAULT 0,
    CultoEvangelhoLar BIT DEFAULT 0,
    EvangelizacaoInfantojuvenil BIT DEFAULT 0,
    EspacoJovem BIT DEFAULT 0,
    FrequenciaCursosUnispiritus BIT DEFAULT 0,
    ColegiadoGuardioes BIT DEFAULT 0,
    FrequenciaEstudosEvangelho BIT DEFAULT 0,
    FrequenciaReunioesPublicas BIT DEFAULT 0,

    -- Leitura recomendada
    LeituraRecomendada NVARCHAR(MAX) NULL,

    -- Reuniões
    ReuniaoMedicoEspiritual BIT DEFAULT 0,
    ReuniaoMedicoEspiritualData DATE NULL,
    ReuniaoPaisVelhosCaboclos BIT DEFAULT 0,
    ReuniaoPaisVelhosCaboclosData DATE NULL,
    ReavaliacaoTratamento BIT DEFAULT 0,

    -- Orientações complementares
    OrientacoesComplementares NVARCHAR(MAX) NULL,

    -- Observações
    Observacoes NVARCHAR(MAX) NULL,

    DataCriacao DATETIME2 DEFAULT GETDATE(),
    DataAtualizacao DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Tratamentos_FichasAtendimento
        FOREIGN KEY (FichaId) REFERENCES FichasAtendimento(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Tratamentos_FichaId ON Tratamentos(FichaId);

-- =====================================================
-- TRIGGERS para atualizar DataAtualizacao automaticamente
-- =====================================================
GO
CREATE TRIGGER TR_Pacientes_UpdateTimestamp
ON Pacientes
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Pacientes
    SET DataAtualizacao = GETDATE()
    FROM Pacientes p
    INNER JOIN inserted i ON p.Id = i.Id;
END;
GO

CREATE TRIGGER TR_FichasAtendimento_UpdateTimestamp
ON FichasAtendimento
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE FichasAtendimento
    SET DataAtualizacao = GETDATE()
    FROM FichasAtendimento f
    INNER JOIN inserted i ON f.Id = i.Id;
END;
GO

CREATE TRIGGER TR_Tratamentos_UpdateTimestamp
ON Tratamentos
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Tratamentos
    SET DataAtualizacao = GETDATE()
    FROM Tratamentos t
    INNER JOIN inserted i ON t.Id = i.Id;
END;
GO
```

---

## 🏗️ 2. ESTRUTURA DO PROJETO ASP.NET CORE

### 2.1. Estrutura de Pastas

```
ClinicaAlma.API/
├── Controllers/
│   ├── PacientesController.cs
│   ├── FichasController.cs
│   ├── OcrController.cs
│   └── HealthController.cs
├── Models/
│   ├── Entities/
│   │   ├── Paciente.cs
│   │   ├── FichaAtendimento.cs
│   │   ├── Sessao.cs
│   │   └── Tratamento.cs
│   └── DTOs/
│       ├── PacienteDto.cs
│       ├── CreatePacienteDto.cs
│       ├── UpdatePacienteDto.cs
│       ├── FichaAtendimentoDto.cs
│       ├── CreateFichaDto.cs
│       ├── OcrResultDto.cs
│       └── FileUploadDto.cs
├── Data/
│   ├── ClinicaAlmaDbContext.cs
│   └── Configurations/
│       ├── PacienteConfiguration.cs
│       ├── FichaAtendimentoConfiguration.cs
│       ├── SessaoConfiguration.cs
│       └── TratamentoConfiguration.cs
├── Repositories/
│   ├── Interfaces/
│   │   ├── IPacienteRepository.cs
│   │   ├── IFichaRepository.cs
│   │   └── IUnitOfWork.cs
│   └── Implementations/
│       ├── PacienteRepository.cs
│       ├── FichaRepository.cs
│       └── UnitOfWork.cs
├── Services/
│   ├── Interfaces/
│   │   ├── IOcrService.cs
│   │   ├── IStorageService.cs
│   │   └── IFichaExtractionService.cs
│   └── Implementations/
│       ├── TesseractOcrService.cs
│       ├── AzureVisionOcrService.cs (opcional)
│       ├── OpenAIVisionOcrService.cs (opcional)
│       ├── FirebaseStorageService.cs
│       └── FichaExtractionService.cs
├── Middlewares/
│   ├── ErrorHandlingMiddleware.cs
│   └── RequestLoggingMiddleware.cs
├── Extensions/
│   └── ServiceExtensions.cs
├── appsettings.json
├── appsettings.Development.json
└── Program.cs
```

---

## 📦 3. MODELS E ENTITIES

### 3.1. Entidades

**Paciente.cs**
```csharp
namespace ClinicaAlma.API.Models.Entities;

public class Paciente
{
    public int Id { get; set; }
    public string CodigoConsulente { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public int? Idade { get; set; }
    public string? Endereco { get; set; }
    public string? Bairro { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public string? CEP { get; set; }
    public string? TelefoneFixo { get; set; }
    public string? Celular { get; set; }
    public string? Email { get; set; }
    public DateTime? DataCadastro { get; set; }
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

    // Navegação
    public ICollection<FichaAtendimento> Fichas { get; set; } = new List<FichaAtendimento>();
}
```

**FichaAtendimento.cs**
```csharp
namespace ClinicaAlma.API.Models.Entities;

public class FichaAtendimento
{
    public int Id { get; set; }
    public int PacienteId { get; set; }
    public DateTime? DataAtendimento { get; set; }

    // Passes
    public string? PassesHumanoEspirituais { get; set; }
    public string? PassesMagneticos { get; set; }

    // Bioenergia
    public bool Bioenergia { get; set; }

    // Apometria
    public bool ApometriaRealizar { get; set; }
    public string? ApometriaTipo { get; set; }
    public bool ApometriaEnergetica { get; set; }
    public bool ApometriaConvencional { get; set; }
    public bool ApometriaSim { get; set; }
    public bool ApometriaNao { get; set; }
    public bool ApometriaUrgente { get; set; }

    // Evocação
    public bool EvocacaoEmocional { get; set; }
    public bool EvocacaoEspiritual { get; set; }
    public bool EvocacaoFisica { get; set; }

    // Campo de Proteção
    public bool CampoProtecaoCasa { get; set; }
    public bool CampoProtecaoConsciente { get; set; }
    public bool CampoProtecaoCasaConsulente { get; set; }

    // Procedimentos Exclusivos
    public bool ProcedimentosEspeciais { get; set; }
    public bool LimpezaEnergetica { get; set; }
    public bool LimpezaEnergeticaCampoProtecao { get; set; }
    public bool Ectoplasma { get; set; }

    // Indicações específicas
    public string? IndicacoesEspecificas { get; set; }

    // Responsáveis
    public string? ResponsavelPreenchimento { get; set; }
    public string? ResponsavelOrientacao { get; set; }

    // URLs dos arquivos
    public string? FichaFrenteUrl { get; set; }
    public string? FichaCostaUrl { get; set; }

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

    // Navegação
    public Paciente Paciente { get; set; } = null!;
    public ICollection<Sessao> Sessoes { get; set; } = new List<Sessao>();
    public Tratamento? Tratamento { get; set; }
}
```

**Sessao.cs**
```csharp
namespace ClinicaAlma.API.Models.Entities;

public class Sessao
{
    public int Id { get; set; }
    public int FichaId { get; set; }
    public string TipoSessao { get; set; } = string.Empty; // P1, P2, P3A, P3B, Long, P4, P5, P6, P7, P8
    public DateTime? DataSessao1 { get; set; }
    public DateTime? DataSessao2 { get; set; }
    public DateTime? DataSessao3 { get; set; }
    public DateTime? DataSessao4 { get; set; }
    public string? Observacoes { get; set; }

    // Navegação
    public FichaAtendimento Ficha { get; set; } = null!;
}
```

**Tratamento.cs**
```csharp
namespace ClinicaAlma.API.Models.Entities;

public class Tratamento
{
    public int Id { get; set; }
    public int FichaId { get; set; }

    // Água magnetizada
    public bool AguaMagnetizada { get; set; }
    public string? AguaMagnetizadaDetalhes { get; set; }

    // Água Viva
    public bool AguaViva { get; set; }
    public string? AguaVivaDetalhes { get; set; }

    // Gotas
    public bool Gotas { get; set; }
    public string? GotasPrescricao { get; set; }

    // Gel/Banho/Escalda-pés
    public bool Gel { get; set; }
    public bool Banho { get; set; }
    public bool EscaldaPes { get; set; }
    public string? OrientacaoUso { get; set; }

    // Floral Rescue
    public bool FloralRescue { get; set; }

    // Outros tratamentos
    public bool MeninasGerais { get; set; }
    public bool GrupoPsicosocratico { get; set; }
    public bool AtendimentoTerapeuticoPNL { get; set; }
    public bool ConversaFraterna { get; set; }
    public bool TerapiaFlorais { get; set; }
    public bool CultoEvangelhoLar { get; set; }
    public bool EvangelizacaoInfantojuvenil { get; set; }
    public bool EspacoJovem { get; set; }
    public bool FrequenciaCursosUnispiritus { get; set; }
    public bool ColegiadoGuardioes { get; set; }
    public bool FrequenciaEstudosEvangelho { get; set; }
    public bool FrequenciaReunioesPublicas { get; set; }

    // Leitura recomendada
    public string? LeituraRecomendada { get; set; }

    // Reuniões
    public bool ReuniaoMedicoEspiritual { get; set; }
    public DateTime? ReuniaoMedicoEspiritualData { get; set; }
    public bool ReuniaoPaisVelhosCaboclos { get; set; }
    public DateTime? ReuniaoPaisVelhosCaboclosData { get; set; }
    public bool ReavaliacaoTratamento { get; set; }

    // Orientações complementares
    public string? OrientacoesComplementares { get; set; }

    // Observações
    public string? Observacoes { get; set; }

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

    // Navegação
    public FichaAtendimento Ficha { get; set; } = null!;
}
```

---

## 🔌 4. DbContext e Configurações

**ClinicaAlmaDbContext.cs**
```csharp
using Microsoft.EntityFrameworkCore;
using ClinicaAlma.API.Models.Entities;

namespace ClinicaAlma.API.Data;

public class ClinicaAlmaDbContext : DbContext
{
    public ClinicaAlmaDbContext(DbContextOptions<ClinicaAlmaDbContext> options)
        : base(options)
    {
    }

    public DbSet<Paciente> Pacientes => Set<Paciente>();
    public DbSet<FichaAtendimento> FichasAtendimento => Set<FichaAtendimento>();
    public DbSet<Sessao> Sessoes => Set<Sessao>();
    public DbSet<Tratamento> Tratamentos => Set<Tratamento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplicar todas as configurações do assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ClinicaAlmaDbContext).Assembly);
    }
}
```

**Configurações (exemplo: PacienteConfiguration.cs)**
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ClinicaAlma.API.Models.Entities;

namespace ClinicaAlma.API.Data.Configurations;

public class PacienteConfiguration : IEntityTypeConfiguration<Paciente>
{
    public void Configure(EntityTypeBuilder<Paciente> builder)
    {
        builder.ToTable("Pacientes");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.CodigoConsulente)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(p => p.CodigoConsulente)
            .IsUnique();

        builder.Property(p => p.Nome)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(p => p.Email)
            .HasMaxLength(255);

        builder.Property(p => p.Estado)
            .HasMaxLength(2);

        builder.Property(p => p.CEP)
            .HasMaxLength(10);

        builder.HasMany(p => p.Fichas)
            .WithOne(f => f.Paciente)
            .HasForeignKey(f => f.PacienteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

---

## 🎮 5. CONTROLLERS

### 5.1. PacientesController

Implemente os seguintes endpoints:

```csharp
[ApiController]
[Route("api/[controller]")]
public class PacientesController : ControllerBase
{
    // GET api/pacientes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PacienteDto>>> GetAll()

    // GET api/pacientes/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<PacienteDto>> GetById(int id)

    // GET api/pacientes/codigo/{codigo}
    [HttpGet("codigo/{codigo}")]
    public async Task<ActionResult<PacienteDto>> GetByCodigo(string codigo)

    // GET api/pacientes/{id}/fichas
    [HttpGet("{id}/fichas")]
    public async Task<ActionResult<IEnumerable<FichaAtendimentoDto>>> GetFichasPaciente(int id)

    // POST api/pacientes
    [HttpPost]
    public async Task<ActionResult<PacienteDto>> Create(CreatePacienteDto dto)

    // PUT api/pacientes/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<PacienteDto>> Update(int id, UpdatePacienteDto dto)

    // DELETE api/pacientes/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
}
```

### 5.2. FichasController

```csharp
[ApiController]
[Route("api/[controller]")]
public class FichasController : ControllerBase
{
    // GET api/fichas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FichaAtendimentoDto>>> GetAll()

    // GET api/fichas/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<FichaAtendimentoCompleteDto>> GetById(int id)

    // POST api/fichas
    [HttpPost]
    public async Task<ActionResult<FichaAtendimentoDto>> Create(CreateFichaDto dto)

    // PUT api/fichas/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<FichaAtendimentoDto>> Update(int id, UpdateFichaDto dto)

    // DELETE api/fichas/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
}
```

### 5.3. OcrController (IMPORTANTE!)

```csharp
[ApiController]
[Route("api/[controller]")]
public class OcrController : ControllerBase
{
    private readonly IOcrService _ocrService;
    private readonly IFichaExtractionService _extractionService;
    private readonly IStorageService _storageService;

    // POST api/ocr/ficha-frente
    [HttpPost("ficha-frente")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<OcrResultDto>> ProcessFichaFrente(IFormFile ficha)
    {
        // 1. Validar arquivo
        // 2. Fazer upload para Firebase Storage
        // 3. Processar OCR
        // 4. Extrair dados estruturados
        // 5. Retornar JSON com dados extraídos
    }

    // POST api/ocr/ficha-costa
    [HttpPost("ficha-costa")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<OcrResultDto>> ProcessFichaCosta(IFormFile ficha)

    // POST api/ocr/ficha-completa
    [HttpPost("ficha-completa")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<FichaCompletaOcrDto>> ProcessFichaCompleta(
        IFormFile ficha_frente,
        IFormFile ficha_costa)
    {
        // Processar ambas as fichas e retornar dados combinados
    }
}
```

---

## 🔍 6. SERVIÇO DE OCR

### 6.1. Interface IOcrService

```csharp
public interface IOcrService
{
    Task<OcrResult> ProcessImageAsync(Stream imageStream, string language = "por");
}

public class OcrResult
{
    public string Text { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public List<OcrWord>? Words { get; set; }
    public List<OcrLine>? Lines { get; set; }
}
```

### 6.2. Implementação com Tesseract.NET

**Instale o pacote:**
```bash
dotnet add package Tesseract
dotnet add package SixLabors.ImageSharp
```

**TesseractOcrService.cs**
```csharp
using Tesseract;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

public class TesseractOcrService : IOcrService
{
    private readonly string _tessDataPath;

    public TesseractOcrService(IConfiguration configuration)
    {
        _tessDataPath = configuration["Tesseract:DataPath"] ?? "./tessdata";
    }

    public async Task<OcrResult> ProcessImageAsync(Stream imageStream, string language = "por")
    {
        // 1. Pré-processar imagem (melhorar contraste, binarização, etc.)
        var processedImage = await PreprocessImageAsync(imageStream);

        // 2. Executar OCR com Tesseract
        using var engine = new TesseractEngine(_tessDataPath, language, EngineMode.Default);

        // Configurar parâmetros para melhor precisão
        engine.SetVariable("tessedit_pageseg_mode", "1"); // Auto
        engine.SetVariable("preserve_interword_spaces", "1");

        using var img = Pix.LoadFromMemory(processedImage);
        using var page = engine.Process(img);

        var text = page.GetText();
        var confidence = page.GetMeanConfidence();

        return new OcrResult
        {
            Text = text,
            Confidence = confidence * 100
        };
    }

    private async Task<byte[]> PreprocessImageAsync(Stream imageStream)
    {
        // Usar ImageSharp para processar a imagem
        using var image = await Image.LoadAsync(imageStream);

        image.Mutate(x => x
            .Resize(new ResizeOptions { Size = new Size(3200, 0) })
            .Grayscale()
            .BinaryThreshold(0.5f)
        );

        using var ms = new MemoryStream();
        await image.SaveAsPngAsync(ms);
        return ms.ToArray();
    }
}
```

### 6.3. (OPCIONAL) Implementação com Azure AI Vision

```csharp
using Azure;
using Azure.AI.Vision.ImageAnalysis;

public class AzureVisionOcrService : IOcrService
{
    private readonly ImageAnalysisClient _client;

    public AzureVisionOcrService(IConfiguration configuration)
    {
        var endpoint = configuration["Azure:Vision:Endpoint"];
        var key = configuration["Azure:Vision:Key"];

        _client = new ImageAnalysisClient(
            new Uri(endpoint!),
            new AzureKeyCredential(key!)
        );
    }

    public async Task<OcrResult> ProcessImageAsync(Stream imageStream, string language = "por")
    {
        var imageData = BinaryData.FromStream(imageStream);

        var result = await _client.AnalyzeAsync(
            imageData,
            VisualFeatures.Read,
            new ImageAnalysisOptions { Language = "pt" }
        );

        var text = string.Join("\n", result.Value.Read.Blocks
            .SelectMany(b => b.Lines)
            .Select(l => l.Text));

        return new OcrResult
        {
            Text = text,
            Confidence = 85.0 // Azure não retorna confiança global
        };
    }
}
```

### 6.4. (OPCIONAL) Implementação com OpenAI GPT-4 Vision

```csharp
using Azure.AI.OpenAI;

public class OpenAIVisionOcrService : IOcrService
{
    private readonly OpenAIClient _client;
    private readonly string _deploymentName;

    public OpenAIVisionOcrService(IConfiguration configuration)
    {
        var endpoint = configuration["OpenAI:Endpoint"];
        var key = configuration["OpenAI:ApiKey"];
        _deploymentName = configuration["OpenAI:DeploymentName"] ?? "gpt-4o";

        _client = new OpenAIClient(new Uri(endpoint!), new AzureKeyCredential(key!));
    }

    public async Task<OcrResult> ProcessImageAsync(Stream imageStream, string language = "por")
    {
        // Converter imagem para base64
        using var ms = new MemoryStream();
        await imageStream.CopyToAsync(ms);
        var base64Image = Convert.ToBase64String(ms.ToArray());

        var chatCompletionsOptions = new ChatCompletionsOptions
        {
            DeploymentName = _deploymentName,
            Messages =
            {
                new ChatRequestSystemMessage("Você é um assistente que extrai texto de imagens de fichas médicas."),
                new ChatRequestUserMessage(
                    new ChatMessageTextContentItem("Extraia todo o texto desta imagem, preservando a estrutura."),
                    new ChatMessageImageContentItem(new Uri($"data:image/jpeg;base64,{base64Image}"))
                )
            },
            MaxTokens = 2000,
            Temperature = 0.1f
        };

        var response = await _client.GetChatCompletionsAsync(chatCompletionsOptions);
        var extractedText = response.Value.Choices[0].Message.Content;

        return new OcrResult
        {
            Text = extractedText,
            Confidence = 95.0
        };
    }
}
```

---

## 🔧 7. SERVIÇO DE EXTRAÇÃO DE DADOS

**IFichaExtractionService.cs**
```csharp
public interface IFichaExtractionService
{
    FichaFrenteData ExtractFichaFrente(string ocrText);
    FichaCostaData ExtractFichaCosta(string ocrText);
}
```

**FichaExtractionService.cs**
```csharp
using System.Text.RegularExpressions;

public class FichaExtractionService : IFichaExtractionService
{
    public FichaFrenteData ExtractFichaFrente(string ocrText)
    {
        var data = new FichaFrenteData();

        // Código do consulente
        var codigoMatch = Regex.Match(ocrText, @"Código\s+do\s+consulente[:\s]*(\d+)", RegexOptions.IgnoreCase);
        if (codigoMatch.Success)
            data.CodigoConsulente = codigoMatch.Groups[1].Value;

        // Nome
        var nomeMatch = Regex.Match(ocrText, @"Nome[:\s]+([A-ZÀ-Ú\s]+?)(?=\s+Idade|\n)", RegexOptions.IgnoreCase);
        if (nomeMatch.Success)
            data.Nome = nomeMatch.Groups[1].Value.Trim();

        // Idade
        var idadeMatch = Regex.Match(ocrText, @"Idade[:\s]*(\d+)", RegexOptions.IgnoreCase);
        if (idadeMatch.Success && int.TryParse(idadeMatch.Groups[1].Value, out int idade))
            data.Idade = idade;

        // Bioenergia
        data.Bioenergia = Regex.IsMatch(ocrText, @"Bioenergia.*?[xX✓✔☑]", RegexOptions.IgnoreCase);

        // Apometria
        data.ApometriaRealizar = Regex.IsMatch(ocrText, @"Apometria.*?[xX✓✔☑]", RegexOptions.IgnoreCase);

        if (Regex.IsMatch(ocrText, @"Apometria.*?Energética.*?[xX✓✔☑]", RegexOptions.IgnoreCase))
        {
            data.ApometriaTipo = "Energética";
            data.ApometriaEnergetica = true;
        }
        else if (Regex.IsMatch(ocrText, @"Apometria.*?Convencional.*?[xX✓✔☑]", RegexOptions.IgnoreCase))
        {
            data.ApometriaTipo = "Convencional";
            data.ApometriaConvencional = true;
        }

        data.ApometriaUrgente = Regex.IsMatch(ocrText, @"urgente.*?[xX✓✔☑]", RegexOptions.IgnoreCase);

        // Evocação
        data.EvocacaoEmocional = Regex.IsMatch(ocrText, @"Evoca[çc][ãa]o.*?Emocional.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.EvocacaoEspiritual = Regex.IsMatch(ocrText, @"Evoca[çc][ãa]o.*?Espiritual.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.EvocacaoFisica = Regex.IsMatch(ocrText, @"Evoca[çc][ãa]o.*?F[íi]sica.*?[xX✓✔☑]", RegexOptions.IgnoreCase);

        // Campo de Proteção
        data.CampoProtecaoCasa = Regex.IsMatch(ocrText, @"Campo.*?Prote[çc][ãa]o.*?Casa[^C]*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.CampoProtecaoConsciente = Regex.IsMatch(ocrText, @"Campo.*?Prote[çc][ãa]o.*?Consciente.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.CampoProtecaoCasaConsulente = Regex.IsMatch(ocrText, @"Casa.*?Consulente.*?[xX✓✔☑]", RegexOptions.IgnoreCase);

        // Responsáveis
        var respPreenchMatch = Regex.Match(ocrText, @"Responsável\s+pelo\s+preenchimento[:\s]+([A-ZÀ-Ú\s]+?)(?=Responsável|\n|$)", RegexOptions.IgnoreCase);
        if (respPreenchMatch.Success)
            data.ResponsavelPreenchimento = respPreenchMatch.Groups[1].Value.Trim();

        var respOrientMatch = Regex.Match(ocrText, @"Responsável\s+pela\s+orientação[:\s]+([A-ZÀ-Ú\s]+?)(?=\n|$)", RegexOptions.IgnoreCase);
        if (respOrientMatch.Success)
            data.ResponsavelOrientacao = respOrientMatch.Groups[1].Value.Trim();

        return data;
    }

    public FichaCostaData ExtractFichaCosta(string ocrText)
    {
        var data = new FichaCostaData();

        // Tratamentos marcados
        data.AguaMagnetizada = Regex.IsMatch(ocrText, @"Água\s+magnetizada.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.AguaViva = Regex.IsMatch(ocrText, @"Água\s+[Vv]iva.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.Gotas = Regex.IsMatch(ocrText, @"Gotas.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.Gel = Regex.IsMatch(ocrText, @"Gel.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.Banho = Regex.IsMatch(ocrText, @"Banho.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.EscaldaPes = Regex.IsMatch(ocrText, @"Escalda.*?p[ée]s.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.FloralRescue = Regex.IsMatch(ocrText, @"[Ff]loral\s+[Rr]escue.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.AtendimentoTerapeuticoPNL = Regex.IsMatch(ocrText, @"PNL.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.ConversaFraterna = Regex.IsMatch(ocrText, @"Conversa\s+[Ff]raterna.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.TerapiaFlorais = Regex.IsMatch(ocrText, @"Terapia.*?[Ff]lorais.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.CultoEvangelhoLar = Regex.IsMatch(ocrText, @"Culto.*?[Ee]vangelho.*?lar.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.ColegiadoGuardioes = Regex.IsMatch(ocrText, @"[Cc]olegiado.*?[Gg]uardi[õo]es.*?[xX✓✔☑]", RegexOptions.IgnoreCase);
        data.ReuniaoPaisVelhosCaboclos = Regex.IsMatch(ocrText, @"Pais.*?[Vv]elhos.*?[Cc]aboclos.*?[xX✓✔☑]", RegexOptions.IgnoreCase);

        // Leitura recomendada
        var leituraMatch = Regex.Match(ocrText, @"[Ll]eitura.*?livro.*?[:\s]+(.+?)(?=\n|Reunião|$)", RegexOptions.IgnoreCase);
        if (leituraMatch.Success)
            data.LeituraRecomendada = leituraMatch.Groups[1].Value.Trim();

        // Orientações complementares
        var orientacoesMatch = Regex.Match(ocrText, @"Orientações\s+complementares[:\s]+(.+?)(?=Observações|$)", RegexOptions.IgnoreCase | RegexOptions.Singleline);
        if (orientacoesMatch.Success)
            data.OrientacoesComplementares = orientacoesMatch.Groups[1].Value.Trim();

        return data;
    }
}
```

---

## ☁️ 8. INTEGRAÇÃO COM FIREBASE STORAGE

**IStorageService.cs**
```csharp
public interface IStorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
    Task<bool> DeleteFileAsync(string fileUrl);
}
```

**FirebaseStorageService.cs**
```csharp
using Firebase.Storage;

public class FirebaseStorageService : IStorageService
{
    private readonly string _bucketUrl;

    public FirebaseStorageService(IConfiguration configuration)
    {
        _bucketUrl = configuration["Firebase:StorageBucket"]
            ?? throw new ArgumentNullException("Firebase:StorageBucket não configurado");
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var storage = new FirebaseStorage(_bucketUrl);

        var uniqueFileName = $"fichas/{DateTime.UtcNow:yyyyMMdd}/{Guid.NewGuid()}_{fileName}";

        var uploadTask = storage
            .Child(uniqueFileName)
            .PutAsync(fileStream);

        var downloadUrl = await uploadTask;

        return downloadUrl;
    }

    public async Task<bool> DeleteFileAsync(string fileUrl)
    {
        try
        {
            // Extrair path do arquivo da URL
            var uri = new Uri(fileUrl);
            var path = uri.AbsolutePath;

            var storage = new FirebaseStorage(_bucketUrl);
            await storage.Child(path).DeleteAsync();

            return true;
        }
        catch
        {
            return false;
        }
    }
}
```

**Instalar pacote:**
```bash
dotnet add package FirebaseStorage.net
```

---

## ⚙️ 9. CONFIGURAÇÃO (appsettings.json)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ClinicaAlmaDB;User Id=sa;Password=SuaSenhaForte123;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },
  "Firebase": {
    "StorageBucket": "clinica-alma.appspot.com"
  },
  "Tesseract": {
    "DataPath": "./tessdata"
  },
  "Azure": {
    "Vision": {
      "Endpoint": "https://sua-instancia.cognitiveservices.azure.com/",
      "Key": "sua-chave-aqui"
    }
  },
  "OpenAI": {
    "Endpoint": "https://api.openai.com/v1",
    "ApiKey": "sk-sua-chave-aqui",
    "DeploymentName": "gpt-4o"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://clinica-alma.web.app",
      "https://clinica-alma.firebaseapp.com"
    ]
  }
}
```

---

## 🚀 10. PROGRAM.CS (Configuração completa)

```csharp
using Microsoft.EntityFrameworkCore;
using ClinicaAlma.API.Data;
using ClinicaAlma.API.Services.Interfaces;
using ClinicaAlma.API.Services.Implementations;
using ClinicaAlma.API.Repositories.Interfaces;
using ClinicaAlma.API.Repositories.Implementations;
using ClinicaAlma.API.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// ============= SERVICES =============

// DbContext
builder.Services.AddDbContext<ClinicaAlmaDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    )
);

// Repositories
builder.Services.AddScoped<IPacienteRepository, PacienteRepository>();
builder.Services.AddScoped<IFichaRepository, FichaRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Services
builder.Services.AddScoped<IOcrService, TesseractOcrService>();
// OU: builder.Services.AddScoped<IOcrService, AzureVisionOcrService>();
// OU: builder.Services.AddScoped<IOcrService, OpenAIVisionOcrService>();

builder.Services.AddScoped<IFichaExtractionService, FichaExtractionService>();
builder.Services.AddScoped<IStorageService, FirebaseStorageService>();

// Controllers
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? new[] { "http://localhost:5173" }
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Clínica Alma API", Version = "v1" });
});

// ============= MIDDLEWARE PIPELINE =============

var app = builder.Build();

// Swagger (desenvolvimento)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware customizado de erro
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();

// CORS
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Health check
app.MapGet("/health", () => Results.Ok(new {
    status = "healthy",
    timestamp = DateTime.UtcNow
}));

app.Run();
```

---

## 🔥 11. MIDDLEWARE DE TRATAMENTO DE ERROS

**ErrorHandlingMiddleware.cs**
```csharp
using System.Net;
using System.Text.Json;

namespace ClinicaAlma.API.Middlewares;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro não tratado: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = exception switch
        {
            ArgumentException => (int)HttpStatusCode.BadRequest,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            _ => (int)HttpStatusCode.InternalServerError
        };

        var response = new
        {
            error = exception.Message,
            statusCode = context.Response.StatusCode,
            details = exception.InnerException?.Message
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
```

---

## 📦 12. PACOTES NUGET NECESSÁRIOS

Execute os seguintes comandos:

```bash
# Entity Framework Core
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.0

# OCR - Tesseract (escolha UMA das opções)
dotnet add package Tesseract --version 5.2.0

# OU OCR - Azure AI Vision (opcional)
dotnet add package Azure.AI.Vision.ImageAnalysis --version 1.0.0

# OU OCR - OpenAI (opcional)
dotnet add package Azure.AI.OpenAI --version 1.0.0-beta.12

# Processamento de imagens
dotnet add package SixLabors.ImageSharp --version 3.1.0

# Firebase Storage
dotnet add package FirebaseStorage.net --version 1.0.3

# Swagger
dotnet add package Swashbuckle.AspNetCore --version 6.5.0
```

---

## 🎯 13. ENDPOINTS DA API (Resumo)

### Pacientes
```
GET    /api/pacientes              → Listar todos
GET    /api/pacientes/{id}         → Buscar por ID
GET    /api/pacientes/codigo/{cod} → Buscar por código
GET    /api/pacientes/{id}/fichas  → Fichas do paciente
POST   /api/pacientes              → Criar novo
PUT    /api/pacientes/{id}         → Atualizar
DELETE /api/pacientes/{id}         → Deletar
```

### Fichas de Atendimento
```
GET    /api/fichas                 → Listar todas
GET    /api/fichas/{id}            → Buscar por ID (com sessões e tratamento)
POST   /api/fichas                 → Criar nova ficha
PUT    /api/fichas/{id}            → Atualizar
DELETE /api/fichas/{id}            → Deletar
```

### OCR
```
POST   /api/ocr/ficha-frente       → Upload e OCR da frente
POST   /api/ocr/ficha-costa        → Upload e OCR da costa
POST   /api/ocr/ficha-completa     → Upload e OCR completo (frente + costa)
```

### Health Check
```
GET    /health                     → Verificar saúde da API
```

---

## 🔐 14. SEGURANÇA E BOAS PRÁTICAS

1. **Validação de Dados:**
   - Use FluentValidation para validar DTOs
   - Valide tamanho máximo de arquivos (10MB)
   - Valide tipos de arquivo permitidos (JPEG, PNG)

2. **CORS:**
   - Configure apenas origens específicas
   - Nunca use `AllowAnyOrigin()` em produção

3. **Connection String:**
   - Use Azure Key Vault ou User Secrets em produção
   - Nunca commite connection strings reais

4. **Rate Limiting:**
   - Implemente rate limiting para OCR (recurso custoso)

5. **Logs:**
   - Use Serilog para logs estruturados
   - Envie logs para Application Insights (Azure)

---

## 🧪 15. TESTES

Crie testes unitários para:
- Repositories
- Services (especialmente OCR e extração)
- Controllers

Crie testes de integração para:
- Endpoints da API
- Operações de banco de dados

---

## 📚 16. DOCUMENTAÇÃO ADICIONAL

### Variáveis de Ambiente (.env ou appsettings)

```bash
# SQL Server
DB_SERVER=localhost
DB_NAME=ClinicaAlmaDB
DB_USER=sa
DB_PASSWORD=SuaSenhaForte123

# Firebase
FIREBASE_STORAGE_BUCKET=clinica-alma.appspot.com

# Azure AI Vision (opcional)
AZURE_VISION_ENDPOINT=https://...
AZURE_VISION_KEY=...

# OpenAI (opcional)
OPENAI_API_KEY=sk-...
OPENAI_DEPLOYMENT=gpt-4o
```

---

## 🎬 17. COMANDOS INICIAIS

```bash
# Criar projeto
dotnet new webapi -n ClinicaAlma.API
cd ClinicaAlma.API

# Adicionar pacotes (ver seção 12)

# Criar migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# Executar API
dotnet run

# Acessar Swagger
# http://localhost:5000/swagger
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar projeto ASP.NET Core Web API
- [ ] Configurar Entity Framework Core com SQL Server
- [ ] Criar entidades (Paciente, FichaAtendimento, Sessao, Tratamento)
- [ ] Implementar DbContext e configurações
- [ ] Criar migrations e atualizar banco de dados
- [ ] Implementar Repositories (Generic + específicos)
- [ ] Implementar Services (OCR, Extraction, Storage)
- [ ] Criar Controllers com todos os endpoints
- [ ] Configurar CORS para frontend Vue.js/Firebase
- [ ] Implementar middleware de erro
- [ ] Integrar Firebase Storage para upload de imagens
- [ ] Implementar OCR (Tesseract/Azure/OpenAI)
- [ ] Implementar extração de dados com Regex
- [ ] Configurar Swagger/OpenAPI
- [ ] Adicionar validação de dados (FluentValidation)
- [ ] Criar testes unitários
- [ ] Criar testes de integração
- [ ] Documentar API (README)
- [ ] Preparar para deploy (Azure App Service ou Docker)

---

## 🚢 18. DEPLOY (Azure App Service)

**Passo a passo rápido:**

1. **Publicar API:**
```bash
dotnet publish -c Release -o ./publish
```

2. **Criar App Service no Azure:**
```bash
az webapp create --resource-group ClinicaAlmaRG --plan ClinicaAlmaPlan --name clinica-alma-api --runtime "DOTNET|8.0"
```

3. **Deploy:**
```bash
az webapp deployment source config-zip --resource-group ClinicaAlmaRG --name clinica-alma-api --src ./publish.zip
```

4. **Configurar Connection String:**
   - No Portal Azure: App Service > Configuration > Connection Strings
   - Adicionar `DefaultConnection` com a string do SQL Server

5. **URL final:**
   - `https://clinica-alma-api.azurewebsites.net`

---

## 📞 PRÓXIMOS PASSOS

Após implementar o backend em C#:

1. **Atualizar Frontend:**
   - Mudar URL da API no `vite.config.js`
   - Atualizar chamadas axios para a nova URL

2. **Testar integração:**
   - Validar CORS
   - Testar upload de imagens
   - Validar OCR
   - Testar CRUD completo

3. **Monitoramento:**
   - Configurar Application Insights
   - Criar dashboards de performance

---

**FIM DO PROMPT**

Este prompt contém TUDO que você precisa para replicar o backend Node.js em C# com ASP.NET Core e SQL Server, mantendo compatibilidade total com o frontend Vue.js atual hospedado no Firebase.
