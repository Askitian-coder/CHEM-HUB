import { describe, expect, it } from "vitest";
import { computeMolarMass, parseFormula } from "./formulaParser";

describe("computeMolarMass", () => {
  it.each([
    ["H2O", 18.02],
    ["H2SO4", 98.08],
    ["O2", 32.0],
    ["(NH4)2SO4", 132.14],
    ["Ca(OH)2", 74.09],
    ["Fe2(SO4)3", 399.88],
    ["CuSO4·5H2O", 249.68],
    ["Na2CO3·10H2O", 286.14],
    ["C12H22O11", 342.3],
    ["K4[Fe(CN)6]", 368.34],
    ["h2o", 18.02],
    ["H₂O", 18.02],
  ] as const)("%s has molar mass %s g/mol", (formula, expected) => {
    expect(computeMolarMass(formula)).toBe(expected);
  });
});

describe("parseFormula", () => {
  it("counts elements through nested mixed brackets and hydrate segments", () => {
    expect(parseFormula("K4[Fe(CN)6]")).toEqual([
      { symbol: "K", count: 4 },
      { symbol: "Fe", count: 1 },
      { symbol: "C", count: 6 },
      { symbol: "N", count: 6 },
    ]);
    expect(parseFormula("CuSO4·5H2O")).toEqual([
      { symbol: "Cu", count: 1 },
      { symbol: "S", count: 1 },
      { symbol: "O", count: 9 },
      { symbol: "H", count: 10 },
    ]);
  });

  it("accepts case-insensitive symbols and whitespace", () => {
    expect(parseFormula("  h 2 o ")).toEqual([
      { symbol: "H", count: 2 },
      { symbol: "O", count: 1 },
    ]);
    expect(parseFormula("HE")).toEqual([{ symbol: "He", count: 1 }]);
  });

  it.each([
    ["Xx2", /Unknown element: Xx/],
    ["H2O)", /Unbalanced brackets/],
    ["(H2O", /Unbalanced brackets/],
    ["", /cannot be empty/i],
    ["2H", /number must follow an element or group/i],
    ["H2..O", /hydrate separator/],
  ] as const)("rejects malformed formula %j", (formula, error) => {
    expect(() => parseFormula(formula)).toThrow(error);
  });
});
