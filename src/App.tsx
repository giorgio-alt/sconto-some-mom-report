import { useMemo, useState, type ReactNode } from "react";
import {
  REPORT_DATA,
  REPORT_LOGO,
  type Country,
  type PostType,
  type ReportRow,
} from "./report-data";

type Tier = {
  ratio: number;
  tierClass: "good" | "avg" | "bad";
  tierText: string;
};

type ScoredRow = ReportRow & Tier;

const fmt = new Intl.NumberFormat("cs-CZ");

function stats(rows: ReportRow[]) {
  const sum = (key: keyof Pick<ReportRow, "spend" | "engagements" | "reach" | "cpm">) =>
    rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);
  const spend = sum("spend");
  const engagements = sum("engagements");

  return {
    posts: rows.length,
    spend,
    engagements,
    reach: sum("reach"),
    avgCpe: engagements ? spend / engagements : 0,
    avgCpm: rows.length ? sum("cpm") / rows.length : 0,
  };
}

function scoreRows(rows: ReportRow[]): ScoredRow[] {
  const benchmark = stats(rows).avgCpe || 1;

  return rows.map((row) => {
    const ratio = (Number(row.cpe) || 0) / benchmark;
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

function formatEuro(value: number) {
  return (Number(value) || 0).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCpe(value: number, type: PostType) {
  const digits = type === "reels" ? 3 : 2;
  return (Number(value) || 0).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function Preview({ row }: { row: ReportRow }) {
  if (row.thumb) {
    return <img className="preview" src={row.thumb} alt="Preview postu" />;
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
  const [type, setType] = useState<PostType>("static");
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [topOpen, setTopOpen] = useState(true);
  const [monthlyOpen, setMonthlyOpen] = useState(true);

  const baseRows = REPORT_DATA[country][type];
  const months = useMemo(() => monthKeys(baseRows), [baseRows]);
  const selectedMonth =
    activeMonth && months.includes(activeMonth) ? activeMonth : months[0] || "";
  const rows = useMemo(
    () => baseRows.filter((row) => row.month_key === selectedMonth),
    [baseRows, selectedMonth],
  );
  const scoredRows = useMemo(() => scoreRows(rows), [rows]);
  const dashboardStats = stats(rows);
  const sortedRows = [...scoredRows].sort((a, b) => a.cpe - b.cpe);
  const topRows = sortedRows.slice(0, 10);
  const bestPost = sortedRows[0];
  const formatLabel = type === "reels" ? "Reels" : "Statické posty";
  const countryLabel = country === "CZ" ? "🇨🇿 CZ" : "🇸🇰 SK";
  const allSectionsOpen = topOpen && monthlyOpen;

  function selectCountry(nextCountry: Country) {
    setCountry(nextCountry);
    setActiveMonth(null);
  }

  function selectType(nextType: PostType) {
    setType(nextType);
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
          <h1>IG Post Reporting</h1>
          <p className="subtitle">
            Dashboard výkonu instagramových postů podle metriky cost per
            engagement. Obsahuje českou i slovenskou verzi, odděluje statické
            posty a Reels, mapuje preview postů ze screenshotů a porovnává
            výstupy pomocí škálovacího semaforu.
          </p>
        </div>
      </section>

      <div className="navWrap" aria-label="Filtry reportu">
        <nav className="tabs" aria-label="Země">
          {(["CZ", "SK"] as Country[]).map((item) => (
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

        <nav className="tabs" aria-label="Formát">
          <button
            className={`tab ${type === "static" ? "active" : ""}`}
            type="button"
            onClick={() => selectType("static")}
          >
            🖼️ Statické posty
          </button>
          <button
            className={`tab ${type === "reels" ? "active" : ""}`}
            type="button"
            onClick={() => selectType("reels")}
          >
            🎬 Reels
          </button>
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
              <span>Formát</span>
              <strong>{formatLabel}</strong>
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
              <span>Průměrný CPE</span>
              <strong>{formatCpe(dashboardStats.avgCpe, type)}</strong>
            </div>
            <div className="kpi">
              <span>Spend</span>
              <strong>{formatEuro(dashboardStats.spend)}</strong>
            </div>
          </div>

          <CollapsiblePanel
            title="Top 10 podle cost per engagement"
            open={topOpen}
            onToggle={() => setTopOpen((current) => !current)}
            hint={
              <>
                Seřazeno od nejnižší ceny za engagement pro aktivní měsíc.
                Benchmark se počítá zvlášť pro aktuální zemi a formát.
              </>
            }
          >
            <div className="topList">
              {topRows.map((row, index) => (
                <div className="topItem" key={`${row.country}-${row.type}-${row.title}-${row.date}`}>
                  <div className="rank">{index + 1}</div>
                  <Preview row={row} />
                  <div>
                    <div className="title">{row.title}</div>
                    {row.snippet ? <div className="snippet">{row.snippet}</div> : null}
                    <div className="meta">
                      {row.date} · {fmt.format(Math.round(row.engagements))}{" "}
                      engagements · <TierBadge row={row} />
                    </div>
                  </div>
                  <div className="metric">{formatCpe(row.cpe, type)}</div>
                </div>
              ))}
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel
            title="Měsíční přehled"
            open={monthlyOpen}
            onToggle={() => setMonthlyOpen((current) => !current)}
            hint={
              <>
                {selectedMonth ? monthName(selectedMonth) : "-"} ·{" "}
                {fmt.format(rows.length)} postů · avg CPE{" "}
                {formatCpe(dashboardStats.avgCpe, type)} ·{" "}
                {fmt.format(Math.round(dashboardStats.engagements))} engagements
                · reach {fmt.format(Math.round(dashboardStats.reach))} · spend{" "}
                {formatEuro(dashboardStats.spend)}
                {bestPost ? (
                  <>
                    {" "}
                    · nejlepší post: {bestPost.title} (
                    {formatCpe(bestPost.cpe, type)})
                  </>
                ) : null}
              </>
            }
          >
            <div className="tableScroller">
              <table>
                <thead>
                  <tr>
                    <th>Post</th>
                    <th>CPE</th>
                    <th>Semafor</th>
                    <th>Engagements</th>
                    <th>Reach</th>
                    <th>Spend</th>
                    <th>Index vs průměr</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row) => (
                    <tr key={`${row.country}-${row.type}-${row.title}-${row.date}`}>
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
                        <strong>{formatCpe(row.cpe, type)}</strong>
                      </td>
                      <td>
                        <TierBadge row={row} />
                      </td>
                      <td>{fmt.format(Math.round(row.engagements))}</td>
                      <td>{fmt.format(Math.round(row.reach))}</td>
                      <td>{formatEuro(row.spend)}</td>
                      <td>
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
