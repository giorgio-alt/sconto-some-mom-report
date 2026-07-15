# SCONTO SoMe MoM Report — zadání pro Codex  
## Červen 2026

Repozitář: `giorgio-alt/sconto-some-mom-report`  
Default branch: `main`  
Projekt: Vite React SPA  
Deploy: Cloudflare Pages  
Build output: `dist/`

---

## 1. Cíl úkolu

Aktualizuj stávající dashboard o data za **červen 2026**. Maximálně navazuj na současnou architekturu, design system, datový model a existující UX.

Neprováděj redesign. Nejdříve projdi repo a zjisti:

- kde jsou uložena reportovací data,
- jak funguje rozdělení CZ/SK,
- jak fungují měsíční accordiony,
- kde se počítají benchmarky,
- kde se formátuje CPE a ostatní metriky,
- jak jsou mapovány miniatury,
- zda existují znovupoužitelné komponenty pro platformu a typ obsahu.

Zdrojová data jsou uvedena přímo v tomto dokumentu. Screenshoty používej pouze pro **cross-reference**, vizuální kontrolu a výřez miniatur. Nepřepisuj ručně ověřená data hodnotami získanými OCR.

---

## 2. Datová integrita

### Kanonický zdroj

Tabulky v tomto dokumentu jsou kanonickým vstupem pro červnový report.

Codex má:

1. porovnat data s přiloženými screenshoty,
2. ověřit, že nedošlo k překlepu nebo záměně řádku,
3. nahlásit případné nesrovnalosti,
4. neměnit kanonická data automaticky bez explicitního rozhodnutí uživatele.

### Zdvojené řádky v Meta Ads Manageru

Screenshoty zobrazují každý záznam dvakrát:

- souhrnný řádek `All`,
- podřízený řádek konkrétní kreativy.

Do datového modelu započítej každý příspěvek pouze jednou. Použij hodnoty ze souhrnného řádku s názvem reklamy / ad setu. Podřízený řádek slouží jen ke kontrole miniatury a textu kreativy.

### Odlišná optimalizace

Některé Facebook posty nebo videa byly optimalizovány na Landing Page Views namísto Post Engagements. Tyto řádky nesmí být převáděny na CPE a nesmí dostávat smyšlené engagementové hodnoty.

Použij:

```ts
optimizationMismatch: true
engagements: null
cpe: null
rankingEligible: false
```

V klientském UI zobraz neutrální stav, například:

```text
Nehodnoceno
Odlišná optimalizace
```

Takový záznam:

- nezahrnuj do engagementového benchmarku,
- nezahrnuj do TOP pořadí podle CPE,
- nezahrnuj do průměrného CPE segmentu,
- ponech v tabulce se skutečně dostupnými metrikami.

Pokud jsou pro interní layout test potřeba modelová data, musí být vedena pod samostatnými poli `modeledEngagements` a `modeledCpe`, viditelně označena jako odhad a nesmí vstoupit do klientských souhrnů, benchmarků ani žebříčků.

---

## 3. Zdrojové soubory

Codex dostane tyto screenshoty:

```text
CZ FB článek(1).png
SK FB článek(1).png
CZ FB posts(1).png
CZ IG(1).png
SK IG(1).png
SK FB posts(1).png
```

Důležité:

- Prvních pět relevantních zdrojů obsahuje převážně červnová data.
- `SK FB posts(1).png` má nastavené období **1.–31. 7. 2026**.
- Červencová SK Facebook data nesmí být zařazena do červnového reportu.
- Červencová data jsou na konci dokumentu uvedena pouze jako kontrolní appendix.

---

## 4. Cílová informační architektura

Zachovej hlavní přepínač země:

```text
CZ
SK
```

Uvnitř každé země rozděl obsah podle platformy a formátu:

```text
Instagram
├── Reels
└── Posty

Facebook
├── Video
├── Články
└── Posty
```

Pravidla:

- `Instagram / Reels`: pouze položky označené jako reels.
- `Instagram / Posty`: statické posty, carousely a ostatní nereelsový obsah.
- `Facebook / Video`: videoposty na Facebooku.
- `Facebook / Články`: linkové kampaně s metrikou Landing Page Views.
- `Facebook / Posty`: ostatní standardní Facebook posty.
- Prázdnou sekci skryj.
- Statické / standardní posty zobraz před videoformáty pouze tehdy, pokud to odpovídá stávající navigaci projektu. Jinak zachovej současný UX pattern a pouze přidej nové podsekce.

