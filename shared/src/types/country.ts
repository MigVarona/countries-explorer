/** Raw shape returned by REST Countries API v3.1 (only the fields we request). */
export interface RestCountryDto {
  cca3: string;
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  capital?: string[];
  population: number;
  region: string;
}

/** Normalized domain model used by both mobile and web. */
export interface Country {
  /** Unique identifier (ISO 3166-1 alpha-3 code, e.g. "ESP"). */
  id: string;
  name: string;
  officialName: string;
  flagPng: string;
  flagSvg: string;
  flagAlt: string;
  capital: string | null;
  population: number;
  region: string;
}
