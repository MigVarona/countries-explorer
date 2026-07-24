export const API_BASE_URL = "https://api.restcountries.com/countries/v5";

/**
 * v5 `response_fields` allowlist for the list: only what a row shows, so the
 * ~250-country payload stays small.
 * See https://restcountries.com/docs/countries#field-reference
 */
export const COUNTRY_FIELDS = [
  "codes.alpha_3",
  "names.common",
  "names.official",
  "names.translations.spa",
  "flag.url_png",
  "flag.url_svg",
  "flag.description",
  "flag.emoji",
  "capitals",
  "population",
  "region",
].join(",");

/** The list fields plus everything the detail screen shows, for a single country. */
export const COUNTRY_DETAIL_FIELDS = [
  COUNTRY_FIELDS,
  "subregion",
  "continents",
  "landlocked",
  "borders",
  "area.kilometers",
  "timezones",
  "languages",
  "currencies",
  "calling_codes",
  "tlds",
  "cars.driving_side",
].join(",");

/** Max page size on the free plan; used to page through the full list. */
export const API_PAGE_SIZE = 100;

/** Every region the v5 dataset uses (verified against the live API). */
export const REGIONS = ["Africa", "Americas", "Antarctic", "Asia", "Europe", "Oceania"] as const;

export type Region = (typeof REGIONS)[number];
