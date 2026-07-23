import { API_BASE_URL, COUNTRY_FIELDS } from "../constants";
import { mapRestCountries, mapRestCountryToCountry, sortCountriesByName } from "../mappers/countryMapper";
import type { Country, RestCountryDto } from "../types/country";

/** Error thrown for non-OK API responses so the UI can react to the status. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}

/** Fetches every country, sorted alphabetically. */
export async function getAllCountries(signal?: AbortSignal): Promise<Country[]> {
  const dtos = await fetchJson<RestCountryDto[]>(
    `${API_BASE_URL}/all?fields=${COUNTRY_FIELDS}`,
    signal,
  );
  return sortCountriesByName(mapRestCountries(dtos));
}

/**
 * Searches countries by name. The API returns 404 when nothing matches,
 * which we normalize to an empty list (that is an "empty" UI state, not an error).
 */
export async function searchCountriesByName(
  name: string,
  signal?: AbortSignal,
): Promise<Country[]> {
  try {
    const dtos = await fetchJson<RestCountryDto[]>(
      `${API_BASE_URL}/name/${encodeURIComponent(name)}?fields=${COUNTRY_FIELDS}`,
      signal,
    );
    return sortCountriesByName(mapRestCountries(dtos));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return [];
    throw error;
  }
}

/** Fetches a single country by its unique cca3 code. */
export async function getCountryById(id: string, signal?: AbortSignal): Promise<Country> {
  const dto = await fetchJson<RestCountryDto>(
    `${API_BASE_URL}/alpha/${encodeURIComponent(id)}?fields=${COUNTRY_FIELDS}`,
    signal,
  );
  return mapRestCountryToCountry(dto);
}
