import { ensureSvgViewBox } from "../flagSvg";

describe("ensureSvgViewBox", () => {
  it("derives a viewBox from width/height when it is missing", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="750" height="500"><path/></svg>';
    expect(ensureSvgViewBox(svg)).toContain('viewBox="0 0 750 500"');
  });

  it("leaves an existing viewBox untouched", () => {
    const svg = '<svg width="512" height="512" viewBox="0 0 32 32"><path/></svg>';
    expect(ensureSvgViewBox(svg)).toBe(svg);
  });

  it("returns the markup unchanged when dimensions are missing", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path/></svg>';
    expect(ensureSvgViewBox(svg)).toBe(svg);
  });

  it("handles px units and keeps the rest of the markup", () => {
    const svg = '<svg width="900px" height="600px"><rect fill="#fff"/></svg>';
    const result = ensureSvgViewBox(svg);
    expect(result).toContain('viewBox="0 0 900 600"');
    expect(result).toContain('<rect fill="#fff"/>');
  });
});
