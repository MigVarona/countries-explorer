import { describe, expect, it } from "vitest";
import { mapRestCountryToCountry, sortCountriesByName } from "../mappers/countryMapper";
import type { RestCountryDto } from "../types/country";

const spainDto: RestCountryDto = {
  cca3: "ESP",
  name: { common: "Spain", official: "Kingdom of Spain" },
  flags: { png: "https://flagcdn.com/w320/es.png", svg: "https://flagcdn.com/es.svg", alt: "The flag of Spain" },
  capital: ["Madrid"],
  population: 47351567,
  region: "Europe",
};

describe("mapRestCountryToCountry", () => {
  it("maps a raw DTO into the domain model using cca3 as id", () => {
    expect(mapRestCountryToCountry(spainDto)).toEqual({
      id: "ESP",
      name: "Spain",
      officialName: "Kingdom of Spain",
      flagPng: "https://flagcdn.com/w320/es.png",
      flagSvg: "https://flagcdn.com/es.svg",
      flagAlt: "The flag of Spain",
      capital: "Madrid",
      population: 47351567,
      region: "Europe",
    });
  });

  it("handles countries without capital or flag alt text", () => {
    const dto: RestCountryDto = {
      ...spainDto,
      cca3: "ATA",
      name: { common: "Antarctica", official: "Antarctica" },
      flags: { png: "png-url", svg: "svg-url" },
      capital: undefined,
    };
    const country = mapRestCountryToCountry(dto);
    expect(country.capital).toBeNull();
    expect(country.flagAlt).toBe("Flag of Antarctica");
  });
});

describe("sortCountriesByName", () => {
  it("sorts alphabetically without mutating the input", () => {
    const unsorted = [
      mapRestCountryToCountry({ ...spainDto, cca3: "ZWE", name: { common: "Zimbabwe", official: "Zimbabwe" } }),
      mapRestCountryToCountry({ ...spainDto, cca3: "ALB", name: { common: "Albania", official: "Albania" } }),
    ];
    const sorted = sortCountriesByName(unsorted);
    expect(sorted.map((c) => c.name)).toEqual(["Albania", "Zimbabwe"]);
    expect(unsorted[0].name).toBe("Zimbabwe");
  });
});
