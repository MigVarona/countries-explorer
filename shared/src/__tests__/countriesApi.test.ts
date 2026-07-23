import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, getAllCountries, searchCountriesByName } from "../services/countriesApi";
import type { RestCountryDto } from "../types/country";

const spainDto: RestCountryDto = {
  cca3: "ESP",
  name: { common: "Spain", official: "Kingdom of Spain" },
  flags: { png: "png-url", svg: "svg-url" },
  capital: ["Madrid"],
  population: 47351567,
  region: "Europe",
};

function mockFetchOnce(status: number, body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("searchCountriesByName", () => {
  it("returns mapped countries on success", async () => {
    mockFetchOnce(200, [spainDto]);
    const result = await searchCountriesByName("spain");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ESP");
  });

  it("normalizes the API 404 (no matches) into an empty list", async () => {
    mockFetchOnce(404, { status: 404, message: "Not Found" });
    await expect(searchCountriesByName("zzzz")).resolves.toEqual([]);
  });
});

describe("getAllCountries", () => {
  it("throws an ApiError with the status for server failures", async () => {
    mockFetchOnce(500, {});
    await expect(getAllCountries()).rejects.toBeInstanceOf(ApiError);
  });
});
