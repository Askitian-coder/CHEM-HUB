import { useMemo, useState } from "react";
import ToolPage from "../components/ToolPage";
import {
  convertUnit,
  unitLabels,
  type UnitId,
} from "../lib/unitConversions";

type ConversionCategory =
  | "amount"
  | "mass"
  | "amount-mass"
  | "temperature"
  | "pressure"
  | "volume"
  | "energy";

interface CategoryOption {
  id: ConversionCategory;
  label: string;
  units: UnitId[];
  from: UnitId;
  to: UnitId;
}

const categories: CategoryOption[] = [
  { id: "amount", label: "Amount", units: ["mol", "mmol", "kmol"], from: "mol", to: "mmol" },
  { id: "mass", label: "Mass", units: ["mg", "g", "kg"], from: "g", to: "mg" },
  {
    id: "amount-mass",
    label: "Moles ↔ mass",
    units: ["mol", "mmol", "kmol", "mg", "g", "kg"],
    from: "mol",
    to: "g",
  },
  {
    id: "temperature",
    label: "Temperature",
    units: ["celsius", "fahrenheit", "kelvin"],
    from: "celsius",
    to: "kelvin",
  },
  { id: "pressure", label: "Pressure", units: ["pa", "kpa", "atm", "mmhg"], from: "atm", to: "kpa" },
  { id: "volume", label: "Volume", units: ["ml", "l", "m3"], from: "ml", to: "l" },
  { id: "energy", label: "Energy", units: ["j", "kj", "cal", "kcal"], from: "kj", to: "j" },
];

export default function UnitConverterPage() {
  const [category, setCategory] = useState<ConversionCategory>("amount");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState<UnitId>("mol");
  const [to, setTo] = useState<UnitId>("mmol");
  const [formula, setFormula] = useState("");

  const selectedCategory = categories.find((option) => option.id === category)!;
  const conversion = useMemo(() => {
    if (!value.trim()) return null;
    const amountUnits: UnitId[] = ["mol", "mmol", "kmol"];
    const massUnits: UnitId[] = ["mg", "g", "kg"];
    const needsFormula =
      (amountUnits.includes(from) && massUnits.includes(to)) ||
      (massUnits.includes(from) && amountUnits.includes(to));
    if (needsFormula && !formula.trim()) return { result: null, error: "" };
    try {
      const result = convertUnit(Number(value), from, to, formula);
      return { result, error: "" };
    } catch (issue) {
      return {
        result: null,
        error: issue instanceof Error ? issue.message : "Could not convert these units.",
      };
    }
  }, [formula, from, to, value]);

  const changeCategory = (nextCategory: ConversionCategory) => {
    const option = categories.find((item) => item.id === nextCategory)!;
    setCategory(nextCategory);
    setFrom(option.from);
    setTo(option.to);
  };

  const formattedResult = conversion?.result === null || conversion?.result === undefined
    ? ""
    : Number(conversion.result.toPrecision(7)).toLocaleString(undefined, {
        maximumSignificantDigits: 7,
      });

  return (
    <ToolPage
      eyebrow="Measurement helper"
      title="Unit Converter"
      description="Convert common chemistry measurements, including moles and mass when you know the substance."
    >
      <label htmlFor="conversion-category" className="mb-2 block text-sm font-semibold text-slate-700">
        What are you converting?
      </label>
      <select
        id="conversion-category"
        value={category}
        onChange={(event) => changeCategory(event.target.value as ConversionCategory)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      >
        {categories.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <label htmlFor="conversion-value" className="mb-2 block text-sm font-semibold text-slate-700">
            Starting value
          </label>
          <div className="flex gap-2">
            <input
              id="conversion-value"
              type="number"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
            <select
              aria-label="Starting unit"
              value={from}
              onChange={(event) => setFrom(event.target.value as UnitId)}
              className="w-24 rounded-xl border border-slate-300 bg-white px-2 py-3 outline-none focus:border-indigo-500 sm:w-28"
            >
              {selectedCategory.units.map((unit) => (
                <option key={unit} value={unit}>{unitLabels[unit]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden pb-3 text-center text-slate-400 sm:block" aria-hidden="true">→</div>

        <div>
          <label htmlFor="conversion-target" className="mb-2 block text-sm font-semibold text-slate-700">
            Convert to
          </label>
          <select
            id="conversion-target"
            value={to}
            onChange={(event) => setTo(event.target.value as UnitId)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          >
            {selectedCategory.units.map((unit) => (
              <option key={unit} value={unit}>{unitLabels[unit]}</option>
            ))}
          </select>
        </div>
      </div>

      {category === "amount-mass" && (
        <div className="mt-5">
          <label htmlFor="conversion-formula" className="mb-2 block text-sm font-semibold text-slate-700">
            Chemical formula
          </label>
          <input
            id="conversion-formula"
            value={formula}
            onChange={(event) => setFormula(event.target.value)}
            placeholder="e.g. H2O"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
          <p className="mt-2 text-xs text-slate-500">
            Moles and grams are related by molar mass. The formula tells us how many grams are in one mole.
          </p>
        </div>
      )}

      {conversion?.error ? (
        <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {conversion.error}
        </p>
      ) : conversion?.result !== null && conversion?.result !== undefined ? (
        <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-5" aria-live="polite">
          <p className="text-sm font-semibold text-indigo-700">Converted value</p>
          <p className="mt-1 break-words text-3xl font-extrabold text-slate-900">
            {formattedResult} <span className="text-xl text-slate-600">{unitLabels[to]}</span>
          </p>
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-500">
          {category === "amount-mass" && !formula.trim()
            ? "Enter a chemical formula to use its molar mass for this conversion."
            : "Enter a number to see the conversion."}
        </p>
      )}

      <aside className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
        Temperature conversions use kelvin as the absolute scale. For a mass-to-moles conversion, divide the mass by the substance's molar mass; for moles-to-mass, multiply.
      </aside>
    </ToolPage>
  );
}
