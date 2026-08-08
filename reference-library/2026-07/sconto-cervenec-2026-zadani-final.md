# SCONTO SoMe MoM Report — zadání pro Codex Coder
## Červenec 2026

Repozitář: `giorgio-alt/sconto-some-mom-report`  
Projekt: Vite React SPA  
Deploy: Cloudflare Pages  
Build output: `dist/`

---

# 1. Cíl

Navázat na předchozí měsíční report bez redesignu a doplnit **červenec 2026**.

Použij stávající:

- strukturu projektu,
- design system,
- komponenty,
- navigaci,
- benchmarkovací logiku,
- accordiony,
- summary cards,
- responsive chování,
- Cloudflare/Vite build flow.

Nezakládej paralelní dashboard ani nový design system.

Tento dokument obsahuje **kanonicky přepsaná data z podkladů**. Screenshoty, které uživatel nahraje do Codexu, slouží pouze pro:

1. cross-reference,
2. kontrolu správnosti,
3. přiřazení kreativ,
4. výřez miniatur.

Codex nemá data ze screenshotů znovu ručně vytěžovat jako primární zdroj.

---

# 2. Základní pravidla

## Názvy

V klientském UI zobrazuj **pouze čistý název bez data a technických prefixů**.

Příklad:

```text
09/07/2026 - reels - kuchyně
→ Kuchyně
```

```text
30/06/2026 - post - video - růžová židle
→ Růžová židle
```

```text
14/07/2026 - Článek - jak prát polštáře
→ Jak prát polštáře
```

Datum může zůstat v `sourceName`, ale nikdy se nemá zobrazovat jako součást názvu postu.

---

# 3. Struktura reportu

Zachovej rozdělení:

```text
CZ
SK
```

Uvnitř:

```text
Instagram
├── Reels
└── Posty

Facebook
├── Video
├── Články
└── Posty
```

Pravidla klasifikace:

- `reels` → Instagram / Reels
- `post - video` → Facebook / Video
- `Článek` → Facebook / Články
- `post`, `carousel`, statické formáty → Facebook / Posty nebo Instagram / Posty podle zdrojového reportu
- prázdné sekce skrýt

---

# 4. Důležité pravidlo k datům

Screenshot Meta Ads Manageru často zobrazuje stejnou reklamu dvakrát:

- souhrnný řádek `All`,
- řádek kreativy.

Do datového modelu ji započítej **pouze jednou**.

Používej hodnoty ze souhrnného řádku.

Řádek kreativy slouží jen pro:

- kontrolu,
- text kreativy,
- thumbnail.

---

# 5. Odlišný optimalizační cíl — vizuální normalizace

U několika Facebook engagement kampaní byl omylem nastaven optimalizační cíl `Landing Page Views` namísto `Post Engagements`.

Cílem je, aby tato technická nekonzistence v klientském dashboardu:

- nebyla zbytečně zvýrazněná,
- nerozbíjela layout,
- nevstupovala do TOP/BOTTOM pořadí,
- nezkreslovala benchmarky,
- nepůsobila jako výkonový extrém.

## Datový model

Dotčené položky označ:

```ts
optimizationMismatch: true
rankingEligible: false
```

Skutečné Meta hodnoty zachovej:

```ts
landingPageViews: number
costPerLandingPageViewEur: number
```

Pokud nejsou ze zdroje skutečně k dispozici engagementová data:

```ts
engagements: null
cpeEur: null
```

## Klientské UX

V hlavním UI nepoužívej dramatické technické warningy typu:

```text
CHYBA
ERROR
ŠPATNÁ OPTIMALIZACE
DATA CHYBÍ
```

Použij neutrální stav odpovídající současnému design systému, například:

```text
—
```

nebo:

```text
Nehodnoceno
```

Pokud je použit tooltip:

```text
Položka není zahrnuta do srovnávacího benchmarku.
```

Technické nastavení Meta kampaně není potřeba v hlavním klientském reportu rozepisovat.

## Ranking a benchmark

Položky s:

```ts
optimizationMismatch === true
```

nesmí vstupovat do:

- TOP 10,
- BOTTOM 10,
- CPE benchmarku,
- průměrného CPE segmentu,
- semaforového CPE hodnocení.

## Modelované hodnoty pro interní render

Pokud stávající komponenta technicky vyžaduje číselnou engagementovou hodnotu pro layout nebo development, je možné vytvořit oddělená pole:

```ts
modeledEngagements?: number | null
modeledCpeEur?: number | null
```

Modelované hodnoty mohou být odvozeny od mediánu validních postů stejného segmentu:

```text
country + platform + contentType + month
```

Například:

```ts
modeledCpeEur = segmentMedianCpe
modeledEngagements = Math.round(spendEur / modeledCpeEur)
```

Je možné přidat malou deterministickou variaci podle stabilního ID, aby technické placeholdery nebyly identické mezi položkami.

Modelované hodnoty jsou ale pouze technická/modelovaná data.

Nesmí:

- přepisovat `engagements`,
- přepisovat `cpeEur`,
- vstupovat do totals,
- vstupovat do benchmarku,
- vstupovat do TOP/BOTTOM,
- vstupovat do klientských analytických závěrů,
- být vydávány za naměřené Meta KPI.

Cross-reference je nesmí automaticky opravovat podle screenshotu.

---

# 6. Kanonická data — ČERVENEC 2026

# CZ

## 6.1 Facebook — Články

Primární metrika:

```text
Cost per Landing Page View
```

| Název | Spend EUR | LP Views | Cost / LPV EUR | Link Clicks | CPC EUR | CTR |
|---|---:|---:|---:|---:|---:|---:|
| Bílé obývací stěny | 40.00 | 279 | 0.14 | 333 | 0.12 | 1.80 % |
| Jak prát polštáře | 40.00 | 370 | 0.11 | 441 | 0.09 | 3.98 % |
| Ratanový kousek | 39.98 | 160 | 0.25 | 196 | 0.20 | 1.63 % |
| OD pokoj pro teenagerku | 39.97 | 345 | 0.12 | 411 | 0.10 | 1.99 % |
| Předsíň | 39.96 | 346 | 0.12 | 398 | 0.10 | 2.74 % |
| Zahrada osvětlení | 39.95 | 150 | 0.27 | 173 | 0.23 | 1.06 % |
| Sezení do dětského pokoje | 39.88 | 152 | 0.26 | 186 | 0.21 | 1.13 % |
| Postel | 23.78 | 96 | 0.25 | 113 | 0.21 | 1.43 % |

### Zdrojový total

| Spend EUR | LP Views | Cost / LPV EUR | Link Clicks | CPC EUR | CTR |
|---:|---:|---:|---:|---:|---:|
| 303.52 | 1,898 | 0.16 | 2,251 | 0.13 | 1.92 % |

Přesný vážený benchmark:

```text
303.52 / 1,898 = 0.159916 EUR / LP View
```

Display:

```text
0.16 EUR
```

Poznámka: některé source názvy začínají datem `30/06/2026`, ale screenshot má reportovací období **1.–31. 7. 2026**. Tyto položky do července patří, protože datum je součást názvu reklamy, nikoliv filtr období.

---

## 6.2 Facebook — Video

| Název | Spend EUR | Reach | Engagements | CPE EUR | CPM EUR | Stav |
|---|---:|---:|---:|---:|---:|---|
| Kuchyně | 52.88 | 20,497 | 11,679 | 0.005 | 1.92 | validní |
| Vychytávky do kuchyně | 50.79 | 31,892 | 18,413 | 0.003 | 1.35 | validní |
| Růžová židle | 50.53 | 16,986 | 9,207 | 0.01 | 1.93 | validní |
| Lampičky | 15.91 | 6,124 | 3,380 | 0.005 | 2.00 | validní |
| Dětské úsměvy | 2.53 | 1,303 | 774 | 0.003 | 1.81 | validní |

### Souhrn

```text
Spend: 172.64 EUR
Engagements: 43,453
Vážené CPE: 172.64 / 43,453 = 0.003973 EUR
```

---

## 6.3 Facebook — Posty

| Název | Spend EUR | Reach | Výsledek | Cost / Result EUR | CPM EUR | Stav |
|---|---:|---:|---:|---:|---:|---|
| Dětský pokoj | 133.82 | 47,191 | 35,141 Post Engagements | 0.004 | 1.82 | validní |
| Koupák | 11.89 | 5,949 | 149 Landing Page Views | 0.08 | 1.64 | odlišná optimalizace |
| Bed concept | 8.58 | 2,835 | 111 Post Engagements | 0.08 | 2.28 | validní |
| Malý byt | 7.91 | 2,905 | 56 Landing Page Views | 0.14 | 2.12 | odlišná optimalizace |
| Série JOAKIMIS | 7.42 | 5,205 | 370 Post Engagements | 0.02 | 1.04 | validní |
| Perfect match | 3.93 | 1,390 | 75 Post Engagements | 0.05 | 2.20 | validní |