---

## 5. Normalizace názvů

V klientském dashboardu zobrazuj pouze čistý název obsahu:

- bez data,
- bez prefixu `reels`,
- bez prefixu `post`,
- bez prefixu `video`,
- bez prefixu `článek`,
- bez technického oddělovače na začátku.

Příklady:

```text
24/06/2026 - Článek - vana vs sprchový kout
→ Vana vs sprchový kout

10/06/2026 - post - video - Stodůlky
→ Stodůlky

08/06/2026 - reels - 43m2
→ 43m2
```

Původní název může zůstat v datech jako `sourceName`, ale nesmí se zobrazovat klientovi.

---

## 6. Doporučený datový model

Napoj se primárně na existující model. Pokud je potřeba jej rozšířit, preferuj tento tvar:

```ts
type Country = "CZ" | "SK";
type Platform = "instagram" | "facebook";
type ContentType = "reel" | "video" | "article" | "post";
type ResultType = "post_engagement" | "landing_page_view";

interface SocialPostRecord {
  id: string;
  month: "2026-06";
  country: Country;
  platform: Platform;
  contentType: ContentType;

  sourceName: string;
  title: string;

  spendEur: number;
  reach: number | null;
  frequency?: number | null;
  cpmEur?: number | null;
  linkClicks?: number | null;
  cpcEur?: number | null;
  ctrPct?: number | null;

  resultType: ResultType;
  results: number | null;
  costPerResultEur: number | null;

  engagements: number | null;
  cpeEur: number | null;
  landingPageViews: number | null;
  costPerLandingPageViewEur: number | null;

  optimizationMismatch?: boolean;
  rankingEligible: boolean;

  thumbnail?: string | null;
}
```

Nepřidávej paralelní datovou architekturu, pokud už repo obsahuje použitelný model. Raději stávající model rozšiř o platformu, formát a typ výsledku.

---

# 7. Kanonická data — červen 2026

## 7.1 CZ — Facebook — Články

Primární metrika segmentu:

```text
Cost per Landing Page View
```

| Název | Spend EUR | LP Views | Cost / LPV EUR | Link Clicks | CPC EUR | CTR | Reach | Frequency |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Vana vs sprchový kout | 39.99 | 90 | 0.44 | 124 | 0.32 | 1.04 % | 9,257 | 1.29 |
| Roztoči | 39.97 | 238 | 0.17 | 295 | 0.14 | 2.57 % | 9,209 | 1.25 |
| Party | 39.82 | 95 | 0.42 | 167 | 0.24 | 1.37 % | 9,497 | 1.28 |
| Malé kuchyně | 39.52 | 188 | 0.21 | 257 | 0.15 | 2.03 % | 9,458 | 1.34 |
| OD – dovolená doma | 39.37 | 189 | 0.21 | 233 | 0.17 | 1.76 % | 10,824 | 1.22 |
| Bílý koberec | 38.84 | 122 | 0.32 | 170 | 0.23 | 1.49 % | 8,829 | 1.29 |

### Zdrojový total

| Spend EUR | LP Views | Cost / LPV EUR | Link Clicks | CPC EUR | CTR | Unique Reach | Frequency |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 237.51 | 922 | 0.26 | 1,246 | 0.19 | 1.71 % | 45,991 | 1.58 |

### Přesně dopočtený vážený benchmark

```text
237.51 / 922 = 0.257603 EUR za LP View
```

Pro klientský display použij rounding podle stávajícího projektu, pravděpodobně:

```text
0.26 EUR
```

---

## 7.2 CZ — Facebook — Video

| Název | Spend EUR | Reach | Engagements | CPE EUR | CPM EUR | Stav |
|---|---:|---:|---:|---:|---:|---|
| Série VIOS | 24.34 | 7,939 | 3,739 | 0.01 | 2.65 | validní engagement |
| 43m2 | 19.22 | 3,635 | null | null | 4.16 | odlišná optimalizace |
| Stodůlky | 17.98 | 3,193 | null | null | 3.87 | odlišná optimalizace |

