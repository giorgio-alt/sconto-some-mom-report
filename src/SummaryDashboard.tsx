import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, ChevronDown, X } from "lucide-react";
import { REPORT_DATA, type Country } from "./report-data";
import {
  monthlySummaries,
  summaryStats,
  type MonthlySummary,
  type SummaryMetric,
  type SummaryStats,
} from "./summary-data";

type ChartScope = "compare" | "total" | Country;

const METRICS: Array<{ key: SummaryMetric; label: string }> = [
  { key: "spend", label: "Spend" },
  { key: "reach", label: "Reach" },
  { key: "engagements", label: "Engagements" },
  { key: "avgCpe", label: "Avg CPE" },
  { key: "posts", label: "Posty" },
];
const COUNTRIES: Country[] = ["CZ", "SK"];
const number = new Intl.NumberFormat("cs-CZ");
const compactNumber = new Intl.NumberFormat("cs-CZ", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function monthLabel(month: string, short = false) {
  const [year, index] = month.split("-");
  return new Date(Number(year), Number(index) - 1, 1).toLocaleDateString("cs-CZ", {
    month: short ? "short" : "long",
    year: "numeric",
  });
}

function metricValue(metric: SummaryMetric, value: number | null, compact = false) {
  if (value === null) return "-";
  if (metric === "spend" || metric === "avgCpe") {
    return value.toLocaleString("cs-CZ", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: metric === "avgCpe" ? 3 : compact ? 0 : 2,
      maximumFractionDigits: metric === "avgCpe" ? 3 : compact ? 0 : 2,
    });
  }
  return (compact ? compactNumber : number).format(Math.round(value));
}

