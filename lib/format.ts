import type { YearMonth } from "@/types/portfolio";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatYearMonth(value: YearMonth): string {
  const [year, month] = value.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatPeriod(start: YearMonth, end: YearMonth | null): string {
  return `${formatYearMonth(start)} - ${end ? formatYearMonth(end) : "Present"}`;
}

export function yearOf(value: YearMonth): number {
  return Number(value.split("-")[0]);
}