### Souhrn segmentu

```text
Celkový spend všech FB videí: 61.54 EUR
Spend s validním engagementovým výsledkem: 24.34 EUR
Validní engagements: 3,739
Přesně dopočtené validní CPE: 24.34 / 3,739 = 0.0065098 EUR
```

Do benchmarku a pořadí vstupuje pouze `Série VIOS`.

---

## 7.3 CZ — Facebook — Posty

| Název | Spend EUR | Reach | Výsledek | Cost / Result EUR | CPM EUR | Stav |
|---|---:|---:|---:|---:|---:|---|
| Příliš mnoho nábytku | 7.25 | 2,142 | 3 LP Views | 2.42 | 3.35 | odlišná optimalizace |

Datový zápis:

```ts
{
  title: "Příliš mnoho nábytku",
  resultType: "landing_page_view",
  landingPageViews: 3,
  costPerLandingPageViewEur: 2.42,
  engagements: null,
  cpeEur: null,
  optimizationMismatch: true,
  rankingEligible: false
}
```

### Zdrojový total celé CZ Facebook non-article sestavy

Screenshot kombinuje FB videa a FB post:

| Spend EUR | Unique Reach | CPM EUR |
|---:|---:|---:|
| 68.79 | 16,386 | 3.34 |

Tento total nepoužívej jako total jediné podsekce. Jde o společný total filtrů pro Facebook videa a post.

---

## 7.4 CZ — Instagram — Reels

| Název | Spend EUR | Engagements | Zdrojové CPE EUR | Reach | CPM EUR |
|---|---:|---:|---:|---:|---:|
| Stodůlky | 19.97 | 4,212 | 0.005 | 8,210 | 2.22 |
| Vychytávky do kuchyně | 7.97 | 2,003 | 0.004 | 3,726 | 1.92 |
| 43m2 | 7.94 | 2,076 | 0.004 | 3,652 | 1.88 |

### Dopočtený souhrn

```text
Spend: 35.88 EUR
Engagements: 8,291
Vážené CPE: 35.88 / 8,291 = 0.0043276 EUR
```

Reels CPE zobrazuj na **3 desetinná místa**, pokud stávající projekt nemá přesnější pravidlo.

---

## 7.5 CZ — Instagram — Posty

| Název | Spend EUR | Engagements | Zdrojové CPE EUR | Reach | CPM EUR |
|---|---:|---:|---:|---:|---:|
| Box ACOM | 7.96 | 100 | 0.08 | 907 | 7.24 |
| Bed concept | 4.00 | 27 | 0.15 | 130 | 27.78 |
| Carousel – postele | 3.99 | 24 | 0.17 | 137 | 29.12 |
| Fandění | 3.99 | 42 | 0.10 | 114 | 30.00 |
| Každý cm se počítá | 3.96 | 32 | 0.12 | 262 | 14.30 |
| Příliš mnoho nábytku | 3.93 | 39 | 0.10 | 319 | 10.68 |

### Dopočtený souhrn

```text
Spend: 27.83 EUR
Engagements: 264
Vážené CPE: 27.83 / 264 = 0.1054167 EUR
```

Poznámka:

`Box ACOM` má v názvu datum 05/05/2026, ale měl delivery v reportovacím období 1.–30. 6. 2026. Do červnového reportu proto patří. Datum z názvu se klientovi nezobrazuje.

---

## 7.6 CZ — Instagram — zdrojový total

| Spend EUR | Engagements | Cost / Engagement EUR | Unique Reach | CPM EUR |
|---:|---:|---:|---:|---:|
| 63.71 | 8,555 | 0.01 | 15,236 | 3.26 |

Kontrola:

```text
35.88 + 27.83 = 63.71 EUR
8,291 + 264 = 8,555 engagements
```

---

## 7.7 SK — Facebook — Články

Primární metrika segmentu:

```text
Cost per Landing Page View
```

