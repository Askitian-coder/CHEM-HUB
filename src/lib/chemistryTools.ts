import { getElementBySymbol } from "../data/elements";
import { parseFormula } from "./formulaParser";

type ElementCounts = Map<string, number>;

interface ChemicalSpecies {
  formula: string;
  charge: number;
  counts: ElementCounts;
  coefficient: number;
}

export type SubstanceClassification = "Acid" | "Base" | "Salt" | "Neutral / other";

export interface OxidationNumber {
  symbol: string;
  name: string;
  value: number | null;
  note?: string;
}

function parseCharge(formula: string) {
  const caretCharge = formula.match(/\^(\d*)([+-])$/);
  if (caretCharge) {
    return {
      body: formula.slice(0, caretCharge.index),
      charge: (caretCharge[2] === "+" ? 1 : -1) * Number(caretCharge[1] || 1),
    };
  }

  const simpleCharge = formula.match(/([+-])$/);
  return simpleCharge
    ? {
        body: formula.slice(0, -1),
        charge: simpleCharge[1] === "+" ? 1 : -1,
      }
    : { body: formula, charge: 0 };
}

function countElements(formula: string): ElementCounts {
  const normalized = formula.replace(/[₀-₉]/g, (digit) => "₀₁₂₃₄₅₆₇₈₉".indexOf(digit).toString());
  const { body } = parseCharge(normalized);
  if (!body) throw new Error("Enter a chemical formula before the ionic charge.");
  const parsed = parseFormula(body);
  return new Map(parsed.map(({ symbol, count }) => [symbol, count]));
}

function parseSpecies(input: string): ChemicalSpecies {
  const coefficientMatch = input.trim().match(/^(\d+)\s*(.+)$/);
  const coefficient = coefficientMatch ? Number(coefficientMatch[1]) : 1;
  const formula = (coefficientMatch ? coefficientMatch[2] : input).trim();
  const { body, charge } = parseCharge(formula);
  if (!body) throw new Error("Enter a formula for each reaction species.");
  const counts = new Map(parseFormula(body).map(({ symbol, count }) => [symbol, count]));
  return { formula, charge, counts, coefficient };
}

