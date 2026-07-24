import type { Country, RestCountryDto, SupportedLanguage } from "../types/country";
import { normalizeSearchTerm } from "../utils/formatters";

/** Normalizes a raw REST Countries v5 DTO into our domain model. */
export function mapRestCountryToCountry(dto: RestCountryDto): Country {
  const spanish = dto.names.translations?.spa;
  return {
    id: dto.codes.alpha_3,
    name: dto.names.common,
    officialName: dto.names.official,
    nameEs: spanish?.common ?? dto.names.common,
    officialNameEs: spanish?.official ?? dto.names.official,
    flagPng: dto.flag.url_png,
    flagSvg: dto.flag.url_svg,
    flagAlt: dto.flag.description || `Flag of ${dto.names.common}`,
    flagEmoji: dto.flag.emoji || null,
    capital: dto.capitals?.[0]?.name ?? null,
    population: dto.population,
    region: dto.region,

    subregion: dto.subregion || null,
    continents: dto.continents ?? [],
    landlocked: dto.landlocked ?? null,
    borders: dto.borders ?? [],
    areaKm2: dto.area?.kilometers ?? null,
    timezones: dto.timezones ?? [],
    languages: (dto.languages ?? []).map((language) => ({
      name: language.name,
      nativeName: language.native_name || language.name,
    })),
    currencies: (dto.currencies ?? []).map((currency) => ({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol || null,
    })),
    callingCodes: (dto.calling_codes ?? []).map((code) =>
      code.startsWith("+") ? code : `+${code}`,
    ),
    topLevelDomains: dto.tlds ?? [],
    drivingSide: dto.cars?.driving_side || null,
  };
}

export function mapRestCountries(dtos: RestCountryDto[]): Country[] {
  return dtos.map(mapRestCountryToCountry);
}

/** The country name to display for the given UI language. */
export function getCountryName(country: Country, language: SupportedLanguage = "en"): string {
  return language === "es" ? country.nameEs : country.name;
}

/** The official country name to display for the given UI language. */
export function getCountryOfficialName(
  country: Country,
  language: SupportedLanguage = "en",
): string {
  return language === "es" ? country.officialNameEs : country.officialName;
}

/** Lowercases and strips diacritics, so "espana" matches "España". */
function foldAccents(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}+/gu, "");
}

/**
 * Builds the comparable key for each country once, then sorts on plain string
 * comparison. Calling `localeCompare` inside the comparator instead would run
 * ~1700 collations for 250 countries — noticeably slow on Hermes, where each
 * one crosses into native ICU. Accent folding makes plain comparison order
 * Spanish names correctly for this dataset.
 */
function sortByKey<T extends { key: string }>(items: T[], rank?: (item: T) => number): T[] {
  return items.sort((a, b) => {
    if (rank) {
      const difference = rank(a) - rank(b);
      if (difference !== 0) return difference;
    }
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });
}

function decorate(countries: Country[], language: SupportedLanguage) {
  return countries.map((country) => ({
    country,
    key: foldAccents(getCountryName(country, language)),
  }));
}

/** Sorts countries alphabetically by the name shown for `language`. */
export function sortCountriesByName(
  countries: Country[],
  language: SupportedLanguage = "en",
): Country[] {
  return sortByKey(decorate(countries, language)).map((entry) => entry.country);
}

/** Narrows a list to one region; a null region means "no filter". */
export function filterCountriesByRegion(
  countries: Country[],
  region: string | null,
): Country[] {
  return region ? countries.filter((country) => country.region === region) : countries;
}

/**
 * Case- and accent-insensitive substring search over the displayed country
 * name, ranking prefix matches first. Runs client-side over the full (cached)
 * list because the v5 API cannot search translated names server-side; with
 * ~250 countries this is instant and costs no API quota per keystroke.
 */
export function filterCountriesByName(
  countries: Country[],
  term: string,
  language: SupportedLanguage = "en",
): Country[] {
  const needle = foldAccents(normalizeSearchTerm(term));
  const decorated = decorate(countries, language);
  if (!needle) return sortByKey(decorated).map((entry) => entry.country);

  const matches = decorated.filter((entry) => entry.key.includes(needle));
  return sortByKey(matches, (entry) => (entry.key.startsWith(needle) ? 0 : 1)).map(
    (entry) => entry.country,
  );
}
