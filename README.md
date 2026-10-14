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

## Souhrn a grafy

Souhrn kampaní má vlastní přepínač `Celkem / Po měsících`, nezávislý na filtrech detailního reportu. Měsíční pohled zahrnuje celkové KPI i rozpad CZ/SK. Tlačítko `Vývoj metrik` nebo jednotlivá hodnota v rozpadu zemí otevře graf vývoje spendu, reach, engagements, Avg CPE nebo počtu postů. Kliknutí na sloupec vybere příslušný měsíc v souhrnu.

Měsíce se odvozují z `REPORT_DATA`. Souhrnné Avg CPE se počítá jako celkový spend / engagements; reach je součet dosahů jednotlivých položek. Duben a květen 2026 zahrnují pouze Instagram, od června také Facebook.

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
