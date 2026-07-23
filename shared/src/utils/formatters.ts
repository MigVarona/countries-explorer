/**
 * Formats a population number for display, e.g. 47351567 -> "47,351,567"
 * (en) or "47.351.567" (es). Falls back to plain string if Intl is missing.
 */
export function formatPopulation(population: number, locale: string = "en"): string {
  if (!Number.isFinite(population) || population < 0) return "—";
  try {
    return new Intl.NumberFormat(locale).format(population);
  } catch {
    return String(population);
  }
}

/** Case/whitespace-insensitive filter of countries by name. */
export function normalizeSearchTerm(term: string): string {
  return term.trim().toLowerCase();
}
