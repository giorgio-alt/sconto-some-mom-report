import { useMemo, useState, type ReactNode } from "react";
import {
  REPORT_DATA,
  REPORT_LOGO,
  type ContentType,
  type Country,
  type Platform,
  type ReportRow,
} from "./report-data";

type Tier = {
  ratio: number | null;
  tierClass: "good" | "avg" | "bad" | "neutral";
  tierText: string;
};

type ScoredRow = ReportRow & Tier;

const fmt = new Intl.NumberFormat("cs-CZ");
const countries: Country[] = ["CZ", "SK"];
const platformOrder: Platform[] = ["instagram", "facebook"];
const contentTypeOrder: Record<Platform, ContentType[]> = {
  instagram: ["reel", "post"],
  facebook: ["video", "article", "post"],
};

const platformLabels: Record<Platform, string> = {
  instagram: "📸 Instagram",
  facebook: "📘 Facebook",
};

const contentTypeLabels: Record<ContentType, string> = {
  reel: "🎬 Reels",
  post: "🖼️ Posty",
  video: "▶ Video",
  article: "🔗 Články",
};

function eligibleRows(rows: ReportRow[]) {
  return rows.filter(
    (row) =>
      row.rankingEligible &&
      row.results !== null &&
      row.results > 0 &&
      row.costPerResultEur !== null,
  );
}

function stats(rows: ReportRow[]) {
  const rankedRows = eligibleRows(rows);
  const totalSpend = rows.reduce((total, row) => total + row.spendEur, 0);
  const benchmarkSpend = rankedRows.reduce(
    (total, row) => total + row.spendEur,
    0,
  );
  const results = rankedRows.reduce((total, row) => total + (row.results ?? 0), 0);
  const reachRows = rows.filter((row) => row.reach !== null);

  return {
    posts: rows.length,
    spend: totalSpend,
    benchmarkSpend,
    results,
    reach: reachRows.length
      ? reachRows.reduce((total, row) => total + (row.reach ?? 0), 0)
      : null,
    avgCost: results ? benchmarkSpend / results : null,
  };
}

function scoreRows(rows: ReportRow[]): ScoredRow[] {
  const benchmark = stats(rows).avgCost;

  return rows.map((row) => {
    if (!row.rankingEligible || !benchmark || row.costPerResultEur === null) {
      return {
        ...row,
        ratio: null,
        tierClass: "neutral",
        tierText: "Nehodnoceno",
      };
    }

    const ratio = row.costPerResultEur / benchmark;
    if (ratio <= 0.8) {
      return { ...row, ratio, tierClass: "good", tierText: "Top" };
    }
    if (ratio <= 1.2) {
      return { ...row, ratio, tierClass: "avg", tierText: "Průměr" };
    }
    return { ...row, ratio, tierClass: "bad", tierText: "Slabší" };
  });
}

function monthKeys(rows: ReportRow[]) {
  return [...new Set(rows.map((row) => row.month_key))].sort((a, b) =>
    b.localeCompare(a),
  );
}

function monthName(key: string) {
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "cs-CZ",
    {
      month: "long",
      year: "numeric",
    },
  );
}

function availablePlatforms(country: Country) {
  const existing = new Set(
    REPORT_DATA.filter((row) => row.country === country).map((row) => row.platform),
  );
  return platformOrder.filter((platform) => existing.has(platform));
}

function availableContentTypes(country: Country, platform: Platform) {
  const existing = new Set(
    REPORT_DATA.filter(
      (row) => row.country === country && row.platform === platform,
    ).map((row) => row.contentType),
  );
  return contentTypeOrder[platform].filter((type) => existing.has(type));
}

