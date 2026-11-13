import { describe, expect, it } from "vitest";
import {
  prepareStoichiometricReaction,
  solveStoichiometry,
} from "./stoichiometry";

describe("stoichiometry solver", () => {
  it("balances a reaction and identifies the limiting reactant", () => {
    const reaction = prepareStoichiometricReaction("N2 + H2 -> NH3");
    expect(reaction.equation).toBe("N2 + 3H2 → 2NH3");

    const result = solveStoichiometry(
      "N2 + H2 -> NH3",
      [
        { formula: "N2", amount: 1, unit: "mol" },
        { formula: "H2", amount: 1, unit: "mol" },
      ],
      "NH3",
      10,
    );
    expect(result.limitingReactant).toBe("H2");
    expect(result.productMoles).toBeCloseTo(2 / 3);
    expect(result.theoreticalMassGrams).toBeCloseTo(2 / 3 * 17.03, 1);
    expect(result.percentYield).toBeCloseTo(10 / result.theoreticalMassGrams * 100);
  });

  it("converts a measured reactant mass to moles", () => {
    const result = solveStoichiometry(
      "H2 + O2 -> H2O",
      [
        { formula: "H2", amount: 6.048, unit: "g" },
        { formula: "O2", amount: 32, unit: "g" },
      ],
      "H2O",
    );
    expect(result.limitingReactant).toBe("O2");
    expect(result.productMoles).toBeCloseTo(2);
    expect(result.theoreticalMassGrams).toBeCloseTo(36.04);
  });

  it("reports missing or mismatched reactant and product data", () => {
    expect(() => solveStoichiometry("H2 + O2 -> H2O", [], "H2O"))
      .toThrow(/at least one reactant/i);
    expect(() => solveStoichiometry(
      "H2 + O2 -> H2O",
      [{ formula: "H2", amount: 1, unit: "mol" }],
      "O2",
    )).toThrow(/product that appears/i);
    expect(() => solveStoichiometry(
      "H2 + O2 -> H2O",
      [{ formula: "CO2", amount: 1, unit: "mol" }],
      "H2O",
    )).toThrow(/not a reactant/i);
  });
});
