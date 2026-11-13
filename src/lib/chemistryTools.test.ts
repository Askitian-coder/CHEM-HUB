import { describe, expect, it } from "vitest";
import {
  balanceRedoxEquation,
  classifySubstance,
  determineOxidationNumbers,
} from "./chemistryTools";

describe("redox reaction balancer", () => {
  it("balances an ionic reaction in acidic solution, including charge", () => {
    expect(
      balanceRedoxEquation("MnO4^- + Fe^2+ + H+ -> Mn^2+ + Fe^3+ + H2O"),
    ).toBe("MnO4^- + 5Fe^2+ + 8H+ → Mn^2+ + 5Fe^3+ + 4H2O");
  });

  it("balances a molecular reaction", () => {
    expect(balanceRedoxEquation("H2 + O2 -> H2O")).toBe("2H2 + O2 → 2H2O");
    expect(balanceRedoxEquation("2H2 + O2 -> 2H2O")).toBe("2H2 + O2 → 2H2O");
  });

  it("reports invalid or ambiguous equations", () => {
    expect(() => balanceRedoxEquation("H2 + O2")).toThrow(/reaction arrow/i);
    expect(() => balanceRedoxEquation("H2 -> H2 + O2")).toThrow(/cannot all appear/i);
  });
});

describe("acid, base, and salt determiner", () => {
  it.each([
    ["HCl", "Acid"],
    ["H2SO4", "Acid"],
    ["Ca(OH)2", "Base"],
    ["NH3", "Base"],
    ["NH4OH", "Base"],
    ["NaCl", "Salt"],
    ["NH4NO3", "Salt"],
    ["H2O", "Neutral / other"],
  ] as const)("classifies %s as %s", (formula, expected) => {
    expect(classifySubstance(formula)).toBe(expected);
  });
});

describe("oxidation number calculator", () => {
  it("assigns the usual oxidation numbers in water", () => {
    expect(determineOxidationNumbers("H2O")).toMatchObject([
      { symbol: "H", value: 1 },
      { symbol: "O", value: -2 },
    ]);
  });

  it("solves for the unknown element using the total ionic charge", () => {
    expect(determineOxidationNumbers("SO4^2-")).toMatchObject([
      { symbol: "S", value: 6 },
      { symbol: "O", value: -2 },
    ]);
  });

  it("uses the charge as the oxidation number of a monatomic ion", () => {
    expect(determineOxidationNumbers("Fe^3+")).toMatchObject([
      { symbol: "Fe", value: 3 },
    ]);
    expect(determineOxidationNumbers("Cl^-")).toMatchObject([
      { symbol: "Cl", value: -1 },
    ]);
    expect(determineOxidationNumbers("O2")).toMatchObject([
      { symbol: "O", value: 0 },
    ]);
  });

  it("marks formulas where common rules do not determine every value", () => {
    expect(determineOxidationNumbers("Fe3O4")).toMatchObject([
      { symbol: "Fe", value: null },
      { symbol: "O", value: -2 },
    ]);
    expect(determineOxidationNumbers("Fe3O4")[0].note).toMatch(/mixed oxidation states/i);
  });
});
