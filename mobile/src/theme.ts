export const colors = {
  background: "#F3F7FC",
  brand: "#073B8C",
  brandLight: "#0B78C8",
  aqua: "#2DD4BF",
  card: "#FFFFFF",
  border: "#DCE5F0",
  text: "#101828",
  textMuted: "#667085",
  accent: "#0B63CE",
  accentSoft: "#EAF3FF",
  danger: "#B42318",
  star: "#F59E0B",
  starSoft: "#FEF6E7",
  skeleton: "#E9ECF2",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

/** Minimum recommended touch target size (a11y). */
export const MIN_TOUCH_SIZE = 44;

/**
 * Breakpoints for the adaptive list: one column on a phone in portrait, more
 * as the viewport grows (landscape phones, tablets).
 */
export function getColumnCount(width: number): number {
  if (width >= 1000) return 3;
  if (width >= 620) return 2;
  return 1;
}
