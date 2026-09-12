export type LocalCatchReport = {
  id: string;
  count: number;
  location: string;
  createdAt: string;
};

const REPORTS_KEY = "mosquitonet.catch-reports";

export function readLocalReports(): LocalCatchReport[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(REPORTS_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function saveLocalReport(report: LocalCatchReport) {
  if (typeof window === "undefined") return;
  const reports = [report, ...readLocalReports()].slice(0, 100);
  window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  window.dispatchEvent(new CustomEvent("mosquitonet:report-added", { detail: report }));
}

export function downloadLocalReports() {
  if (typeof window === "undefined") return;
  const blob = new Blob([JSON.stringify(readLocalReports(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mosquitonet-local-reports.json";
  link.click();
  URL.revokeObjectURL(url);
}