| Název | Spend EUR | LP Views | Cost / LPV EUR | Link Clicks | CPC EUR | CTR | Reach | Frequency |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Zahradní oslava | 19.96 | 71 | 0.28 | 115 | 0.17 | 1.09 % | 6,796 | 1.55 |
| Vana vs sprcha | 19.93 | 79 | 0.25 | 100 | 0.20 | 1.05 % | 7,239 | 1.31 |
| Roztoči | 19.89 | 145 | 0.14 | 177 | 0.11 | 2.03 % | 7,056 | 1.23 |
| OD – dovolená na zahradě | 19.68 | 181 | 0.11 | 206 | 0.10 | 2.22 % | 7,558 | 1.23 |
| Malé kuchyně | 19.67 | 175 | 0.11 | 218 | 0.09 | 1.99 % | 8,014 | 1.37 |
| Kupované koření | 19.60 | 136 | 0.14 | 188 | 0.10 | 1.45 % | 10,502 | 1.24 |
| Bílý koberec | 19.46 | 128 | 0.15 | 177 | 0.11 | 1.53 % | 9,219 | 1.26 |

### Zdrojový total

| Spend EUR | LP Views | Cost / LPV EUR | Link Clicks | CPC EUR | CTR | Unique Reach | Frequency |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 138.19 | 915 | 0.15 | 1,181 | 0.12 | 1.61 % | 41,014 | 1.79 |

### Přesně dopočtený vážený benchmark

```text
138.19 / 915 = 0.151027 EUR za LP View
```

Pro klientský display použij:

```text
0.15 EUR
```

---

## 7.8 SK — Instagram — Reels

| Název | Spend EUR | Engagements | Zdrojové CPE EUR | Reach |
|---|---:|---:|---:|---:|
| Stoličky | 7.97 | 1,874 | 0.004 | 3,995 |
| Malé kuchyně | 7.97 | 2,312 | 0.003 | 4,837 |
| 43m2 | 7.96 | 2,163 | 0.004 | 4,599 |
| Kuchyně | 7.93 | 1,789 | 0.004 | 4,069 |

### Dopočtený souhrn

```text
Spend: 31.83 EUR
Engagements: 8,138
Vážené CPE: 31.83 / 8,138 = 0.0039113 EUR
```

---

## 7.9 SK — Instagram — Posty

| Název | Spend EUR | Engagements | Zdrojové CPE EUR | Reach |
|---|---:|---:|---:|---:|
| Box ACOM | 4.94 | 58 | 0.09 | 516 |
| Fandění | 4.00 | 34 | 0.12 | 182 |
| Bed concept | 4.00 | 30 | 0.13 | 173 |
| Každý cm se počítá | 3.97 | 46 | 0.09 | 401 |
| Carousel – postele | 3.97 | 31 | 0.13 | 249 |
| Příliš mnoho nábytku | 3.92 | 38 | 0.10 | 375 |

### Dopočtený souhrn

```text
Spend: 24.80 EUR
Engagements: 237
Vážené CPE: 24.80 / 237 = 0.1046414 EUR
```

---

## 7.10 SK — Instagram — zdrojový total

| Spend EUR | Engagements | Cost / Engagement EUR | Unique Reach |
|---:|---:|---:|---:|
| 56.63 | 8,375 | 0.01 | 14,993 |

Kontrola:

```text
31.83 + 24.80 = 56.63 EUR
8,138 + 237 = 8,375 engagements
```

---

## 7.11 SK — Facebook — Video a Posty

Pro červen nejsou v dodaných podkladech ověřená SK Facebook Video/Post data.

Proto:

- nevytvářej červnové záznamy z červencového screenshotu,
- sekce skryj, pokud repo nepoužívá explicitní empty state,
- nevytvářej nuly ani odhady.

---

# 8. Souhrn segmentových benchmarků

| Země | Platforma | Segment | Spend EUR | Results | Vážený Cost / Result EUR |
|---|---|---|---:|---:|---:|
| CZ | Facebook | Články | 237.51 | 922 LP Views | 0.257603 |
| CZ | Facebook | Video — validní řádky | 24.34 | 3,739 engagements | 0.006510 |
| CZ | Instagram | Reels | 35.88 | 8,291 engagements | 0.004328 |
| CZ | Instagram | Posty | 27.83 | 264 engagements | 0.105417 |
| SK | Facebook | Články | 138.19 | 915 LP Views | 0.151027 |
| SK | Instagram | Reels | 31.83 | 8,138 engagements | 0.003911 |
| SK | Instagram | Posty | 24.80 | 237 engagements | 0.104641 |