function TrendChart({
  months,
  metric,
  scope,
  selectedMonth,
  onSelectMonth,
}: {
  months: MonthlySummary[];
  metric: SummaryMetric;
  scope: ChartScope;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
}) {
  const series: Array<Country | "total"> = scope === "compare" ? COUNTRIES : [scope === "total" ? "total" : scope];
  const chartScroll = useRef<HTMLDivElement>(null);
  const selectedColumn = useRef<HTMLDivElement>(null);
  const selected = months.find((month) => month.month === selectedMonth);
  const values = months.flatMap((month) => series.map((country) =>
    (country === "total" ? month.total : month.countries[country])[metric],
  ));
  const max = Math.max(0, ...values.filter((value): value is number => value !== null));
  const ceiling = max > 0 ? max * 1.18 : 1;
  const label = METRICS.find((item) => item.key === metric)!.label;

  useEffect(() => {
    const scroll = chartScroll.current;
    const column = selectedColumn.current;
    if (scroll && column && selectedMonth) {
      const centerSelection = () =>
        scroll.scrollTo({
          left: column.offsetLeft - (scroll.clientWidth - column.clientWidth) / 2,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        });
      centerSelection();
      const observer = new ResizeObserver(centerSelection);
      observer.observe(scroll);
      return () => observer.disconnect();
    }
  }, [selectedMonth]);

  return (
    <div className="trendChart" role="group" aria-label={`Graf ${label} po měsících`}>
      <div className="chartAxis" aria-hidden="true">
        {[1, 0.75, 0.5, 0.25, 0].map((fraction) => (
          <span key={fraction}>{metricValue(metric, max > 0 ? ceiling * fraction : 0, true)}</span>
        ))}
      </div>
      <div className="chartScroll" ref={chartScroll}>
        <div className="chartPlot" style={{ gridTemplateColumns: `repeat(${months.length}, minmax(128px, 1fr))`, minWidth: months.length * 128 + Math.max(0, months.length - 1) * 18 }}>
          {months.map((month) => (
            <div className={`chartMonth ${month.month === selectedMonth ? "selected" : ""}`} key={month.month} ref={month.month === selectedMonth ? selectedColumn : undefined}>
              <div className="chartBars">
                {series.map((country) => {
                  const value = (country === "total" ? month.total : month.countries[country])[metric];
                  const title = `${monthLabel(month.month)} · ${country === "total" ? "Celkem" : country} · ${label}: ${metricValue(metric, value)}`;
                  return (
                    <button
                      className={`chartBarButton ${country.toLowerCase()}`}
                      key={country}
                      type="button"
                      aria-label={title}
                      aria-pressed={month.month === selectedMonth}
                      title={title}
                      onClick={() => onSelectMonth(month.month)}
                    >
                      <span className="chartBarValue">{metricValue(metric, value, true)}</span>
                      <span
                        className={`chartBarFill ${value === null ? "missing" : ""}`}
                        style={{ height: `${value === null ? 0 : (value / ceiling) * 100}%` }}
                      />
                    </button>
                  );
                })}
              </div>
              <button className="chartMonthLabel" type="button" onClick={() => onSelectMonth(month.month)}>
                {monthLabel(month.month, true)}
              </button>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <div className="chartDetail" aria-live="polite">
          <b>{monthLabel(selectedMonth)}</b>
          {series.map((country) => (
            <span key={country}>{country === "total" ? "Celkem" : country}: <strong>{metricValue(metric, (country === "total" ? selected.total : selected.countries[country])[metric])}</strong></span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SummaryDashboard() {
  const months = useMemo(() => monthlySummaries(REPORT_DATA), []);
  const [mode, setMode] = useState<"total" | "monthly">("total");
  const [month, setMonth] = useState(months[months.length - 1]?.month ?? "");
  const [chartOpen, setChartOpen] = useState(false);
  const [metric, setMetric] = useState<SummaryMetric>("spend");
  const [scope, setScope] = useState<ChartScope>("compare");
  const chartHeading = useRef<HTMLHeadingElement>(null);
  const chartButton = useRef<HTMLButtonElement>(null);
  const totals = useMemo(() => summaryStats(REPORT_DATA), []);
  const countryTotals = useMemo(() => ({
    CZ: summaryStats(REPORT_DATA.filter((row) => row.country === "CZ")),
    SK: summaryStats(REPORT_DATA.filter((row) => row.country === "SK")),
  }), []);
  const selected = months.find((item) => item.month === month);
  const summary: SummaryStats = mode === "total" ? totals : selected?.total ?? totals;
  const countries = mode === "total" ? countryTotals : selected?.countries ?? countryTotals;

  useEffect(() => {
    if (chartOpen) {
      chartHeading.current?.focus({ preventScroll: true });
      chartHeading.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [chartOpen]);

  function openChart(nextMetric = metric, nextScope: ChartScope = "compare") {
    setMetric(nextMetric);
    setScope(nextScope);
    if (chartOpen) chartHeading.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setChartOpen(true);
  }

  function selectChartMonth(nextMonth: string) {
    setMonth(nextMonth);
    setMode("monthly");
  }

  return (
    <section className="summaryBlock reveal visible" aria-labelledby="summary-title">
      <div className="sectionHeader summaryHeader">
        <div>
          <h2 id="summary-title">Souhrn kampaní</h2>
          <p className="hint">{mode === "total" ? "Všechna dostupná období" : monthLabel(month)} · všechny platformy a formáty</p>
        </div>
        <div className="summaryControls">
          <div className="summarySegments" role="group" aria-label="Období souhrnu">
            <button type="button" aria-pressed={mode === "total"} onClick={() => setMode("total")}>Celkem</button>
            <button type="button" aria-pressed={mode === "monthly"} onClick={() => setMode("monthly")}>Po měsících</button>
          </div>
          {mode === "monthly" && (
            <label className="summarySelect">
              <span className="srOnly">Měsíc souhrnu</span>
              <select aria-label="Měsíc souhrnu" value={month} onChange={(event) => setMonth(event.target.value)}>
                {[...months].reverse().map((item) => <option key={item.month} value={item.month}>{monthLabel(item.month)}</option>)}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </label>
          )}
        </div>
      </div>

      <div className="summaryKpis" aria-label={mode === "total" ? "Celkový souhrn" : `Souhrn ${monthLabel(month)}`}>
        {METRICS.map((item) => (
          <div className="kpi" key={item.key}>
            <span>{item.key === "spend" ? "Spend celkem" : item.key === "reach" ? "Reach celkem" : item.key === "posts" ? "Posty s delivery" : item.label}</span>
            <strong>{metricValue(item.key, summary[item.key])}</strong>
          </div>
        ))}
      </div>

      <div className="countryBreakdown" aria-label="Rozpad podle země">
        <div className="breakdownHeader">
          <h3>Rozpad podle země</h3>
          <button className="summaryChartAction" type="button" ref={chartButton} aria-expanded={chartOpen} aria-controls="summary-trends" onClick={() => openChart()}>
            <BarChart3 size={18} aria-hidden="true" /> Vývoj metrik
          </button>
        </div>
        <div className="breakdownGrid">
          {COUNTRIES.map((country) => (
            <div className="countryRow" key={country}>
              <div className="countryName">{country === "CZ" ? "🇨🇿 CZ" : "🇸🇰 SK"}</div>
              {METRICS.map((item) => (
                <button className="countryMetric" key={item.key} type="button" aria-label={`Graf ${item.label} pro ${country}`} onClick={() => openChart(item.key, country)}>
                  <span>{item.label}</span>
                  <strong>{metricValue(item.key, countries[country][item.key])}</strong>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {chartOpen && (
        <section className="summaryTrends" id="summary-trends" aria-labelledby="trend-title">
          <div className="trendHeader">
            <div>
              <h3 id="trend-title" ref={chartHeading} tabIndex={-1}>Vývoj po měsících</h3>
              <p className="hint">{METRICS.find((item) => item.key === metric)!.label} · {scope === "compare" ? "CZ a SK" : scope === "total" ? "celkem" : scope}</p>
            </div>
            <button className="summaryIconButton" type="button" aria-label="Zavřít graf" title="Zavřít graf" onClick={() => { setChartOpen(false); chartButton.current?.focus(); }}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="trendControls">
            <label className="summarySelect">
              <span className="srOnly">Metrika grafu</span>
              <select aria-label="Metrika grafu" value={metric} onChange={(event) => setMetric(event.target.value as SummaryMetric)}>
                {METRICS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </label>
            <div className="summarySegments chartScopes" role="group" aria-label="Země grafu">
              {([
                ["compare", "CZ + SK"], ["total", "Celkem"], ["CZ", "🇨🇿 CZ"], ["SK", "🇸🇰 SK"],
              ] as Array<[ChartScope, string]>).map(([value, label]) => (
                <button key={value} type="button" aria-pressed={scope === value} onClick={() => setScope(value)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="chartLegend" aria-label="Legenda grafu">
            {(scope === "compare" || scope === "CZ") && <span><i className="cz" /> CZ</span>}
            {(scope === "compare" || scope === "SK") && <span><i className="sk" /> SK</span>}
            {scope === "total" && <span><i className="total" /> Celkem</span>}
          </div>
          <TrendChart months={months} metric={metric} scope={scope} selectedMonth={mode === "monthly" ? month : ""} onSelectMonth={selectChartMonth} />
          <p className="chartMethod">Reach je součet dosahů jednotlivých položek. Avg CPE = celkový spend / engagements. Duben a květen 2026 obsahují pouze Instagram, od června je zahrnutý i Facebook.</p>
        </section>
      )}
    </section>
  );
}
