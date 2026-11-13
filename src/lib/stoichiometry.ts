import { balanceRedoxEquation } from "./chemistryTools";
import { computeMolarMass } from "./formulaParser";

export type AmountUnit = "mol" | "g";

export interface ReactionSpecies {
  formula: string;
  coefficient: number;
  molarMass: number;
}

export interface StoichiometricReaction {
  equation: string;
  reactants: ReactionSpecies[];
  products: ReactionSpecies[];
}

export interface ReactantAmount {
  formula: string;
  amount: number;
  unit: AmountUnit;
}

export interface StoichiometryResult {
  equation: string;
  limitingReactant: string;
  productFormula: string;
  productMoles: number;
  theoreticalMassGrams: number;
  actualYieldGrams: number | null;
  percentYield: number | null;
  reactants: {
    formula: string;
    availableMoles: number;
    coefficient: number;
    reactionExtent: number;
  }[];
}

function stripCharge(formula: string): string {
  return formula.replace(/\^\d*[+-]$/, "").replace(/[+-]$/, "");
}

function parseSide(side: string): ReactionSpecies[] {
  return side.split(/\s+\+\s+/).map((term) => {
    const match = /^(\d+)?(.+)$/.exec(term.trim());
    if (!match) throw new Error(`Could not read reaction species "${term}".`);

    const coefficient = Number(match[1] || 1);
    const formula = stripCharge(match[2].trim());
    if (!formula) throw new Error("Each reaction species needs a chemical formula.");

    return {
      formula,
      coefficient,
      molarMass: computeMolarMass(formula),
    };
  });
}

export function prepareStoichiometricReaction(equation: string): StoichiometricReaction {
  const balanced = balanceRedoxEquation(equation);
  const sides = balanced.split(" → ");
  if (sides.length !== 2) throw new Error("Could not separate the balanced reaction sides.");

  return {
    equation: balanced,
    reactants: parseSide(sides[0]),
    products: parseSide(sides[1]),
  };
}

export function solveStoichiometry(
  equation: string,
  amounts: readonly ReactantAmount[],
  productFormula: string,
  actualYieldGrams?: number,
): StoichiometryResult {
  const reaction = prepareStoichiometricReaction(equation);
  const product = reaction.products.find((species) => species.formula === productFormula);
  if (!product) throw new Error("Choose a product that appears on the right side of the reaction.");
  if (amounts.length === 0) throw new Error("Enter an amount for at least one reactant.");

  const reactants = amounts.map(({ formula, amount, unit }) => {
    const species = reaction.reactants.find((item) => item.formula === formula);
    if (!species) throw new Error(`${formula} is not a reactant in this equation.`);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`Enter an amount greater than zero for ${formula}.`);
    }

    const availableMoles = unit === "mol" ? amount : amount / species.molarMass;
    return {
      formula,
      availableMoles,
      coefficient: species.coefficient,
      reactionExtent: availableMoles / species.coefficient,
    };
  });

  const limitingReactant = reactants.reduce((limiting, current) =>
    current.reactionExtent < limiting.reactionExtent ? current : limiting,
  );
  const productMoles = limitingReactant.reactionExtent * product.coefficient;
  const theoreticalMassGrams = productMoles * product.molarMass;

  if (
    actualYieldGrams !== undefined &&
    (!Number.isFinite(actualYieldGrams) || actualYieldGrams < 0)
  ) {
    throw new Error("Actual product mass must be a non-negative number of grams.");
  }

  return {
    equation: reaction.equation,
    limitingReactant: limitingReactant.formula,
    productFormula: product.formula,
    productMoles,
    theoreticalMassGrams,
    actualYieldGrams: actualYieldGrams ?? null,
    percentYield: actualYieldGrams === undefined
      ? null
      : (actualYieldGrams / theoreticalMassGrams) * 100,
    reactants,
  };
}