Facebook články benchmarkuj podle `costPerLandingPageViewEur`.

Instagram Reels, Instagram Posty a Facebook Video benchmarkuj podle `cpeEur`.

Nikdy nemíchej:

- CZ a SK,
- Instagram a Facebook,
- Reels a standardní posty,
- Facebook Video a Instagram Reels,
- články a engagementové formáty.

---

# 9. Benchmarking a pořadí

Použij existující škálovací logiku projektu. Nevytvářej nové absolutní hranice, pokud už repo obsahuje funkční semafor.

Povinná pravidla:

```text
nižší cost per result = lepší výkon
```

Do segmentového benchmarku zahrnuj pouze:

```ts
rankingEligible === true
```

Řádky s `cpeEur: null` nebo `optimizationMismatch: true`:

- nezahrnuj do průměru,
- nezahrnuj do TOP pořadí,
- neoznačuj červeně jako špatný výkon,
- ukaž neutrální badge.

Rounding:

```text
Instagram Reels CPE: 3 desetinná místa
Facebook Video CPE: 3 desetinná místa
Standardní posty CPE: 2 desetinná místa
Facebook články Cost / LPV: 2 desetinná místa
CTR: 2 desetinná místa, pokud projekt nemá jiné pravidlo
```

Výpočty prováděj z nezakulacených hodnot:

```ts
costPerResult = spend / results
```

Hodnotu ze screenshotu používej jako cross-check. Zaokrouhluj až při renderu.

---

# 10. Miniatury

Uživatel dodá Codexu zdrojové screenshoty. Z nich vytvoř miniatury jednotlivých příspěvků.

Postup:

1. Nejdříve zjisti, jak jsou miniatury řešeny ve stávajícím repu.
2. Zachovej existující rozměr, radius, object-fit a lazy-loading.
3. Ze screenshotu vyřízni pouze samotnou kreativu v kolonce `Ad creative`.
4. Nezahrnuj okolní text, metriky, rámeček tabulky ani UI Meta Ads Manageru.
5. Každou miniaturu přiřaď podle názvu a pozice řádku.
6. Při nejistém matchi nehádej. Nastav `thumbnail: null` a uveď položku v závěrečném reportu.
7. Optimalizuj obrázky do webového formátu používaného repem; pokud projekt nemá standard, použij WebP.
8. Nevytvářej duplicity pro souhrnný a podřízený řádek stejné reklamy.

Doporučená struktura, pouze pokud repo nemá vlastní konvenci:

```text
public/
└── thumbnails/
    └── 2026-06/
        ├── cz/
        │   ├── instagram/
        │   │   ├── reels/
        │   │   └── posts/
        │   └── facebook/
        │       ├── video/
        │       ├── articles/
        │       └── posts/
        └── sk/
            ├── instagram/
            │   ├── reels/
            │   └── posts/
            └── facebook/
                ├── video/
                ├── articles/
                └── posts/
```

Použij stabilní slugy, například:

```text
vana-vs-sprchovy-kout.webp
stodulky.webp
prilis-mnoho-nabytku.webp
```

---

# 11. Klientské UI

Zachovej současný liquid-glass vzhled.

Pro nové členění použij existující navigační pattern. Preferovaná hierarchie:

```text
Země → Platforma → Typ obsahu → Měsíc
```

Měsíční accordiony:

- defaultně zavřené,
- v zavřeném stavu viditelný summary,
- tlačítko `Rozbalit / Sbalit`,
- šipka reagující na stav.

Facebook články musí vizuálně jasně používat metriku:

```text
Cost / LPV
```

Nesmí být označeny jako CPE.

Řádky s odlišnou optimalizací zobraz bez dramatického varování. Použij neutrální, stručný badge:

```text
Nehodnoceno
```

Detail / tooltip může uvést:

```text
Odlišný optimalizační cíl — položka není zahrnuta do CPE benchmarku.
```

---

# 12. Cross-reference checklist pro Codex

Před změnou kódu ověř:

