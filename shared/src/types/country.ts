/** Raw country shape returned by REST Countries API v5 (only the fields we request). */
export interface RestCountryDto {
  codes: {
    alpha_3: string;
  };
  names: {
    common: string;
    official: string;
    translations?: {
      spa?: {
        common: string;
        official: string;
      };
    };
  };
  flag: {
    url_png: string;
    url_svg: string;
    /** Plain-language description of the flag, suitable as alt text. May be empty. */
    description?: string;
    emoji?: string;
  };
  capitals?: Array<{ name: string }>;
  population: number;
  region: string;

  /** Detail-only fields: absent when the country comes from the list endpoint. */
  subregion?: string;
  continents?: string[];
  landlocked?: boolean;
  borders?: string[];
  area?: { kilometers?: number };
  timezones?: string[];
  languages?: Array<{ name: string; native_name?: string }>;
  currencies?: Array<{ code: string; name: string; symbol?: string }>;
  calling_codes?: string[];
  tlds?: string[];
  cars?: { driving_side?: string };
}

/** Envelope every v5 endpoint wraps its payload in. */
export interface RestCountriesResponse {
  data: {
    objects: RestCountryDto[];
    meta?: {
      total: number;
      count: number;
      limit: number;
      offset: number;
      more: boolean;
    };
  };
}

/** Languages the apps can display country names in. */
export type SupportedLanguage = "en" | "es";

export interface CountryLanguage {
  name: string;
  nativeName: string;
}

export interface CountryCurrency {
  code: string;
  name: string;
  symbol: string | null;
}

/**
 * Normalized domain model used by both mobile and web. Everything below
 * `region` only arrives from the detail endpoint, so it is optional: a country
 * taken from the cached list simply doesn't have it yet.
 */
export interface Country {
  /** Unique identifier (ISO 3166-1 alpha-3 code, e.g. "ESP"). */
  id: string;
  name: string;
  officialName: string;
  /** Spanish translations; fall back to the English names when missing. */
  nameEs: string;
  officialNameEs: string;
  flagPng: string;
  flagSvg: string;
  flagAlt: string;
  flagEmoji: string | null;
  capital: string | null;
  population: number;
  region: string;

  subregion: string | null;
  continents: string[];
  landlocked: boolean | null;
  /** alpha-3 codes of the countries sharing a land border. */
  borders: string[];
  areaKm2: number | null;
  timezones: string[];
  languages: CountryLanguage[];
  currencies: CountryCurrency[];
  callingCodes: string[];
  topLevelDomains: string[];
  drivingSide: string | null;
}
