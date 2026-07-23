import type { Country, RestCountryDto } from "../types/country";

/** Normalizes a raw REST Countries DTO into our domain model. */
export function mapRestCountryToCountry(dto: RestCountryDto): Country {
  return {
    id: dto.cca3,
    name: dto.name.common,
    officialName: dto.name.official,
    flagPng: dto.flags.png,
    flagSvg: dto.flags.svg,
    flagAlt: dto.flags.alt ?? `Flag of ${dto.name.common}`,
    capital: dto.capital?.[0] ?? null,
    population: dto.population,
    region: dto.region,
  };
}

export function mapRestCountries(dtos: RestCountryDto[]): Country[] {
  return dtos.map(mapRestCountryToCountry);
}

/** Sorts countries alphabetically by common name (locale-aware). */
export function sortCountriesByName(countries: Country[]): Country[] {
  return [...countries].sort((a, b) => a.name.localeCompare(b.name));
}
