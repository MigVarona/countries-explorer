import {
  API_BASE_URL,
  API_PAGE_SIZE,
  COUNTRY_DETAIL_FIELDS,
  COUNTRY_FIELDS,
} from "../constants";
import { mapRestCountries, mapRestCountryToCountry, sortCountriesByName } from "../mappers/countryMapper";
import type { Country, RestCountriesResponse } from "../types/country";

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

let configuredApiKey: string | undefined;

/** Overrides the API key resolved from the environment (useful in tests). */
export function configureCountriesApi(options: { apiKey: string }): void {
  configuredApiKey = options.apiKey;
}

/**
 * REST Countries v5 requires a key on every request. Each app exposes it via
 * its public env var; the literal `process.env.X` expressions below are what
 * Expo and Next.js statically inline at build time.
 */
function resolveApiKey(): string {
  const key =
    configuredApiKey ??
    (typeof process !== "undefined"
      ? (process.env.EXPO_PUBLIC_RESTCOUNTRIES_API_KEY ??
        process.env.NEXT_PUBLIC_RESTCOUNTRIES_API_KEY)
      : undefined);
  if (!key) {
    throw new Error(
      "Missing REST Countries API key. Set EXPO_PUBLIC_RESTCOUNTRIES_API_KEY (mobile) or NEXT_PUBLIC_RESTCOUNTRIES_API_KEY (web), or call configureCountriesApi().",
    );
  }
  return key;
}

async function fetchCountryDtos(url: string, signal?: AbortSignal): Promise<RestCountriesResponse> {
  const response = await fetch(url, {
    signal,
    headers: { Authorization: `Bearer ${resolveApiKey()}` },
  });
  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }
  return (await response.json()) as RestCountriesResponse;
}

/**
 * The v5 dataset includes territories without an ISO alpha-3 code (empty
 * string). They can't be identified or navigated to, so we drop them.
 */
function validObjects(body: RestCountriesResponse) {
  return body.data.objects.filter((dto) => dto.codes.alpha_3);
}

/** Safety cap when paging through the full list (250-ish countries ≈ 3 pages). */
const MAX_PAGES = 10;

/**
 * Fetches every country (paging through the v5 list endpoint), sorted
 * alphabetically. Name search happens client-side over this list — see
 * `filterCountriesByName` — because v5 cannot search translated names.
 */
export async function getAllCountries(signal?: AbortSignal): Promise<Country[]> {
  const all: Country[] = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const offset = page * API_PAGE_SIZE;
    const body = await fetchCountryDtos(
      `${API_BASE_URL}?response_fields=${COUNTRY_FIELDS}&limit=${API_PAGE_SIZE}&offset=${offset}`,
      signal,
    );
    all.push(...mapRestCountries(validObjects(body)));
    if (!body.data.meta?.more) break;
  }
  return sortCountriesByName(all);
}

/**
 * Fetches a single country by its unique alpha-3 code, with the richer field
 * set the detail screen needs (languages, currencies, borders, …).
 */
export async function getCountryById(id: string, signal?: AbortSignal): Promise<Country> {
  const body = await fetchCountryDtos(
    `${API_BASE_URL}/codes.alpha_3/${encodeURIComponent(id)}?response_fields=${COUNTRY_DETAIL_FIELDS}`,
    signal,
  );
  const dto = body.data.objects[0];
  if (!dto) {
    throw new ApiError(`Country ${id} not found`, 404);
  }
  return mapRestCountryToCountry(dto);
}
