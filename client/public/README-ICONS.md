# Ícones PWA

Para a PWA funcionar corretamente, você precisa adicionar os seguintes arquivos de ícones nesta pasta:

## Ícones Necessários

- `pwa-192x192.png` - Ícone 192x192 pixels
- `pwa-512x512.png` - Ícone 512x512 pixels
- `favicon.ico` - Favicon 32x32 pixels
- `apple-touch-icon.png` - Ícone Apple 180x180 pixels (opcional)
- `masked-icon.svg` - Ícone SVG para Safari (opcional)

## Como Gerar os Ícones

### Opção 1: Online (Recomendado)

Use um gerador online gratuito:
1. Acesse: https://realfavicongenerator.net/
2. Faça upload de uma imagem (recomendado: 512x512 ou maior)
3. Baixe o pacote gerado
4. Copie os arquivos para esta pasta

### Opção 2: Ferramentas Locais

**Com ImageMagick:**
```bash
# Instale ImageMagick primeiro
convert logo.png -resize 192x192 pwa-192x192.png
convert logo.png -resize 512x512 pwa-512x512.png
convert logo.png -resize 32x32 favicon.ico
convert logo.png -resize 180x180 apple-touch-icon.png
```

**Com Node.js (sharp):**
```bash
npm install -g sharp-cli
sharp -i logo.png -o pwa-192x192.png resize 192 192
sharp -i logo.png -o pwa-512x512.png resize 512 512
```

### Opção 3: PWA Asset Generator

```bash
npx @vite-pwa/assets-generator --preset minimal public/logo.svg
```

## Placeholder Temporário

Enquanto não tiver ícones customizados, você pode usar placeholders:
- Baixe em: https://placehold.co/512x512/6366f1/white?text=Alma
- Renomeie para os tamanhos necessários

## Design Recomendado

- Fundo: Cor tema (#6366f1)
- Ícone: Símbolo simples e reconhecível
- Padding: 10-15% ao redor do símbolo
- Formato: PNG com transparência ou fundo sólido
- Resolução base: 512x512 ou maior

## Verificação

Após adicionar os ícones, verifique em:
- Chrome DevTools > Application > Manifest
- Lighthouse > PWA audit

Os ícones devem aparecer corretamente no manifesto.
