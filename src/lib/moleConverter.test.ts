import { describe, expect, it } from "vitest";
import { convertMoles } from "./moleConverter";

describe("mole converter", () => {
  it("converts grams to moles and particles using a parsed formula", () => {
    expect(convertMoles("H2O", "36", "g")).toMatchObject({
      molarMass: 18.02,
      moles: 36 / 18.02,
      grams: 36,
      particles: (36 / 18.02) * 6.02214076e23,
    });
  });

  it("supports formulas with grouped atoms and particle inputs", () => {
    const result = convertMoles("Ca(OH)2", "6.02214076e23", "particles");
    expect(result.moles).toBe(1);
    expect(result.grams).toBe(74.09);
  });

  it.each(["", "0", "-2", "1abc", "Infinity"])("rejects invalid amount %j", (amount) => {
    expect(() => convertMoles("H2O", amount, "mol")).toThrow(/positive amount/i);
  });

  it("rejects positive amounts when conversion underflows to zero", () => {
    expect(() => convertMoles("H2O", "5e-324", "g")).toThrow(/too small to convert accurately/i);
  });

  it("rejects fractional particle counts and malformed formulas", () => {
    expect(() => convertMoles("H2O", "1.5", "particles")).toThrow(/whole number/i);
    expect(() => convertMoles("H2O)", "1", "mol")).toThrow(/unbalanced brackets/i);
  });
});
