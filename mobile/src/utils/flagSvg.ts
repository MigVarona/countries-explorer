/**
 * Some flag SVGs ship `width`/`height` but no `viewBox` (e.g. Spain, Japan).
 * Without a viewBox react-native-svg cannot scale the artwork: it draws it at
 * its intrinsic size and the container crops it. Deriving the viewBox from the
 * declared dimensions makes those flags scale like the rest.
 */
export function ensureSvgViewBox(svg: string): string {
  const openingTag = svg.match(/<svg\b[^>]*>/i)?.[0];
  if (!openingTag || /\bviewBox\s*=/i.test(openingTag)) return svg;

  const width = openingTag.match(/\bwidth\s*=\s*"([\d.]+)(?:px)?"/i)?.[1];
  const height = openingTag.match(/\bheight\s*=\s*"([\d.]+)(?:px)?"/i)?.[1];
  if (!width || !height) return svg;

  return svg.replace(openingTag, openingTag.replace(/^<svg\b/i, `<svg viewBox="0 0 ${width} ${height}"`));
}
