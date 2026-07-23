export const API_BASE_URL = "https://restcountries.com/v3.1";

/**
 * REST Countries v3.1 requires an explicit `fields` filter on `/all`
 * (unfiltered requests are rejected). We request only what the UI needs.
 */
export const COUNTRY_FIELDS = [
  "cca3",
  "name",
  "flags",
  "capital",
  "population",
  "region",
].join(",");
