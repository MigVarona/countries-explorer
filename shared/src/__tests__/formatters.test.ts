import { describe, expect, it } from "vitest";
import { formatPopulation, normalizeSearchTerm } from "../utils/formatters";

describe("formatPopulation", () => {
  it("formats with English grouping by default", () => {
    expect(formatPopulation(47351567)).toBe("47,351,567");
  });

  it("formats with Spanish grouping", () => {
    expect(formatPopulation(47351567, "es")).toBe("47.351.567");
  });

  it("returns a placeholder for invalid values", () => {
    expect(formatPopulation(Number.NaN)).toBe("—");
    expect(formatPopulation(-5)).toBe("—");
  });
});

describe("normalizeSearchTerm", () => {
  it("trims and lowercases", () => {
    expect(normalizeSearchTerm("  SpAiN ")).toBe("spain");
  });
});