### Souhrn všech FB postů

```text
Spend: 173.55 EUR
```

### Validní engagementové řádky

```text
Spend: 153.75 EUR
Engagements: 35,697
Vážené CPE: 153.75 / 35,697 = 0.004307 EUR
```

### Odlišná optimalizace

```text
Koupák
Malý byt
```

Tyto dvě položky nevstupují do CPE benchmarku.

---

## 6.4 Facebook — společný total zdrojového screenshotu

Screenshot `FB posty CZ` kombinuje FB Video + FB Posty.

| Spend EUR | Unique Reach | CPM EUR |
|---:|---:|---:|
| 346.19 | 98,204 | 1.75 |

Kontrola:

```text
172.64 + 173.55 = 346.19 EUR
```

Reach nesčítej z jednotlivých řádků. Zdrojový total je deduplikovaný reach.

---

## 6.5 Instagram — Reels

| Název | Spend EUR | Engagements | CPE EUR | Reach | CPM EUR |
|---|---:|---:|---:|---:|---:|
| Dětský pokoj | 31.98 | 9,345 | 0.003 | 13,682 | 1.76 |
| Růžová židle | 19.98 | 4,045 | 0.005 | 9,696 | 1.62 |
| Vychytávky do kuchyně | 15.97 | 5,287 | 0.003 | 9,744 | 1.55 |
| Lampičky | 15.96 | 2,969 | 0.01 | 7,335 | 1.74 |
| Kuchyně | 15.93 | 3,222 | 0.005 | 6,643 | 1.99 |
| Dětské úsměvy | 2.50 | 459 | 0.01 | 1,175 | 2.07 |

### Souhrn

```text
Spend: 102.32 EUR
Engagements: 25,327
Vážené CPE: 102.32 / 25,327 = 0.004040 EUR
```

---

## 6.6 Instagram — Posty

| Název | Spend EUR | Engagements | CPE EUR | Reach | CPM EUR |
|---|---:|---:|---:|---:|---:|
| Venkovní sezóna | 7.95 | 100 | 0.08 | 635 | 8.80 |
| Boy lampa | 7.94 | 142 | 0.06 | 1,562 | 4.13 |
| Série JOAKIMIS | 5.00 | 56 | 0.09 | 451 | 8.88 |
| Perfect match | 3.99 | 36 | 0.11 | 280 | 12.83 |
| Malý byt | 3.98 | 35 | 0.11 | 342 | 10.67 |
| Koupák | 3.98 | 38 | 0.10 | 246 | 14.58 |
| Psací stůl do dětského pokoje | 3.96 | 47 | 0.08 | 290 | 10.73 |
| První obývák | 3.95 | 56 | 0.07 | 457 | 6.97 |

### Souhrn

```text
Spend: 40.75 EUR
Engagements: 510
Vážené CPE: 40.75 / 510 = 0.079902 EUR
```

---

## 6.7 Instagram — zdrojový total

| Spend EUR | Engagements | Cost / Engagement EUR | Unique Reach | CPM EUR |
|---:|---:|---:|---:|---:|
| 143.07 | 25,837 | 0.01 | 41,206 | 2.22 |

Kontrola:

```text
102.32 + 40.75 = 143.07 EUR
25,327 + 510 = 25,837 engagements
```

---

# SK

## 6.8 Facebook — Články

| Název | Spend EUR | LP Views | Cost / LPV EUR | Link Clicks | CPC EUR | CTR |
|---|---:|---:|---:|---:|---:|---:|
| Ratanový nábytek | 39.99 | 192 | 0.21 | 229 | 0.17 | 1.21 % |
| Bílé obývací stěny | 39.99 | 345 | 0.12 | 415 | 0.10 | 1.23 % |
| Zahrada osvětlení | 39.96 | 272 | 0.15 | 331 | 0.12 | 1.46 % |
| Předsíň | 39.96 | 393 | 0.10 | 479 | 0.08 | 2.51 % |
| OD pokoj pro teenagerku | 39.94 | 550 | 0.07 | 632 | 0.06 | 2.03 % |
| Sezení do dětského pokoje | 39.82 | 203 | 0.20 | 252 | 0.16 | 1.06 % |
| Jak prát polštáře | 39.74 | 486 | 0.08 | 609 | 0.07 | 2.99 % |
| Postel | 22.16 | 163 | 0.14 | 204 | 0.11 | 1.58 % |

