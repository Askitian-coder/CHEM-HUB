import { computeMolarMass } from "./formulaParser";

type LinearDimension = "amount" | "mass" | "pressure" | "volume" | "energy";
type UnitDefinition =
  | { dimension: LinearDimension; factor: number }
  | { dimension: "temperature" };

export type UnitId =
  | "mol"
  | "mmol"
  | "kmol"
  | "mg"
  | "g"
  | "kg"
  | "celsius"
  | "fahrenheit"
  | "kelvin"
  | "pa"
  | "kpa"
  | "atm"
  | "mmhg"
  | "ml"
  | "l"
  | "m3"
  | "j"
  | "kj"
  | "cal"
  | "kcal";

export const unitLabels: Record<UnitId, string> = {
  mol: "mol",
  mmol: "mmol",
  kmol: "kmol",
  mg: "mg",
  g: "g",
  kg: "kg",
  celsius: "°C",
  fahrenheit: "°F",
  kelvin: "K",
  pa: "Pa",
  kpa: "kPa",
  atm: "atm",
  mmhg: "mmHg",
  ml: "mL",
  l: "L",
  m3: "m³",
  j: "J",
  kj: "kJ",
  cal: "cal",
  kcal: "kcal",
};

const definitions: Record<UnitId, UnitDefinition> = {
  mol: { dimension: "amount", factor: 1 },
  mmol: { dimension: "amount", factor: 0.001 },
  kmol: { dimension: "amount", factor: 1000 },
  mg: { dimension: "mass", factor: 0.001 },
  g: { dimension: "mass", factor: 1 },
  kg: { dimension: "mass", factor: 1000 },
  celsius: { dimension: "temperature" },
  fahrenheit: { dimension: "temperature" },
  kelvin: { dimension: "temperature" },
  pa: { dimension: "pressure", factor: 0.001 },
  kpa: { dimension: "pressure", factor: 1 },
  atm: { dimension: "pressure", factor: 101.325 },
  mmhg: { dimension: "pressure", factor: 101.325 / 760 },
  ml: { dimension: "volume", factor: 0.001 },
  l: { dimension: "volume", factor: 1 },
  m3: { dimension: "volume", factor: 1000 },
  j: { dimension: "energy", factor: 1 },
  kj: { dimension: "energy", factor: 1000 },
  cal: { dimension: "energy", factor: 4.184 },
  kcal: { dimension: "energy", factor: 4184 },
};

function toBaseTemperature(value: number, unit: UnitId): number {
  if (unit === "celsius") return value + 273.15;
  if (unit === "fahrenheit") return (value - 32) * (5 / 9) + 273.15;
  return value;
}

function fromBaseTemperature(kelvin: number, unit: UnitId): number {
  if (unit === "celsius") return kelvin - 273.15;
  if (unit === "fahrenheit") return (kelvin - 273.15) * (9 / 5) + 32;
  return kelvin;
}

export function convertUnit(
  value: number,
  from: UnitId,
  to: UnitId,
  formula?: string,
): number {
  if (!Number.isFinite(value)) throw new Error("Enter a valid number to convert.");

  const source = definitions[from];
  const destination = definitions[to];
  if (!source || !destination) throw new Error("Choose supported units.");

  if (source.dimension === "temperature" && destination.dimension === "temperature") {
    const kelvin = toBaseTemperature(value, from);
    if (kelvin < 0) throw new Error("Temperature cannot be below absolute zero (0 K).");
    return fromBaseTemperature(kelvin, to);
  }

  const relatedAmountAndMass =
    (source.dimension === "amount" && destination.dimension === "mass") ||
    (source.dimension === "mass" && destination.dimension === "amount");

  if (relatedAmountAndMass) {
    if (!formula?.trim()) {
      throw new Error("Enter a chemical formula to convert between moles and mass.");
    }

    const molarMass = computeMolarMass(formula);
    if (source.dimension === "amount" && destination.dimension === "mass") {
      const moles = value * source.factor;
      return (moles * molarMass) / destination.factor;
    }

    if (source.dimension === "mass" && destination.dimension === "amount") {
      const grams = value * source.factor;
      return (grams / molarMass) / destination.factor;
    }
  }

  if (source.dimension !== destination.dimension) {
    throw new Error("Those units measure different quantities.");
  }
  if (!("factor" in source) || !("factor" in destination)) {
    throw new Error("Those units cannot be converted.");
  }

  if (value < 0 && source.dimension !== "energy") {
    throw new Error("This quantity cannot be negative.");
  }

  return (value * source.factor) / destination.factor;
}