function gcd(a: number, b: number): number {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

export function balanceRedoxEquation(equation: string): string {
  const arrowMatches = [...equation.matchAll(/->|→|⇌|=/g)];
  if (arrowMatches.length !== 1) {
    throw new Error("Enter one reaction arrow (→) between the reactants and products.");
  }

  const arrow = arrowMatches[0];
  const leftText = equation.slice(0, arrow.index).trim();
  const rightText = equation.slice(arrow.index! + arrow[0].length).trim();
  if (!leftText || !rightText) throw new Error("Add at least one reactant and one product.");

  const splitSide = (side: string) => side.split(/\s+\+\s+/).map(parseSpecies);
  const reactants = splitSide(leftText);
  const products = splitSide(rightText);
  const species = [...reactants, ...products];
  const elements = [...new Set(species.flatMap((item) => [...item.counts.keys()]))];
  const matrix = elements.map((symbol) =>
    species.map((item, index) => {
      const direction = index < reactants.length ? 1 : -1;
      return direction * (item.counts.get(symbol) ?? 0);
    }),
  );
  matrix.push(species.map((item, index) => (index < reactants.length ? item.charge : -item.charge)));

  const rows = matrix.map((row) => row.slice());
  const pivotColumns: number[] = [];
  let pivotRow = 0;
  for (let column = 0; column < species.length && pivotRow < rows.length; column += 1) {
    let bestRow = pivotRow;
    for (let row = pivotRow + 1; row < rows.length; row += 1) {
      if (Math.abs(rows[row][column]) > Math.abs(rows[bestRow][column])) bestRow = row;
    }
    if (Math.abs(rows[bestRow][column]) < 1e-10) continue;

    [rows[pivotRow], rows[bestRow]] = [rows[bestRow], rows[pivotRow]];
    const pivot = rows[pivotRow][column];
    for (let entry = column; entry < species.length; entry += 1) rows[pivotRow][entry] /= pivot;

    for (let row = 0; row < rows.length; row += 1) {
      if (row === pivotRow) continue;
      const factor = rows[row][column];
      for (let entry = column; entry < species.length; entry += 1) {
        rows[row][entry] -= factor * rows[pivotRow][entry];
      }
    }
    pivotColumns.push(column);
    pivotRow += 1;
  }

  const freeColumns = species.map((_, index) => index).filter((index) => !pivotColumns.includes(index));
  if (freeColumns.length !== 1) {
    throw new Error("This equation does not have one unique set of balance coefficients. Check the species and try a simpler reaction.");
  }

  const freeColumn = freeColumns[0];
  const coefficients = Array(species.length).fill(0);
  coefficients[freeColumn] = 1;
  pivotColumns.forEach((column, row) => {
    coefficients[column] = -rows[row][freeColumn];
  });

  if (coefficients.some((coefficient) => Math.abs(coefficient) < 1e-10)) {
    throw new Error("The entered species cannot all appear in a balanced reaction.");
  }
  if (coefficients.every((coefficient) => coefficient < 0)) {
    coefficients.forEach((coefficient, index) => {
      coefficients[index] = -coefficient;
    });
  }
  if (coefficients.some((coefficient) => coefficient <= 0)) {
    throw new Error("The entered reactants and products do not give positive balance coefficients.");
  }

  const scale = 1_000_000;
  let integers = coefficients.map((coefficient) => Math.round(coefficient * scale));
  const divisor = integers.reduce(gcd);
  integers = integers.map((coefficient) => coefficient / divisor);
  const formatSide = (side: ChemicalSpecies[], offset: number) =>
    side.map((item, index) => {
      const coefficient = integers[offset + index];
      return `${coefficient === 1 ? "" : coefficient}${item.formula}`;
    }).join(" + ");

  return `${formatSide(reactants, 0)} → ${formatSide(products, reactants.length)}`;
}

export function classifySubstance(formula: string): SubstanceClassification {
  const counts = countElements(formula);
  const symbols = [...counts.keys()];
  const normalized = formula.replace(/\s+/g, "").toLowerCase();
  const metals = symbols.filter((symbol) => {
    const category = getElementBySymbol(symbol)?.category;
    return category !== undefined && category !== "nonmetal" && category !== "halogen" &&
      category !== "noble-gas" && category !== "metalloid";
  });
  const hydrogenCount = counts.get("H") ?? 0;
  const oxygenCount = counts.get("O") ?? 0;
  const nonHydrogenOxygen = symbols.some((symbol) => symbol !== "H" && symbol !== "O");

  if (["h2o", "h2o2"].includes(normalized)) return "Neutral / other";
  if (
    normalized === "nh3" ||
    normalized === "nh4oh" ||
    (metals.length > 0 && hydrogenCount > 0 && oxygenCount === hydrogenCount &&
      symbols.every((symbol) => symbol === "H" || symbol === "O" || metals.includes(symbol)))
  ) {
    return "Base";
  }

  const knownAcid = /^(hcl|hbr|hi|hf|hno2|hno3|h2so3|h2so4|h2co3|h3po3|h3po4|h2s|ch3cooh)$/i.test(normalized);
  if (knownAcid || (normalized.startsWith("h") && nonHydrogenOxygen && metals.length === 0)) {
    return "Acid";
  }

  const hasAmmonium = normalized.startsWith("nh4");
  if (
    (metals.length > 0 || hasAmmonium) &&
    symbols.some((symbol) => symbol !== "O" && symbol !== "H" && !metals.includes(symbol))
  ) {
    return "Salt";
  }

  return "Neutral / other";
}

export function determineOxidationNumbers(formula: string): OxidationNumber[] {
  const normalized = formula.replace(/[₀-₉]/g, (digit) => "₀₁₂₃₄₅₆₇₈₉".indexOf(digit).toString());
  const { charge } = parseCharge(normalized);
  const counts = countElements(formula);
  const symbols = [...counts.keys()];
  const values = new Map<string, number>();

  if (symbols.length === 1) {
    const symbol = symbols[0];
    return [{
      symbol,
      name: getElementBySymbol(symbol)?.name ?? symbol,
      value: 0,
      note: "An element in its uncombined form has oxidation number 0.",
    }];
  }

  const peroxide = /^(h2o2|li2o2|na2o2|k2o2|bao2)$/i.test(normalized);
  symbols.forEach((symbol) => {
    const element = getElementBySymbol(symbol);
    if (!element) return;
    if (symbol === "F") values.set(symbol, -1);
    else if (symbol === "O") values.set(symbol, peroxide ? -1 : -2);
    else if (symbol === "H") {
      const hasMetal = symbols.some((other) => {
        const category = getElementBySymbol(other)?.category;
        return category !== undefined && !["nonmetal", "halogen", "noble-gas", "metalloid"].includes(category);
      });
      values.set(symbol, hasMetal ? -1 : 1);
    } else if (element.category === "alkali-metal") values.set(symbol, 1);
    else if (element.category === "alkaline-earth-metal") values.set(symbol, 2);
  });

  const unknown = symbols.filter((symbol) => !values.has(symbol));
  const unresolvedNotes = new Map<string, string>();
  const knownSum = symbols.reduce(
    (sum, symbol) => sum + (values.get(symbol) ?? 0) * (counts.get(symbol) ?? 0),
    0,
  );
  if (unknown.length === 1) {
    const symbol = unknown[0];
    const solved = (charge - knownSum) / (counts.get(symbol) ?? 1);
    if (Math.abs(solved - Math.round(solved)) < 1e-8) {
      values.set(symbol, Math.round(solved));
    } else {
      unresolvedNotes.set(
        symbol,
        `The average is ${Number(solved.toFixed(2))}; this formula may contain mixed oxidation states.`,
      );
    }
  }

  return symbols.map((symbol) => {
    const value = values.get(symbol);
    return {
      symbol,
      name: getElementBySymbol(symbol)?.name ?? symbol,
      value: value === undefined ? null : Number(value.toFixed(2)),
      ...(value === undefined
        ? { note: unresolvedNotes.get(symbol) ?? "Cannot be determined from the usual rules alone for this formula." }
        : {}),
    };
  });
}