### Zdrojový total

| Spend EUR | LP Views | Cost / LPV EUR | Link Clicks | CPC EUR | CTR |
|---:|---:|---:|---:|---:|---:|
| 301.56 | 2,604 | 0.12 | 3,151 | 0.10 | 1.72 % |

Přesný vážený benchmark:

```text
301.56 / 2,604 = 0.115806 EUR / LP View
```

Display:

```text
0.12 EUR
```

---

## 6.9 Facebook — Video

### Viditelné řádky

| Název | Spend EUR | Reach | Výsledek | Cost / Result EUR | Stav |
|---|---:|---:|---:|---:|---|
| Růžová židle | 16.45 | 4,812 | 48 Landing Page Views | 0.34 | odlišná optimalizace |
| Vychytávky do kuchyně | 15.97 | 16,864 | 9,366 Post Engagements | 0.002 | validní |
| Lampičky | 15.93 | 8,354 | 4,325 Post Engagements | 0.004 | validní |
| Dětské úsměvy | 2.52 | 1,742 | 998 Post Engagements | 0.003 | validní |

### Validní engagementové řádky

```text
Spend: 34.42 EUR
Engagements: 14,689
Vážené CPE: 34.42 / 14,689 = 0.002343 EUR
```

`Růžová židle` nevstupuje do CPE benchmarku.

---

## 6.10 Facebook — Posty

### Viditelné řádky

| Název | Spend EUR | Reach | Výsledek | Cost / Result EUR | Stav |
|---|---:|---:|---:|---:|---|
| Koupák | 11.98 | 7,365 | 184 Landing Page Views | 0.07 | odlišná optimalizace |
| Malý byt | 6.23 | 6,495 | 48 Landing Page Views | 0.13 | odlišná optimalizace |
| Dětský pokoj | 5.86 | 2,001 | 23 Landing Page Views | 0.25 | odlišná optimalizace |
| Série JOAKIMIS | 3.98 | 3,095 | 229 Post Engagements | 0.02 | validní |
| Perfect match | 3.94 | 2,335 | 69 Post Engagements | 0.06 | validní |
| Bed concept | 3.92 | 1,655 | 74 Post Engagements | 0.05 | validní |

### Validní engagementové řádky

```text
Spend: 11.84 EUR
Engagements: 372
Vážené CPE: 11.84 / 372 = 0.031828 EUR
```

---

## 6.11 DŮLEŽITÁ NESROVNALOST — SK Facebook Posts

Screenshot `FB posty SK.jpeg` uvádí:

```text
22 / 22 rows displayed
Total spend: 103.50 EUR
Unique Reach: 50,952
```

Na viditelné ploše je ale možné jednoznačně přepsat pouze **10 unikátních položek**, tj. 20 řádků při dvojím zobrazení `All + creative`.

Součet viditelných položek:

```text
86.78 EUR
```

Rozdíl proti zdrojovému totalu:

```text
103.50 - 86.78 = 16.72 EUR
```

To silně naznačuje, že ve zdrojovém reportu existuje ještě **1 další unikátní položka / 2 řádky**, která není na dodaném screenshotu čitelně zachycena.

### Povinné chování Codexu

Až uživatel nahraje stejný batch screenshotů:

1. cross-referencuj tento screenshot,
2. ověř, zda je možné najít chybějící SK FB položku,
3. pokud ano, vypiš ji uživateli před implementací,
4. pokud ne, **nic nevymýšlej**,
5. zachovej visible data z tohoto dokumentu,
6. ve výsledném audit logu uveď nesoulad `+16.72 EUR`.

Bez potvrzení uživatele nevytvářej fiktivní 11. řádek.

---

## 6.12 Instagram — Reels

| Název | Spend EUR | Reach | Engagements | CPE EUR |
|---|---:|---:|---:|---:|
| Kuchyně | 16.00 | 8,158 | 3,397 | 0.005 |
| Lampičky | 15.99 | 8,875 | 3,415 | 0.005 |
| Dětský pokoj | 15.97 | 10,114 | 4,751 | 0.003 |
| Vychytávky do kuchyně | 15.96 | 12,063 | 5,787 | 0.003 |
| Série VIOS | 15.93 | 7,808 | 3,401 | 0.005 |
| Růžová židle | 15.90 | 10,918 | 3,450 | 0.005 |
| Dětské úsměvy | 2.37 | 2,114 | 822 | 0.003 |

