/**
 * Number formatters are expensive to build (on Hermes each one crosses into
 * native ICU), and every list row formats a population on every render, so
 * we keep one instance per locale.
 */
const numberFormatters = new Map<string, Intl.NumberFormat | null>();

function getNumberFormatter(locale: string): Intl.NumberFormat | null {
  if (!numberFormatters.has(locale)) {
    try {
      numberFormatters.set(locale, new Intl.NumberFormat(locale));
    } catch {
      numberFormatters.set(locale, null);
    }
  }
  return numberFormatters.get(locale) ?? null;
}

/**
 * Formats a population number for display, e.g. 47351567 -> "47,351,567"
 * (en) or "47.351.567" (es). Falls back to plain string if Intl is missing.
 */
export function formatPopulation(population: number, locale: string = "en"): string {
  if (!Number.isFinite(population) || population < 0) return "—";
  return getNumberFormatter(locale)?.format(population) ?? String(population);
}

/** Case/whitespace-insensitive filter of countries by name. */
export function normalizeSearchTerm(term: string): string {
  return term.trim().toLowerCase();
}
