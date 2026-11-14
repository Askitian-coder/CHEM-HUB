import { computeMolarMass } from "./formulaParser";

export type MoleInputUnit = "g" | "mol" | "particles";

export interface MoleConversionResult {
  amount: number;
  unit: MoleInputUnit;
  formula: string;
  molarMass: number;
  moles: number;
  grams: number;
  particles: number;
}

const AVOGADRO = 6.02214076e23;

export function convertMoles(
  formula: string,
  rawAmount: string,
  unit: MoleInputUnit,
): MoleConversionResult {
  const amountText = rawAmount.trim();
  const amount = Number(amountText);
  if (!amountText || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a positive amount.");
  }
  if (unit === "particles" && !Number.isInteger(amount)) {
    throw new Error("Enter a whole number of particles.");
  }

  const molarMass = computeMolarMass(formula);
  const moles = unit === "g"
    ? amount / molarMass
    : unit === "mol"
      ? amount
      : amount / AVOGADRO;
  const grams = moles * molarMass;
  const particles = moles * AVOGADRO;
  if (moles === 0 || grams === 0 || particles === 0) {
    throw new Error("That amount is too small to convert accurately.");
  }
  if (![moles, grams, particles].every(Number.isFinite)) {
    throw new Error("That amount is too large to convert.");
  }

  return { amount, unit, formula: formula.trim(), molarMass, moles, grams, particles };
}
