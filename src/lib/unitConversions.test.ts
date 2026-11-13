import { describe, expect, it } from "vitest";
import { convertUnit } from "./unitConversions";

describe("convertUnit", () => {
  it("converts common chemistry units", () => {
    expect(convertUnit(1, "atm", "mmhg")).toBeCloseTo(760, 8);
    expect(convertUnit(250, "ml", "l")).toBeCloseTo(0.25);
    expect(convertUnit(25, "celsius", "kelvin")).toBeCloseTo(298.15);
    expect(convertUnit(32, "fahrenheit", "celsius")).toBeCloseTo(0);
    expect(convertUnit(2, "kcal", "kj")).toBeCloseTo(8.368);
  });

  it("converts between amount and mass when a formula is provided", () => {
    expect(convertUnit(1, "mol", "g", "H2O")).toBeCloseTo(18.02);
    expect(convertUnit(36.04, "g", "mol", "H2O")).toBeCloseTo(2);
  });

  it("rejects incompatible units and invalid physical values", () => {
    expect(() => convertUnit(1, "mol", "l")).toThrow(/different quantities/i);
    expect(() => convertUnit(1, "mol", "g")).toThrow(/chemical formula/i);
    expect(() => convertUnit(-1, "kg", "g")).toThrow(/cannot be negative/i);
    expect(() => convertUnit(-274, "celsius", "kelvin")).toThrow(/absolute zero/i);
  });
});
