import { describe, expect, it } from "vitest";
import {
  filterCountriesByName,
  filterCountriesByRegion,
  getCountryName,
  mapRestCountryToCountry,
  sortCountriesByName,
} from "../mappers/countryMapper";
import type { RestCountryDto } from "../types/country";

const spainDto: RestCountryDto = {
  codes: { alpha_3: "ESP" },
  names: {
    common: "Spain",
    official: "Kingdom of Spain",
    translations: { spa: { common: "España", official: "Reino de España" } },
  },
  flag: {
    url_png: "https://flags.restcountries.com/v5/w640/es.png",
    url_svg: "https://flags.restcountries.com/v5/svg/es.svg",
    description: "The flag of Spain",
  },
  capitals: [{ name: "Madrid" }],
  population: 49687120,
  region: "Europe",
};

const named = (name: string, nameEs?: string) =>
  mapRestCountryToCountry({
    ...spainDto,
    names: {
      common: name,
      official: name,
      translations: nameEs ? { spa: { common: nameEs, official: nameEs } } : undefined,
    },
  });

describe("mapRestCountryToCountry", () => {
  it("maps the list fields of a raw v5 DTO, using codes.alpha_3 as id", () => {
    expect(mapRestCountryToCountry(spainDto)).toMatchObject({
      id: "ESP",
      name: "Spain",
      officialName: "Kingdom of Spain",
      nameEs: "España",
      officialNameEs: "Reino de España",
      flagPng: "https://flags.restcountries.com/v5/w640/es.png",
      flagSvg: "https://flags.restcountries.com/v5/svg/es.svg",
      flagAlt: "The flag of Spain",
      capital: "Madrid",
      population: 49687120,
      region: "Europe",
    });
  });

  it("maps the detail fields, normalizing languages, currencies and calling codes", () => {
    const country = mapRestCountryToCountry({
      ...spainDto,
      subregion: "Southern Europe",
      continents: ["Europe"],
      landlocked: false,
      borders: ["AND", "FRA", "PRT"],
      area: { kilometers: 505992 },
      timezones: ["UTC", "UTC+01:00"],
      languages: [
        { name: "Spanish", native_name: "español" },
        { name: "Basque" },
      ],
      currencies: [{ code: "EUR", name: "Euro", symbol: "€" }],
      calling_codes: ["34"],
      tlds: [".es"],
      cars: { driving_side: "right" },
    });

    expect(country).toMatchObject({
      subregion: "Southern Europe",
      borders: ["AND", "FRA", "PRT"],
      areaKm2: 505992,
      timezones: ["UTC", "UTC+01:00"],
      currencies: [{ code: "EUR", name: "Euro", symbol: "€" }],
      topLevelDomains: [".es"],
      drivingSide: "right",
      landlocked: false,
    });
    // A missing native name falls back to the English one, and the API's bare
    // dialing code is normalized for display.
    expect(country.languages).toEqual([
      { name: "Spanish", nativeName: "español" },
      { name: "Basque", nativeName: "Basque" },
    ]);
    expect(country.callingCodes).toEqual(["+34"]);
  });

  it("falls back to English names and empty detail data when fields are missing", () => {
    const dto: RestCountryDto = {
      ...spainDto,
      codes: { alpha_3: "ATA" },
      names: { common: "Antarctica", official: "Antarctica" },
      flag: { url_png: "png-url", url_svg: "svg-url", description: "" },
      capitals: [],
    };
    const country = mapRestCountryToCountry(dto);
    expect(country.capital).toBeNull();
    expect(country.flagAlt).toBe("Flag of Antarctica");
    expect(country.nameEs).toBe("Antarctica");
    expect(getCountryName(country, "es")).toBe("Antarctica");
    expect(country.languages).toEqual([]);
    expect(country.borders).toEqual([]);
    expect(country.areaKm2).toBeNull();
  });
});

describe("filterCountriesByName", () => {
  const countries = [
    named("Germany", "Alemania"),
    named("Denmark", "Dinamarca"),
    named("Malta", "Malta"),
    named("Myanmar", "Myanmar"),
    named("San Marino", "San Marino"),
  ];

  it("matches by substring and ranks prefix matches first", () => {
    const result = filterCountriesByName(countries, "Ma", "en");
    expect(result.map((c) => c.name)).toEqual(["Malta", "Denmark", "Germany", "Myanmar", "San Marino"]);
  });

  it("searches the Spanish name (accent-insensitive) when language is es", () => {
    expect(filterCountriesByName(countries, "alemania", "es").map((c) => c.nameEs)).toEqual(["Alemania"]);
    expect(filterCountriesByName(countries, "dínamárca", "es").map((c) => c.nameEs)).toEqual(["Dinamarca"]);
  });

  it("returns the full list alphabetically for an empty term", () => {
    expect(filterCountriesByName(countries, "  ", "en")).toHaveLength(countries.length);
    expect(filterCountriesByName(countries, "", "en")[0].name).toBe("Denmark");
  });
});

describe("filterCountriesByRegion", () => {
  const inRegion = (name: string, region: string) => ({
    ...mapRestCountryToCountry({ ...spainDto, names: { common: name, official: name } }),
    region,
  });
  const countries = [inRegion("Spain", "Europe"), inRegion("Japan", "Asia"), inRegion("Peru", "Americas")];

  it("keeps only the countries in the given region", () => {
    expect(filterCountriesByRegion(countries, "Asia").map((c) => c.name)).toEqual(["Japan"]);
  });

  it("returns every country when no region is selected", () => {
    expect(filterCountriesByRegion(countries, null)).toHaveLength(3);
  });
});

describe("sortCountriesByName", () => {
  it("sorts alphabetically by the displayed name without mutating the input", () => {
    const unsorted = [named("Zimbabwe"), named("Albania")];
    const sorted = sortCountriesByName(unsorted);
    expect(sorted.map((c) => c.name)).toEqual(["Albania", "Zimbabwe"]);
    expect(unsorted[0].name).toBe("Zimbabwe");
  });

  it("sorts by the Spanish name when language is es", () => {
    const unsorted = [named("Germany", "Alemania"), named("Switzerland", "Suiza"), named("Denmark", "Dinamarca")];
    expect(sortCountriesByName(unsorted, "es").map((c) => c.nameEs)).toEqual([
      "Alemania",
      "Dinamarca",
      "Suiza",
    ]);
  });
});