### Souhrn

```text
Spend: 98.12 EUR
Engagements: 25,023
Vážené CPE: 98.12 / 25,023 = 0.003921 EUR
```

---

## 6.13 Instagram — Posty

| Název | Spend EUR | Reach | Engagements | CPE EUR |
|---|---:|---:|---:|---:|
| Koupák | 7.96 | 832 | 79 | 0.10 |
| První obývák | 3.98 | 453 | 39 | 0.10 |
| Psací stůl do dětského pokoje | 3.97 | 242 | 37 | 0.11 |
| Perfect match | 3.96 | 337 | 36 | 0.11 |
| Boy | 3.96 | 1,266 | 86 | 0.05 |
| Série JOAKIMIS | 3.94 | 377 | 41 | 0.10 |
| Venkovní sezóna | 3.93 | 374 | 51 | 0.08 |
| Malý byt | 3.92 | 258 | 39 | 0.10 |

### Souhrn

```text
Spend: 35.62 EUR
Engagements: 408
Vážené CPE: 35.62 / 408 = 0.087304 EUR
```

---

## 6.14 Instagram — zdrojový total

| Spend EUR | Unique Reach | Engagements | Cost / Engagement EUR |
|---:|---:|---:|---:|
| 133.74 | 44,685 | 25,451 | 0.01 |

Kontrola:

```text
98.12 + 35.62 = 133.74 EUR
25,023 + 408 = 25,431 engagements
```

### Pozor — nesoulad ve screenshotu

Zdrojový total screenshotu uvádí:

```text
25,451 engagements
```

Součet jednoznačně čitelných jednotlivých řádků je:

```text
25,431 engagements
```

Rozdíl:

```text
20 engagements
```

Codex musí tento rozdíl při cross-reference ověřit. Automaticky neměň řádková data ani nevkládej +20 do libovolného postu.

---

# 7. Benchmark tabulka

| Země | Platforma | Segment | Valid Spend EUR | Valid Results | Vážený Cost / Result EUR |
|---|---|---|---:|---:|---:|
| CZ | Facebook | Články | 303.52 | 1,898 LP Views | 0.159916 |
| CZ | Facebook | Video | 172.64 | 43,453 engagements | 0.003973 |
| CZ | Facebook | Posty | 153.75 | 35,697 engagements | 0.004307 |
| CZ | Instagram | Reels | 102.32 | 25,327 engagements | 0.004040 |
| CZ | Instagram | Posty | 40.75 | 510 engagements | 0.079902 |
| SK | Facebook | Články | 301.56 | 2,604 LP Views | 0.115806 |
| SK | Facebook | Video | 34.42 | 14,689 engagements | 0.002343 |
| SK | Facebook | Posty | 11.84 | 372 engagements | 0.031828 |
| SK | Instagram | Reels | 98.12 | 25,023 engagements | 0.003921 |
| SK | Instagram | Posty | 35.62 | 408 engagements | 0.087304 |

Benchmark vždy oddělit podle:

```text
země + platforma + typ obsahu + metrika
```

Nikdy nemíchat:

- CZ / SK,
- IG / FB,
- Reels / FB Video,
- články / engagementové formáty,
- validní a mismatch řádky.

---

# 8. Rounding

Výpočet vždy z plné přesnosti.

Zaokrouhlit až při renderu.

```text
Instagram Reels CPE: 3 desetinná místa
Facebook Video CPE: 3 desetinná místa
Facebook Post CPE: 2 desetinná místa
Instagram Post CPE: 2 desetinná místa
Facebook Article Cost / LPV: 2 desetinná místa
CTR: 2 desetinná místa
Spend: 2 desetinná místa
```

Pokud stávající projekt obsahuje přesnější explicitní display pravidlo, zachovej stávající UX.

---

# 9. Miniatury

Uživatel nahraje Codexu stejný batch screenshotů.

Z těchto screenshotů vytvoř miniatury.

Pravidla:

1. použij pouze kreativní thumbnail z kolony `Ad creative`,
2. vyřízni okolní Ads Manager UI,
3. nepřidávej text metrik ani názvy,
4. zachovej stávající aspect ratio, radius a `object-fit`,
5. přiřaď thumbnail podle source názvu,
6. jeden příspěvek = jeden thumbnail,
7. nezpracovávej zvlášť `All` a creative řádek,
8. při nejistém matchi nepřiřazuj naslepo.