- [ ] Časový filtr každého screenshotu.
- [ ] Že každý příspěvek není započten dvakrát.
- [ ] Že názvy odpovídají správné kreativě.
- [ ] Že CZ a SK nejsou prohozené.
- [ ] Že FB články používají LP Views.
- [ ] Že IG Reels a FB Video nejsou sloučeny do jednoho benchmarku.
- [ ] Že standardní IG posty nejsou zařazeny mezi Reels.
- [ ] Že červencová SK FB data nejsou v červnovém reportu.
- [ ] Že součty spendu a results sedí na totals uvedené v tomto dokumentu.
- [ ] Že reach totals ze screenshotu nejsou nahrazeny prostým součtem row-level reach. Total Reach v Ads Manageru je deduplikovaný.
- [ ] Že výpočty používají nezakulacené hodnoty.
- [ ] Že miniatury odpovídají správným postům.

---

# 13. Implementační postup

1. Vytvoř novou branch, například:

```text
feature/june-2026-report
```

2. Projdi repo a popiš krátce zamýšlené změny.
3. Rozšiř stávající datový model pouze tam, kde je to nutné.
4. Přidej červnová data.
5. Implementuj nové Facebook členění:
   - Video,
   - Články,
   - Posty.
6. Rozděl Instagram:
   - Reels,
   - Posty.
7. Přidej miniatury.
8. Spusť:
   - install,
   - lint,
   - testy, pokud existují,
   - produkční build.
9. Zkontroluj responzivitu.
10. Připrav commit a PR.

Doporučený commit:

```text
feat: add June 2026 SCONTO social report
```

---

# 14. Acceptance criteria

Úkol je hotový pouze tehdy, když:

- [ ] Dashboard obsahuje červen 2026.
- [ ] CZ a SK jsou oddělené.
- [ ] Instagram je rozdělen na Reels a Posty.
- [ ] Facebook je rozdělen na Video, Články a Posty.
- [ ] V názvech nejsou data ani technické prefixy.
- [ ] Články používají Cost / LPV, nikoliv CPE.
- [ ] Benchmarky jsou oddělené podle země, platformy a formátu.
- [ ] Odlišně optimalizované položky nemají vymyšlené engagementy.
- [ ] Odlišně optimalizované položky nevstupují do CPE benchmarku ani TOP pořadí.
- [ ] Červencová SK Facebook data nejsou v červnovém reportu.
- [ ] Miniatury jsou správně vyříznuté a přiřazené.
- [ ] Vite build proběhne bez chyby.
- [ ] Výstup je kompatibilní s Cloudflare Pages.
- [ ] Nejsou rozbité starší měsíce.
- [ ] Codex na konci vypíše změněné soubory, výsledky kontrol a případné nejasnosti.

---

# Appendix A — dodaný screenshot SK Facebook obsahuje červenec

Tato data nejsou součástí červnového reportu. Jsou zde pouze proto, aby Codex chápal, proč se soubor nesmí použít jako červnový zdroj.

Období screenshotu:

```text
1. 7. 2026 – 31. 7. 2026
```

| Název | Typ výsledku | Reach | Results | Spend EUR | Cost / Result EUR |
|---|---|---:|---:|---:|---:|
| Kuchyně | Post Engagement | 9,834 | 5,483 | 15.97 | 0.003 |
| Růžová židle | Landing Page View | 4,748 | 47 | 15.96 | 0.34 |
| Koupák | Landing Page View | 7,365 | 184 | 11.98 | 0.07 |
| Malý byt | Landing Page View | 6,495 | 48 | 6.23 | 0.13 |
| Dětský pokoj | Landing Page View | 2,001 | 23 | 5.86 | 0.25 |
| Vychytávky do kuchyně | Post Engagement | 5,874 | 3,145 | 5.53 | 0.002 |
| Bed concept | Post Engagement | 1,655 | 74 | 3.92 | 0.05 |
| Série JOAKIMIS | Post Engagement | 1,575 | 105 | 1.71 | 0.02 |

Zdrojový total screenshotu:

```text
Spend: 67.16 EUR
Unique Reach: 32,452
Results: multiple conversion types
```

Appendix nevkládej do klientského červnového dashboardu.
