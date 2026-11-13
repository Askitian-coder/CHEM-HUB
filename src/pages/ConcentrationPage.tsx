import { useState } from "react";
import ToolPage from "../components/ToolPage";
import {
  calculateMassConcentration,
  calculateMolarity,
  solveDilution,
  type DilutionInputs,
  type DilutionVariable,
} from "../lib/concentrationCalculator";

type Mode = "molarity" | "mass" | "dilution";

const modeLabels: Record<Mode, string> = {
  molarity: "Molarity",
  mass: "Mass concentration",
  dilution: "Dilution",
};

function readNonNegative(value: string, label: string): number {
  const number = Number(value);
  if (!value.trim() || !Number.isFinite(number) || number < 0) {
    throw new Error(`${label} must be a non-negative number.`);
  }
  return number;
}

export default function ConcentrationPage() {
  const [mode, setMode] = useState<Mode>("molarity");
  const [moles, setMoles] = useState("0.5");
  const [molarityVolume, setMolarityVolume] = useState("250");
  const [massGrams, setMassGrams] = useState("5");
  const [massVolume, setMassVolume] = useState("500");
  const [missing, setMissing] = useState<DilutionVariable>("v2");
  const [dilution, setDilution] = useState<Record<DilutionVariable, string>>({
    c1: "2",
    v1: "100",
    c2: "0.5",
    v2: "",
  });
  const [result, setResult] = useState<{ value: number; unit: string; steps: string } | null>(null);
  const [error, setError] = useState("");

  const clearResult = () => {
    setResult(null);
    setError("");
  };

  const changeMode = (next: Mode) => {
    setMode(next);
    clearResult();
  };

  const calculate = () => {
    try {
      if (mode === "molarity") {
        const amount = readNonNegative(moles, "Amount of solute");
        const volumeMl = readNonNegative(molarityVolume, "Solution volume");
        const value = calculateMolarity(amount, volumeMl / 1000);
        setResult({
          value,
          unit: "mol/L",
          steps: `${amount} mol ÷ ${(volumeMl / 1000).toPrecision(4)} L = ${value.toPrecision(4)} mol/L`,
        });
      } else if (mode === "mass") {
        const mass = readNonNegative(massGrams, "Solute mass");
        const volumeMl = readNonNegative(massVolume, "Solution volume");
        const value = calculateMassConcentration(mass, volumeMl / 1000);
        setResult({
          value,
          unit: "g/L",
          steps: `${mass} g ÷ ${(volumeMl / 1000).toPrecision(4)} L = ${value.toPrecision(4)} g/L`,
        });
      } else {
        const inputs = (Object.keys(dilution) as DilutionVariable[]).reduce(
          (values, variable) => {
            values[variable] = variable === missing || !dilution[variable].trim()
              ? null
              : Number(dilution[variable]);
            return values;
          },
          {} as DilutionInputs,
        );
        const value = solveDilution(inputs, missing);
        const unit = missing === "v1" || missing === "v2" ? "mL" : "mol/L";
        setDilution((current) => ({ ...current, [missing]: String(value) }));
        setResult({
          value,
          unit,
          steps: `Using C₁V₁ = C₂V₂, the missing ${missing.toUpperCase()} is ${value.toPrecision(5)} ${unit}.`,
        });
      }
      setError("");
    } catch (issue) {
      setResult(null);
      setError(issue instanceof Error ? issue.message : "Could not calculate the concentration.");
    }
  };

  const dilutionLabels: Record<DilutionVariable, string> = {
    c1: "Starting concentration C₁ (mol/L)",
    v1: "Starting volume V₁ (mL)",
    c2: "Final concentration C₂ (mol/L)",
    v2: "Final volume V₂ (mL)",
  };

  return (
    <ToolPage
      eyebrow="Solution calculator"
      title="Concentration Calculator"
      description="Find molarity, mass concentration, or a missing value in a dilution."
    >
      <div className="flex flex-wrap gap-2" aria-label="Concentration calculation type">
        {(Object.keys(modeLabels) as Mode[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={mode === option}
            onClick={() => changeMode(option)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === option
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {modeLabels[option]}
          </button>
        ))}
      </div>

      {mode === "molarity" && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="moles" className="mb-2 block text-sm font-semibold text-slate-700">Solute amount (mol)</label>
            <input id="moles" type="number" min="0" value={moles} onChange={(event) => { setMoles(event.target.value); clearResult(); }} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="molarity-volume" className="mb-2 block text-sm font-semibold text-slate-700">Solution volume (mL)</label>
            <input id="molarity-volume" type="number" min="0" value={molarityVolume} onChange={(event) => { setMolarityVolume(event.target.value); clearResult(); }} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
        </div>
      )}

      {mode === "mass" && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="solute-mass" className="mb-2 block text-sm font-semibold text-slate-700">Solute mass (g)</label>
            <input id="solute-mass" type="number" min="0" value={massGrams} onChange={(event) => { setMassGrams(event.target.value); clearResult(); }} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="mass-volume" className="mb-2 block text-sm font-semibold text-slate-700">Solution volume (mL)</label>
            <input id="mass-volume" type="number" min="0" value={massVolume} onChange={(event) => { setMassVolume(event.target.value); clearResult(); }} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
        </div>
      )}

      {mode === "dilution" && (
        <>
          <label htmlFor="dilution-unknown" className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
            Choose the value to calculate
          </label>
          <select
            id="dilution-unknown"
            value={missing}
            onChange={(event) => {
              const next = event.target.value as DilutionVariable;
              setMissing(next);
              setDilution((current) => ({ ...current, [next]: "" }));
              clearResult();
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            {(Object.keys(dilutionLabels) as DilutionVariable[]).map((variable) => (
              <option key={variable} value={variable}>{dilutionLabels[variable]}</option>
            ))}
          </select>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(Object.keys(dilutionLabels) as DilutionVariable[]).map((variable) => (
              <div key={variable}>
                <label htmlFor={`dilution-${variable}`} className="mb-2 block text-sm font-semibold text-slate-700">
                  {dilutionLabels[variable]}
                </label>
                <input
                  id={`dilution-${variable}`}
                  type="number"
                  min="0"
                  value={dilution[variable]}
                  readOnly={variable === missing}
                  onChange={(event) => {
                    setDilution((current) => ({ ...current, [variable]: event.target.value }));
                    clearResult();
                  }}
                  placeholder={variable === missing ? "Calculated" : "Enter value"}
                  className={`w-full rounded-xl border border-slate-300 px-4 py-3 ${variable === missing ? "bg-slate-50 text-indigo-700" : ""}`}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Keep the two volume units the same. This example uses millilitres for both volumes.
          </p>
        </>
      )}

      <button type="button" onClick={calculate} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
        Calculate
      </button>
      {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
      {result && (
        <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-5" aria-live="polite">
          <p className="text-sm font-semibold text-indigo-700">Result</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">
            {result.value.toPrecision(5)} <span className="text-xl text-slate-600">{result.unit}</span>
          </p>
          <p className="mt-3 break-words font-mono text-sm text-slate-700">{result.steps}</p>
        </div>
      )}
      <aside className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
        Molarity is moles of solute per litre of solution. In a dilution, adding solvent does not change the moles of solute, so C₁V₁ = C₂V₂.
      </aside>
    </ToolPage>
  );
}