function formatEuro(value: number | null, digits = 2) {
  if (value === null || Number.isNaN(value)) {
    return "-";
  }

  return value.toLocaleString("cs-CZ", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function costDigits(row: Pick<ReportRow, "contentType" | "resultType">) {
  if (row.resultType === "landing_page_view" || row.contentType === "article") {
    return 2;
  }
  return row.contentType === "reel" || row.contentType === "video" ? 3 : 2;
}

function metricLabel(contentType: ContentType) {
  return contentType === "article" ? "Cost / LPV" : "CPE";
}

function formatMetric(row: ReportRow) {
  const value =
    row.resultType === "landing_page_view"
      ? row.costPerLandingPageViewEur
      : row.cpeEur;
  return formatEuro(value, costDigits(row));
}

function formatResult(row: ReportRow) {
  if (row.results === null) {
    return "-";
  }

  const label =
    row.resultType === "landing_page_view" ? "LP Views" : "engagements";
  return `${fmt.format(Math.round(row.results))} ${label}`;
}

function Preview({ row }: { row: ReportRow }) {
  if (row.thumbnail) {
    return (
      <img
        className="preview"
        src={row.thumbnail}
        alt={`Preview obsahu ${row.title}`}
        loading="lazy"
      />
    );
  }

  return (
    <div className="preview empty" aria-label="Preview není k dispozici">
      ▧
    </div>
  );
}

function TierBadge({ row }: { row: ScoredRow }) {
  return <span className={`badge ${row.tierClass}`}>{row.tierText}</span>;
}

function CollapsiblePanel({
  title,
  hint,
  open,
  onToggle,
  children,
}: {
  title: string;
  hint: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className={`panel collapsible ${open ? "open" : "closed"}`}>
      <button
        className="panelHead"
        type="button"
        aria-expanded={open}
        onClick={onToggle}
      >
        <div>
          <h2>{title}</h2>
          <p className="hint">{hint}</p>
        </div>
        <span className="toggle">
          <span>{open ? "Sbalit" : "Rozbalit"}</span>
          <span className="chev">⌄</span>
        </span>
      </button>
      <div className="collapseRegion">
        <div className="collapseInner">{children}</div>
      </div>
    </section>
  );
}

export default function App() {
  const [country, setCountry] = useState<Country>("CZ");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [contentType, setContentType] = useState<ContentType>("reel");
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [topOpen, setTopOpen] = useState(false);
  const [monthlyOpen, setMonthlyOpen] = useState(false);

  const platforms = availablePlatforms(country);
  const selectedPlatform = platforms.includes(platform) ? platform : platforms[0];
  const contentTypes = availableContentTypes(country, selectedPlatform);
  const selectedContentType = contentTypes.includes(contentType)
    ? contentType
    : contentTypes[0];
  const baseRows = REPORT_DATA.filter(
    (row) =>
      row.country === country &&
      row.platform === selectedPlatform &&
      row.contentType === selectedContentType,
  );
  const months = useMemo(() => monthKeys(baseRows), [baseRows]);
  const selectedMonth =
    activeMonth && months.includes(activeMonth) ? activeMonth : months[0] || "";
  const rows = useMemo(
    () => baseRows.filter((row) => row.month_key === selectedMonth),
    [baseRows, selectedMonth],
  );
  const scoredRows = useMemo(() => scoreRows(rows), [rows]);
  const dashboardStats = stats(rows);
  const sortedRows = [...scoredRows].sort((a, b) => {
    if (!a.rankingEligible && !b.rankingEligible) {
      return a.title.localeCompare(b.title, "cs");
    }
    if (!a.rankingEligible) return 1;
    if (!b.rankingEligible) return -1;
    return (a.costPerResultEur ?? Number.POSITIVE_INFINITY) -
      (b.costPerResultEur ?? Number.POSITIVE_INFINITY);
  });
  const topRows = sortedRows.filter((row) => row.rankingEligible).slice(0, 10);
  const bestPost = topRows[0];
  const countryLabel = country === "CZ" ? "🇨🇿 CZ" : "🇸🇰 SK";
  const allSectionsOpen = topOpen && monthlyOpen;
  const primaryMetric = metricLabel(selectedContentType);

  function selectCountry(nextCountry: Country) {
    setCountry(nextCountry);
    setActiveMonth(null);
  }

  function selectPlatform(nextPlatform: Platform) {
    setPlatform(nextPlatform);
    setActiveMonth(null);
  }

  function selectContentType(nextContentType: ContentType) {
    setContentType(nextContentType);
    setActiveMonth(null);
  }

  function toggleAllSections() {
    const nextOpen = !allSectionsOpen;
    setTopOpen(nextOpen);
    setMonthlyOpen(nextOpen);
  }

  return (
    <div className="container">
      <section className="hero reveal visible">
        <div className="logoCard">
          <img src={REPORT_LOGO} alt="Sconto Nábytek" />
        </div>
        <div className="heroText glass">
          <h1>SoMe Post Reporting</h1>
          <p className="subtitle">
            Dashboard výkonu social obsahu podle země, platformy, typu obsahu a
            měsíce. Instagramové a facebookové segmenty se benchmarkují odděleně;
            články používají Cost / LPV a engagementové formáty používají CPE.
          </p>
        </div>
      </section>

      <div className="navWrap" aria-label="Filtry reportu">
        <nav className="tabs" aria-label="Země">
          {countries.map((item) => (
            <button
              className={`tab ${country === item ? "active" : ""}`}
              key={item}
              type="button"
              onClick={() => selectCountry(item)}
            >
              {item === "CZ" ? "🇨🇿 CZ" : "🇸🇰 SK"}
            </button>
          ))}
        </nav>

        <nav className="tabs" aria-label="Platforma">
          {platforms.map((item) => (
            <button
              className={`tab ${selectedPlatform === item ? "active" : ""}`}
              key={item}
              type="button"
              onClick={() => selectPlatform(item)}
            >
              {platformLabels[item]}
            </button>
          ))}
        </nav>

        <nav className="tabs" aria-label="Typ obsahu">
          {contentTypes.map((item) => (
            <button
              className={`tab ${selectedContentType === item ? "active" : ""}`}
              key={item}
              type="button"
              onClick={() => selectContentType(item)}
            >
              {contentTypeLabels[item]}
            </button>
          ))}
        </nav>

        <nav className="tabs monthTabs" aria-label="Měsíc">
          {months.map((month) => (
            <button
              className={`tab ${selectedMonth === month ? "active" : ""}`}
              key={month}
              type="button"
              onClick={() => setActiveMonth(month)}
            >
              {monthName(month)}
            </button>
          ))}
        </nav>
      </div>

      <main>
        <section className="dashboard active">
          <div className="globalControls reveal visible">
            <button
              className={`globalToggle ${allSectionsOpen ? "open" : "closed"}`}
              type="button"
              aria-expanded={allSectionsOpen}
              onClick={toggleAllSections}
            >
              <span>{allSectionsOpen ? "Sbalit vše" : "Rozbalit vše"}</span>
              <span className="chev">⌄</span>
            </button>
          </div>

          <div className="kpis reveal visible">
            <div className="kpi">
              <span>Země</span>
              <strong>{countryLabel}</strong>
            </div>
            <div className="kpi">
              <span>Platforma</span>
              <strong>{platformLabels[selectedPlatform].replace(/^[^A-ZÁ-ž]+\s?/, "")}</strong>
            </div>
            <div className="kpi">
              <span>Segment</span>
              <strong>{contentTypeLabels[selectedContentType].replace(/^[^\wÁ-ž]+\s?/, "")}</strong>
            </div>
            <div className="kpi">
              <span>Měsíc</span>
              <strong>{selectedMonth ? monthName(selectedMonth) : "-"}</strong>
            </div>
            <div className="kpi">
              <span>Posty s delivery</span>
              <strong>{fmt.format(dashboardStats.posts)}</strong>
            </div>
            <div className="kpi">
              <span>Průměrný {primaryMetric}</span>
              <strong>
                {formatEuro(
                  dashboardStats.avgCost,
                  selectedContentType === "reel" || selectedContentType === "video"
                    ? 3
                    : 2,
                )}
              </strong>
            </div>
          </div>

          <CollapsiblePanel
            title={`Top 10 podle ${primaryMetric}`}
            open={topOpen}
            onToggle={() => setTopOpen((current) => !current)}
            hint={
              <>
                Nižší cost per result znamená lepší výkon. Benchmark se počítá
                pouze z hodnocených položek ve zvolené zemi, platformě, segmentu
                a měsíci.
              </>
            }
          >
            {topRows.length ? (
              <div className="topList">
                {topRows.map((row, index) => (
                  <div className="topItem" key={row.id}>
                    <div className="rank">{index + 1}</div>
                    <Preview row={row} />
                    <div>
                      <div className="title">{row.title}</div>
                      {row.snippet ? (
                        <div className="snippet">{row.snippet}</div>
                      ) : null}
                      <div className="meta">
                        {row.date} · {formatResult(row)} · <TierBadge row={row} />
                      </div>
                    </div>
                    <div className="metric">{formatMetric(row)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="emptyState">
                V tomto segmentu nejsou hodnocené položky pro žebříček.
              </div>
            )}
          </CollapsiblePanel>

          <CollapsiblePanel
            title="Měsíční přehled"
            open={monthlyOpen}
            onToggle={() => setMonthlyOpen((current) => !current)}
            hint={
              <>
                {selectedMonth ? monthName(selectedMonth) : "-"} ·{" "}
                {fmt.format(rows.length)} položek · průměrný {primaryMetric}{" "}
                {formatEuro(
                  dashboardStats.avgCost,
                  selectedContentType === "reel" || selectedContentType === "video"
                    ? 3
                    : 2,
                )}{" "}
                · hodnocené výsledky {fmt.format(dashboardStats.results)} ·
                reach{" "}
                {dashboardStats.reach === null
                  ? "-"
                  : fmt.format(Math.round(dashboardStats.reach))}{" "}
                · spend{" "}
                {formatEuro(dashboardStats.spend)}
                {bestPost ? (
                  <>
                    {" "}
                    · nejlepší položka: {bestPost.title} ({formatMetric(bestPost)})
                  </>
                ) : null}
              </>
            }
          >
            <div className="tableScroller">
              <table>
                <thead>
                  <tr>
                    <th>Obsah</th>
                    <th>Cost / result</th>
                    <th>Stav</th>
                    <th>Výsledek</th>
                    <th>Reach</th>
                    <th>Spend</th>
                    <th>Index vs benchmark</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="postCell">
                          <Preview row={row} />
                          <div>
                            <div className="title">{row.title}</div>
                            {row.snippet ? (
                              <div className="snippet">{row.snippet}</div>
                            ) : null}
                            <div className="meta">{row.date}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{formatMetric(row)}</strong>
                        <div className="meta">
                          {row.resultType === "landing_page_view"
                            ? "Landing Page View"
                            : "Post Engagement"}
                        </div>
                      </td>
                      <td>
                        <TierBadge row={row} />
                        {row.optimizationMismatch ? (
                          <div className="meta">
                            Odlišný optimalizační cíl - položka není zahrnuta do
                            CPE benchmarku.
                          </div>
                        ) : null}
                      </td>
                      <td>{formatResult(row)}</td>
                      <td>
                        {row.reach === null ? "-" : fmt.format(Math.round(row.reach))}
                      </td>
                      <td>{formatEuro(row.spendEur)}</td>
                      <td>
                        {row.ratio === null ? (
                          <span className="meta">Mimo benchmark</span>
                        ) : (
                          <>
                            <div className="barWrap">
                              <div
                                className={`bar ${row.tierClass}`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.round(row.ratio * 70),
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="meta">
                              {Math.round(row.ratio * 100)} % průměru
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsiblePanel>
        </section>
      </main>
    </div>
  );
}
