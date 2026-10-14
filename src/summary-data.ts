import type { Country, ReportRow } from "./report-data";

export type SummaryStats = {
  spend: number;
  reach: number;
  engagements: number;
  avgCpe: number | null;
  posts: number;
};

export type SummaryMetric = keyof SummaryStats;

export type MonthlySummary = {
  month: string;
  total: SummaryStats;
  countries: Record<Country, SummaryStats>;
};

export function summaryStats(rows: ReportRow[]): SummaryStats {
  const spend = rows.reduce((total, row) => total + row.spendEur, 0);
  const reach = rows.reduce((total, row) => total + (row.reach ?? 0), 0);
  const engagements = rows.reduce(
    (total, row) => total + (row.engagements ?? 0),
    0,
  );

  return {
    spend,
    reach,
    engagements,
    avgCpe: engagements ? spend / engagements : null,
    posts: rows.length,
  };
}

export function monthlySummaries(rows: ReportRow[]): MonthlySummary[] {
  const months = [...new Set(rows.map((row) => row.month_key))].sort();
  return months.map((month) => {
    const monthRows = rows.filter((row) => row.month_key === month);
    return {
      month,
      total: summaryStats(monthRows),
      countries: {
        CZ: summaryStats(monthRows.filter((row) => row.country === "CZ")),
        SK: summaryStats(monthRows.filter((row) => row.country === "SK")),
      },
    };
  });
}
