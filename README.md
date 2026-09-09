# Sconto SoMe M2M Report

Statická Vite React SPA pro MoM report výkonu instagramových postů Sconto CZ/SK.

## Lokální vývoj

```bash
pnpm install
pnpm run dev
```

## Build a náhled

```bash
pnpm run build
pnpm run preview
```

Build generuje klasický statický výstup:

```text
dist/index.html
dist/assets/...
```

## Aktualizace měsíčního reportu

Každý nový měsíc musí obsahovat kompletní datové řádky i samostatné thumbnaily všech kreativ. Zdrojové screenshoty se ukládají do `reference-library/YYYY-MM/`, vyříznuté náhledy do `public/thumbnails/YYYY-MM/` ve stejné struktuře jako předchozí měsíce a každý záznam musí odkazovat na odpovídající obrázek. Před dokončením je potřeba ověřit build i skutečné vykreslení náhledů v reportu.

## Cloudflare Pages

```text
Framework preset: Vite
Build command: pnpm run build
Build output directory: dist
Root directory: /
Node version: 22
```
