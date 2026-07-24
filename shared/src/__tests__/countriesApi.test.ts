import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  configureCountriesApi,
  getAllCountries,
  getCountryById,
} from "../services/countriesApi";
import type { RestCountriesResponse, RestCountryDto } from "../types/country";

const spainDto: RestCountryDto = {
  codes: { alpha_3: "ESP" },
  names: {
    common: "Spain",
    official: "Kingdom of Spain",
    translations: { spa: { common: "España", official: "Reino de España" } },
  },
  flag: { url_png: "png-url", url_svg: "svg-url" },
  capitals: [{ name: "Madrid" }],
  population: 49687120,
  region: "Europe",
};

/** Territory without an ISO code, as v5 now returns (e.g. Abkhazia). */
const noCodeDto: RestCountryDto = {
  codes: { alpha_3: "" },
  names: { common: "Abkhazia", official: "Republic of Abkhazia" },
  flag: { url_png: "", url_svg: "" },
  capitals: [{ name: "Sukhumi" }],
  population: 244236,
  region: "Asia",
};

function v5Body(objects: RestCountryDto[], more = false): RestCountriesResponse {
  return {
    data: {
      objects,
      meta: { total: objects.length, count: objects.length, limit: 100, offset: 0, more },
    },
  };
}

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

beforeEach(() => {
  configureCountriesApi({ apiKey: "rc_test_key" });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getAllCountries", () => {
  it("sends the API key as a bearer token", async () => {
    mockFetchOnce(200, v5Body([]));
    await getAllCountries();
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(init?.headers).toEqual({ Authorization: "Bearer rc_test_key" });
  });

  it("filters out territories without an alpha-3 code", async () => {
    mockFetchOnce(200, v5Body([noCodeDto, spainDto]));
    const result = await getAllCountries();
    expect(result.map((c) => c.id)).toEqual(["ESP"]);
  });

  it("pages through the list until meta.more is false", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(v5Body([spainDto], true)) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(v5Body([noCodeDto], false)) });
    vi.stubGlobal("fetch", fetchMock);
    const result = await getAllCountries();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain("offset=100");
    expect(result.map((c) => c.id)).toEqual(["ESP"]);
  });

  it("throws an ApiError with the status for server failures", async () => {
    mockFetchOnce(500, {});
    await expect(getAllCountries()).rejects.toBeInstanceOf(ApiError);
  });
});

describe("getCountryById", () => {
  it("returns the first object for a code lookup", async () => {
    mockFetchOnce(200, v5Body([spainDto]));
    await expect(getCountryById("ESP")).resolves.toMatchObject({ id: "ESP", name: "Spain" });
  });

  it("throws a 404 ApiError when the code matches nothing", async () => {
    mockFetchOnce(200, v5Body([]));
    await expect(getCountryById("XXX")).rejects.toMatchObject({ status: 404 });
  });
});
