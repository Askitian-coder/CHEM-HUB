export type DilutionVariable = "c1" | "v1" | "c2" | "v2";

export interface DilutionInputs {
  c1: number | null;
  v1: number | null;
  c2: number | null;
  v2: number | null;
}

export function calculateMolarity(moles: number, volumeLitres: number): number {
  if (!Number.isFinite(moles) || moles < 0) {
    throw new Error("Amount of solute must be a non-negative number of moles.");
  }
  if (!Number.isFinite(volumeLitres) || volumeLitres <= 0) {
    throw new Error("Solution volume must be greater than zero litres.");
  }
  return moles / volumeLitres;
}

export function calculateMassConcentration(
  massGrams: number,
  volumeLitres: number,
): number {
  if (!Number.isFinite(massGrams) || massGrams < 0) {
    throw new Error("Solute mass must be a non-negative number of grams.");
  }
  if (!Number.isFinite(volumeLitres) || volumeLitres <= 0) {
    throw new Error("Solution volume must be greater than zero litres.");
  }
  return massGrams / volumeLitres;
}

export function solveDilution(
  inputs: DilutionInputs,
  missing: DilutionVariable,
): number {
  const { c1, v1, c2, v2 } = inputs;
  const known = (value: number | null): number => {
    if (value === null || !Number.isFinite(value) || value < 0) {
      throw new Error("Enter non-negative values for the other three quantities.");
    }
    return value;
  };

  let answer: number;
  switch (missing) {
    case "c1": {
      const initialVolume = known(v1);
      if (initialVolume === 0) throw new Error("Initial volume must be greater than zero.");
      answer = (known(c2) * known(v2)) / initialVolume;
      break;
    }
    case "v1": {
      const initialConcentration = known(c1);
      if (initialConcentration === 0) throw new Error("Initial concentration must be greater than zero.");
      answer = (known(c2) * known(v2)) / initialConcentration;
      break;
    }
    case "c2": {
      const finalVolume = known(v2);
      if (finalVolume === 0) throw new Error("Final volume must be greater than zero.");
      answer = (known(c1) * known(v1)) / finalVolume;
      break;
    }
    case "v2": {
      const finalConcentration = known(c2);
      if (finalConcentration === 0) throw new Error("Final concentration must be greater than zero.");
      answer = (known(c1) * known(v1)) / finalConcentration;
      break;
    }
  }

  if (!Number.isFinite(answer) || answer < 0) {
    throw new Error("These values do not produce a valid dilution result.");
  }
  if ((missing === "v1" || missing === "v2") && answer === 0) {
    throw new Error("Calculated volume must be greater than zero.");
  }
  return answer;
}
