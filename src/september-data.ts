import type { ContentType, Country, Platform, ReportRow } from "./report-data";

const MONTH_KEY = "2026-09";

type SeptemberInput = {
  country: Country;
  platform: Platform;
  contentType: ContentType;
  slug: string;
  title: string;
  date: string;
  spendEur: number;
  reach: number;
  engagements?: number;
  landingPageViews?: number;
  cpmEur?: number;
  linkClicks?: number;
  cpcEur?: number;
  ctrPct?: number;
  frequency?: number;
};

const thumbnailFolder = { article: "articles", video: "video", post: "posts", reel: "reels" };

function row(input: SeptemberInput): ReportRow {
  const isArticle = input.contentType === "article";
  const results = (isArticle ? input.landingPageViews : input.engagements) ?? null;
  const cost = results !== null && results > 0 ? input.spendEur / results : null;
  const sourceFormat = input.contentType === "article" ? "Článek" : input.contentType === "video" ? "post - video" : input.contentType === "reel" ? "reels" : "post";

  return {
    id: `${MONTH_KEY}-${input.country.toLowerCase()}-${input.platform}-${input.contentType}-${input.slug}`,
    country: input.country,
    platform: input.platform,
    contentType: input.contentType,
    sourceName: `${input.date} - ${sourceFormat} - ${input.title}`,
    title: input.title,
    date: input.date.split("/").join("."),
    month_key: MONTH_KEY,
    spendEur: input.spendEur,
    reach: input.reach,
    frequency: input.frequency ?? null,
    cpmEur: input.cpmEur ?? null,
    linkClicks: input.linkClicks ?? null,
    cpcEur: input.cpcEur ?? null,
    ctrPct: input.ctrPct ?? null,
    resultType: isArticle ? "landing_page_view" : "post_engagement",
    results,
    costPerResultEur: cost,
    engagements: isArticle ? null : input.engagements ?? null,
    cpeEur: isArticle ? null : cost,
    landingPageViews: input.landingPageViews ?? null,
    costPerLandingPageViewEur: isArticle ? cost : null,
    rankingEligible: results !== null && results > 0,
    thumbnail: `/thumbnails/${MONTH_KEY}/${input.country.toLowerCase()}/${input.platform}/${thumbnailFolder[input.contentType]}/${input.slug}.png`,
  };
}