Doporučeno:

```text
public/thumbnails/2026-07/
```

a dále členění podle země/platformy pouze pokud odpovídá stávající repo struktuře.

---

# 10. Datový model

Preferuj stávající model.

Pokud je nutné jej rozšířit:

```ts
interface SocialPostRecord {
  id: string;
  month: "2026-07";

  country: "CZ" | "SK";
  platform: "instagram" | "facebook";
  contentType: "reel" | "video" | "article" | "post";

  sourceName: string;
  title: string;

  spendEur: number;
  reach: number | null;

  resultType: "post_engagement" | "landing_page_view";
  results: number | null;
  costPerResultEur: number | null;

  engagements: number | null;
  cpeEur: number | null;

  landingPageViews: number | null;
  costPerLandingPageViewEur: number | null;

  cpmEur?: number | null;
  linkClicks?: number | null;
  cpcEur?: number | null;
  ctrPct?: number | null;

  optimizationMismatch?: boolean;
  rankingEligible: boolean;

  thumbnail?: string | null;
}
```

---

# 11. Cross-reference — povinný checklist

Codex má po nahrání screenshotů ověřit:

- [ ] všechny source názvy,
- [ ] country,
- [ ] platformu,
- [ ] formát,
- [ ] spend,
- [ ] result type,
- [ ] result count,
- [ ] cost per result,
- [ ] reach,
- [ ] CPM tam, kde je dostupné,
- [ ] link clicks / CPC / CTR u článků,
- [ ] zda není položka započtena 2×,
- [ ] zda všechny miniatury odpovídají správným kreativám,
- [ ] zda datum v source názvu není chybně použito jako reportovací období,
- [ ] SK FB discrepancy `16.72 EUR`,
- [ ] SK IG discrepancy `20 engagements`.

### Zásadní pravidlo

Cross-reference je kontrolní mechanismus.

Codex nemá tiše přepisovat tabulky z tohoto dokumentu.

Pokud najde rozdíl:

```text
STOP → vypiš rozdíl → navrhni správnou hodnotu → počkej na potvrzení uživatele
```

Výjimkou jsou čisté technické věci typu normalizace title / slug / thumbnail path.

---

# 12. Implementace

1. Otevři repo.
2. Projdi aktuální stav po předchozím měsíci.
3. Nevytvářej nový dashboard.
4. Navazuj na existující červnovou strukturu.
5. Přidej červenec jako další měsíční dataset.
6. Zachovej starší měsíce.
7. Proveď cross-reference screenshotů.
8. Vyřízni a přiřaď miniatury.
9. Spusť lint/test/build.
10. Ověř Cloudflare Pages kompatibilitu.
11. Ověř desktop i mobile.
12. Shrň změněné soubory a nalezené nesrovnalosti.

Preferovaná branch:

```text
feature/july-2026-report
```

Commit:

```text
feat: add July 2026 SCONTO social report
```

---

# 13. Acceptance criteria

- [ ] Červenec je přidán jako nový měsíc.
- [ ] Předchozí měsíce fungují beze změn.
- [ ] Názvy jsou bez data.
- [ ] Instagram je rozdělen na Reels / Posty.
- [ ] Facebook je rozdělen na Video / Články / Posty.
- [ ] Články používají Cost / LPV.
- [ ] Mismatch položky nevstupují do CPE benchmarku.
- [ ] Benchmarky jsou oddělené podle země/platformy/formátu.
- [ ] Rounding odpovídá pravidlům.
- [ ] Miniatury jsou vyříznuté z dodaných screenshotů.
- [ ] Žádný `All` + creative duplicate není započten 2×.
- [ ] SK FB total discrepancy je ověřena.
- [ ] SK IG engagement discrepancy je ověřena.
- [ ] Vite build projde.
- [ ] Cloudflare Pages build zůstává funkční.
- [ ] Codex na konci vypíše audit cross-reference.

---

# 14. Zdrojové screenshoty pro cross-reference

Uživatel Codexu nahraje tento batch:

```text
článek FB CZ report.jpeg
článek FB SK report.jpeg
FB posty CZ.jpeg
IG posty CZ.jpeg
IG posty SK.jpeg
FB posty SK.jpeg
```

Tyto screenshoty používej pro kontrolu a thumbnails. Kanonická data jsou výše v tomto Markdown dokumentu.
