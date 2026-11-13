import { describe, expect, it } from "vitest";
import {
  calculateMassConcentration,
  calculateMolarity,
  solveDilution,
} from "./concentrationCalculator";

describe("concentration calculations", () => {
  it("calculates molarity and mass concentration", () => {
    expect(calculateMolarity(0.5, 2)).toBe(0.25);
    expect(calculateMassConcentration(10, 2)).toBe(5);
  });

  it("solves the dilution equation for a missing quantity", () => {
    expect(solveDilution({ c1: 2, v1: 0.1, c2: 0.5, v2: null }, "v2")).toBe(0.4);
    expect(solveDilution({ c1: 2, v1: null, c2: 0.5, v2: 0.4 }, "v1")).toBe(0.1);
  });

  it("rejects invalid volumes and incomplete dilution data", () => {
    expect(() => calculateMolarity(1, 0)).toThrow(/greater than zero/i);
    expect(() => calculateMassConcentration(-1, 1)).toThrow(/non-negative/i);
    expect(() => solveDilution({ c1: 2, v1: null, c2: 0.5, v2: null }, "v1"))
      .toThrow(/other three quantities/i);
  });
});