export const SEPTEMBER_2026_RECORDS = [
  row({ country: "CZ", platform: "facebook", contentType: "article", slug: "7-pravidel", title: "7 pravidel", date: "10/09/2026", spendEur: 39.98, landingPageViews: 349, reach: 8794, linkClicks: 396, cpcEur: 0.10, ctrPct: 2.83, frequency: 1.59 }),
  row({ country: "CZ", platform: "facebook", contentType: "article", slug: "od-rustikalni-pracovna", title: "OD rustikální pracovna", date: "17/09/2026", spendEur: 39.98, landingPageViews: 122, reach: 8464, linkClicks: 163, cpcEur: 0.25, ctrPct: 1.24, frequency: 1.56 }),
  row({ country: "CZ", platform: "facebook", contentType: "article", slug: "10-tipu", title: "10 tipů", date: "15/09/2026", spendEur: 39.89, landingPageViews: 278, reach: 6619, linkClicks: 389, cpcEur: 0.10, ctrPct: 2.94, frequency: 2.00 }),
  row({ country: "CZ", platform: "facebook", contentType: "article", slug: "obyvak-v-panelaku", title: "Obývák v paneláku", date: "03/09/2026", spendEur: 39.87, landingPageViews: 377, reach: 7903, linkClicks: 449, cpcEur: 0.09, ctrPct: 3.13, frequency: 1.82 }),
  row({ country: "CZ", platform: "facebook", contentType: "article", slug: "od-pokoj-pro-chlapce", title: "OD pokoj pro chlapce", date: "27/08/2026", spendEur: 11.06, landingPageViews: 82, reach: 3431, linkClicks: 98, cpcEur: 0.11, ctrPct: 2.57, frequency: 1.11 }),
  row({ country: "CZ", platform: "facebook", contentType: "article", slug: "jednopokojovy-byt", title: "Jednopokojový byt", date: "29/09/2026", spendEur: 7.54, landingPageViews: 96, reach: 2050, linkClicks: 108, cpcEur: 0.07, ctrPct: 4.21, frequency: 1.25 }),
  row({ country: "SK", platform: "facebook", contentType: "article", slug: "7-pravidel", title: "7 pravidel", date: "10/09/2026", spendEur: 39.93, landingPageViews: 335, reach: 11584, linkClicks: 370, cpcEur: 0.11, ctrPct: 1.93, frequency: 1.66 }),
  row({ country: "SK", platform: "facebook", contentType: "article", slug: "obyvak-v-panelaku", title: "Obývák v paneláku", date: "03/09/2026", spendEur: 39.89, landingPageViews: 531, reach: 11800, linkClicks: 611, cpcEur: 0.07, ctrPct: 2.67, frequency: 1.94 }),
  row({ country: "SK", platform: "facebook", contentType: "article", slug: "od-rustikalni-pracovna", title: "OD rustikální pracovna", date: "17/09/2026", spendEur: 39.88, landingPageViews: 200, reach: 13555, linkClicks: 258, cpcEur: 0.15, ctrPct: 1.19, frequency: 1.60 }),
  row({ country: "SK", platform: "facebook", contentType: "article", slug: "10-tipu", title: "10 tipů", date: "15/09/2026", spendEur: 39.86, landingPageViews: 359, reach: 9770, linkClicks: 451, cpcEur: 0.09, ctrPct: 2.20, frequency: 2.10 }),
  row({ country: "SK", platform: "facebook", contentType: "article", slug: "od-7-pravidel-loznice", title: "OD 7 pravidel ložnice", date: "09/09/2026", spendEur: 16.42, landingPageViews: 164, reach: 5964, linkClicks: 181, cpcEur: 0.09, ctrPct: 2.16, frequency: 1.40 }),
  row({ country: "SK", platform: "facebook", contentType: "article", slug: "jednopokojovy-byt", title: "Jednopokojový byt", date: "29/09/2026", spendEur: 8.48, landingPageViews: 73, reach: 3592, linkClicks: 134, cpcEur: 0.06, ctrPct: 3.01, frequency: 1.24 }),

  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "ruzova", title: "Růžová", date: "03/09/2026", spendEur: 55.45, engagements: 22024, reach: 33610, cpmEur: 1.31 }),
  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "twenty", title: "TWENTY", date: "03/09/2026", spendEur: 47.93, engagements: 18887, reach: 29194, cpmEur: 1.32 }),
  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "zeleny-gauc", title: "Zelený gauč", date: "27/08/2026", spendEur: 32.09, engagements: 11950, reach: 18172, cpmEur: 1.34 }),
  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "structura", title: "STRUCTURA", date: "24/09/2026", spendEur: 24.34, engagements: 8602, reach: 13153, cpmEur: 1.43 }),
  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "zelena", title: "Zelená", date: "15/08/2026", spendEur: 15.97, engagements: 6548, reach: 10712, cpmEur: 1.28 }),
  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "ovladac", title: "Ovladač", date: "14/09/2026", spendEur: 15.85, engagements: 4800, reach: 7447, cpmEur: 1.92 }),
  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "kuchyne", title: "Kuchyně", date: "10/09/2026", spendEur: 15.80, engagements: 3821, reach: 5127, cpmEur: 2.18 }),
  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "centimetr-zeleny-gauc", title: "Centimetr, zelený gauč", date: "10/09/2026", spendEur: 15.80, engagements: 5368, reach: 8271, cpmEur: 1.54 }),
  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "lenny", title: "LENNY", date: "14/09/2026", spendEur: 15.68, engagements: 4874, reach: 8009, cpmEur: 1.66 }),
  row({ country: "CZ", platform: "facebook", contentType: "post", slug: "sedacka", title: "Sedačka", date: "03/09/2026", spendEur: 13.77, engagements: 931, reach: 6572, cpmEur: 1.30 }),
  row({ country: "CZ", platform: "facebook", contentType: "post", slug: "nabytek", title: "Nábytek", date: "10/09/2026", spendEur: 13.51, engagements: 361, reach: 3819, cpmEur: 1.87 }),
  row({ country: "CZ", platform: "facebook", contentType: "post", slug: "leo", title: "Leo", date: "17/09/2026", spendEur: 7.91, engagements: 168, reach: 2509, cpmEur: 2.56 }),
  row({ country: "CZ", platform: "facebook", contentType: "post", slug: "mat-nebo-lesk", title: "Mat, nebo lesk", date: "15/08/2026", spendEur: 4.08, engagements: 73, reach: 1526, cpmEur: 2.06 }),
  row({ country: "CZ", platform: "facebook", contentType: "video", slug: "kolebka", title: "Kolébka", date: "29/09/2026", spendEur: 3.99, engagements: 1320, reach: 2561, cpmEur: 1.50 }),
  row({ country: "CZ", platform: "facebook", contentType: "post", slug: "perfect-match", title: "Perfect match", date: "28/07/2026", spendEur: 3.96, engagements: 64, reach: 1322, cpmEur: 2.33 }),

  row({ country: "SK", platform: "facebook", contentType: "video", slug: "twenty", title: "TWENTY", date: "03/09/2026", spendEur: 47.85, engagements: 23616, reach: 32623 }),
  row({ country: "SK", platform: "facebook", contentType: "video", slug: "centimetr-zeleny-gauc", title: "Centimetr, zelený gauč", date: "10/09/2026", spendEur: 37.58, engagements: 14637, reach: 19970 }),
  row({ country: "SK", platform: "facebook", contentType: "video", slug: "ruzova", title: "Růžová", date: "03/09/2026", spendEur: 31.90, engagements: 11798, reach: 17353 }),
  row({ country: "SK", platform: "facebook", contentType: "video", slug: "ovladac", title: "Ovladač", date: "14/09/2026", spendEur: 31.47, engagements: 11555, reach: 16649 }),
  row({ country: "SK", platform: "facebook", contentType: "video", slug: "structura", title: "STRUCTURA", date: "24/09/2026", spendEur: 23.46, engagements: 10071, reach: 14548 }),
  row({ country: "SK", platform: "facebook", contentType: "video", slug: "zeleny-gauc", title: "Zelený gauč", date: "27/08/2026", spendEur: 22.42, engagements: 9727, reach: 17845 }),
  row({ country: "SK", platform: "facebook", contentType: "video", slug: "zelena", title: "Zelená", date: "15/08/2026", spendEur: 16.95, engagements: 7245, reach: 11845 }),
  row({ country: "SK", platform: "facebook", contentType: "video", slug: "kuchyne", title: "Kuchyně", date: "10/09/2026", spendEur: 15.96, engagements: 4796, reach: 7340 }),
  row({ country: "SK", platform: "facebook", contentType: "video", slug: "lenny", title: "LENNY", date: "14/09/2026", spendEur: 15.80, engagements: 5625, reach: 10101 }),
  row({ country: "SK", platform: "facebook", contentType: "post", slug: "sedacka", title: "Sedačka", date: "03/09/2026", spendEur: 13.48, engagements: 800, reach: 5772 }),
  row({ country: "SK", platform: "facebook", contentType: "post", slug: "nabytek", title: "Nábytek", date: "10/09/2026", spendEur: 12.72, engagements: 355, reach: 4248 }),
  row({ country: "SK", platform: "facebook", contentType: "post", slug: "serie-joakimis", title: "Série JOAKIMIS", date: "14/07/2026", spendEur: 12.01, engagements: 690, reach: 7108 }),
  row({ country: "SK", platform: "facebook", contentType: "video", slug: "kolebka", title: "Kolébka", date: "29/09/2026", spendEur: 3.92, engagements: 1740, reach: 3250 }),
  row({ country: "SK", platform: "facebook", contentType: "post", slug: "leo", title: "Leo", date: "17/09/2026", spendEur: 3.91, engagements: 65, reach: 1254 }),
  row({ country: "SK", platform: "facebook", contentType: "post", slug: "perfect-match", title: "Perfect match", date: "28/07/2026", spendEur: 0.82, engagements: 10, reach: 389 }),

  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "twenty", title: "TWENTY", date: "03/09/2026", spendEur: 55.06, engagements: 15957, reach: 21451, cpmEur: 1.76 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "zeleny-gauc", title: "Zelený gauč", date: "27/08/2026", spendEur: 39.01, engagements: 11056, reach: 19051, cpmEur: 1.55 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "centimetr-zeleny-gauc", title: "Centimetr, zelený gauč", date: "10/09/2026", spendEur: 24.73, engagements: 6288, reach: 9374, cpmEur: 2.13 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "lenny", title: "LENNY", date: "14/09/2026", spendEur: 24.46, engagements: 5308, reach: 10026, cpmEur: 2.05 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "vychytavky-do-kuchyne", title: "Vychytávky do kuchyně", date: "14/07/2026", spendEur: 16.08, engagements: 4524, reach: 7710, cpmEur: 1.94 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "zelena", title: "Zelená", date: "15/08/2026", spendEur: 16.02, engagements: 4018, reach: 6810, cpmEur: 2.13 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "kuchyne", title: "Kuchyně", date: "10/09/2026", spendEur: 15.95, engagements: 3087, reach: 5386, cpmEur: 2.42 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "ovladac", title: "Ovladač", date: "14/09/2026", spendEur: 15.90, engagements: 3367, reach: 5890, cpmEur: 2.44 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "structura", title: "STRUCTURA", date: "24/09/2026", spendEur: 15.90, engagements: 3515, reach: 5455, cpmEur: 2.25 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "ruzova", title: "Růžová", date: "03/09/2026", spendEur: 15.85, engagements: 3384, reach: 7145, cpmEur: 1.91 }),
  row({ country: "CZ", platform: "instagram", contentType: "post", slug: "boy-lampa", title: "Boy lampa", date: "30/06/2026", spendEur: 11.97, engagements: 302, reach: 3318, cpmEur: 2.72 }),
  row({ country: "CZ", platform: "instagram", contentType: "post", slug: "leo", title: "Leo", date: "15/09/2026", spendEur: 6.41, engagements: 72, reach: 948, cpmEur: 5.85 }),
  row({ country: "CZ", platform: "instagram", contentType: "reel", slug: "kolebka", title: "Kolébka", date: "29/09/2026", spendEur: 5.33, engagements: 1171, reach: 2236, cpmEur: 2.25 }),
  row({ country: "CZ", platform: "instagram", contentType: "post", slug: "nabytek", title: "Nábytek", date: "10/09/2026", spendEur: 3.99, engagements: 28, reach: 179, cpmEur: 19.66 }),
  row({ country: "CZ", platform: "instagram", contentType: "post", slug: "psaci-stul-do-detskeho-pokoje", title: "Psací stůl do dětského pokoje", date: "16/07/2026", spendEur: 3.99, engagements: 34, reach: 377, cpmEur: 8.89 }),
  row({ country: "CZ", platform: "instagram", contentType: "post", slug: "gauc-barvy", title: "Gauč, barvy", date: "24/09/2026", spendEur: 3.98, engagements: 18, reach: 263, cpmEur: 13.68 }),
  row({ country: "CZ", platform: "instagram", contentType: "post", slug: "sedacka", title: "Sedačka", date: "03/09/2026", spendEur: 3.96, engagements: 34, reach: 303, cpmEur: 11.31 }),
  row({ country: "CZ", platform: "instagram", contentType: "post", slug: "soutez", title: "Soutěž", date: "17/09/2026", spendEur: 3.85, engagements: 52, reach: 227, cpmEur: 13.90 }),

  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "twenty", title: "TWENTY", date: "03/09/2026", spendEur: 47.95, engagements: 14249, reach: 23598 }),
  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "ruzova", title: "Růžová", date: "03/09/2026", spendEur: 40.01, engagements: 10802, reach: 17773 }),
  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "zeleny-gauc", title: "Zelený gauč", date: "27/08/2026", spendEur: 32.00, engagements: 9777, reach: 19926 }),
  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "ovladac", title: "Ovladač", date: "14/09/2026", spendEur: 31.76, engagements: 8445, reach: 15018 }),
  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "centimetr-zeleny-gauc", title: "Centimetr, zelený gauč", date: "10/09/2026", spendEur: 24.78, engagements: 6200, reach: 11761 }),
  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "kuchyne", title: "Kuchyně", date: "10/09/2026", spendEur: 15.98, engagements: 3507, reach: 6731 }),
  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "structura", title: "STRUCTURA", date: "24/09/2026", spendEur: 15.96, engagements: 3607, reach: 6786 }),
  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "vychytavky-do-kuchyne", title: "Vychytávky do kuchyně", date: "14/07/2026", spendEur: 15.91, engagements: 4195, reach: 7954 }),
  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "lenny", title: "LENNY", date: "14/09/2026", spendEur: 15.86, engagements: 3958, reach: 8656 }),
  row({ country: "SK", platform: "instagram", contentType: "post", slug: "leo", title: "Leo", date: "17/09/2026", spendEur: 9.72, engagements: 122, reach: 1732 }),
  row({ country: "SK", platform: "instagram", contentType: "post", slug: "boy-lampa", title: "Boy lampa", date: "02/07/2026", spendEur: 7.95, engagements: 155, reach: 2597 }),
  row({ country: "SK", platform: "instagram", contentType: "post", slug: "gauc-barvy", title: "Gauč, barvy", date: "24/09/2026", spendEur: 3.99, engagements: 18, reach: 258 }),
  row({ country: "SK", platform: "instagram", contentType: "post", slug: "sedacka", title: "Sedačka", date: "03/09/2026", spendEur: 3.97, engagements: 33, reach: 295 }),
  row({ country: "SK", platform: "instagram", contentType: "post", slug: "nabytek", title: "Nábytek", date: "10/09/2026", spendEur: 3.97, engagements: 32, reach: 250 }),
  row({ country: "SK", platform: "instagram", contentType: "post", slug: "soutez", title: "Soutěž", date: "17/09/2026", spendEur: 3.96, engagements: 40, reach: 177 }),
  row({ country: "SK", platform: "instagram", contentType: "reel", slug: "kolebka", title: "Kolébka", date: "29/09/2026", spendEur: 3.67, engagements: 963, reach: 2291 }),
] satisfies ReportRow[];
