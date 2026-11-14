import { useState } from "react";
import ToolPage from "../components/ToolPage";
import { convertMoles, type MoleConversionResult, type MoleInputUnit } from "../lib/moleConverter";

const examples = [
  { formula: "H2O", amount: "36", unit: "g" as const },
  { formula: "CO2", amount: "2", unit: "mol" as const },
  { formula: "Ca(OH)2", amount: "6.022e23", unit: "particles" as const },
];

const formatNumber = (value: number) =>
  value !== 0 && (Math.abs(value) < 0.000001 || Math.abs(value) >= 1_000_000_000)
    ? value.toExponential(4)
    : value.toLocaleString(undefined, { maximumSignificantDigits: 6 });

export default function MoleConverterPage() {
  const [formula, setFormula] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<MoleInputUnit>("g");
  const [result, setResult] = useState<MoleConversionResult | null>(null);
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setResult(convertMoles(formula, amount, unit));
      setError("");
    } catch (issue) {
      setResult(null);
      setError(issue instanceof Error ? issue.message : "Unable to convert this amount.");
    }
  };

  const chooseExample = (example: typeof examples[number]) => {
    setFormula(example.formula);
    setAmount(example.amount);
    setUnit(example.unit);
    try {
      setResult(convertMoles(example.formula, example.amount, example.unit));
      setError("");
    } catch (issue) {
      setResult(null);
      setError(issue instanceof Error ? issue.message : "Unable to convert this amount.");
    }
  };

  return (
    <ToolPage
      eyebrow="Chemistry calculator"
      title="Mole Converter"
      description="Convert between grams, moles, and particles. See the molar mass and the working behind each result."
      showBackLink
    >
      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold text-slate-700">Try an example</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              type="button"
              key={example.formula}
              onClick={() => chooseExample(example)}
              className="min-h-11 rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
            >
              {example.amount} {example.unit} {example.formula}
            </button>
          ))}
        </div>
      </div>
      <label htmlFor="mole-formula" className="mb-2 block text-sm font-semibold text-slate-700">Compound formula</label>
      <input
        id="mole-formula"
        value={formula}
        onChange={(event) => setFormula(event.target.value)}
        onKeyDown={(event) => { if (event.key === "Enter") convert(); }}
        placeholder="e.g. H2O, CO2, Ca(OH)2"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      />
      <p className="mt-2 text-xs leading-5 text-slate-500">Supports parentheses, square brackets, hydrates, and Unicode subscripts.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr]">
        <div>
          <label htmlFor="mole-amount" className="mb-2 block text-sm font-semibold text-slate-700">Amount</label>
          <input
            id="mole-amount"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") convert(); }}
            placeholder="e.g. 36"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
        <div>
          <label htmlFor="mole-unit" className="mb-2 block text-sm font-semibold text-slate-700">Starting unit</label>
          <select
            id="mole-unit"
            value={unit}
            onChange={(event) => setUnit(event.target.value as MoleInputUnit)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="g">Grams (g)</option>
            <option value="mol">Moles (mol)</option>
            <option value="particles">Particles (molecules or formula units)</option>
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={convert}
        className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        Convert
      </button>

      {error && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
      {result ? (
        <section className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5" aria-live="polite">
          <h2 className="text-lg font-bold text-indigo-800">Conversion results</h2>
          <p className="mt-1 text-sm text-slate-600">Molar mass of {result.formula}: {formatNumber(result.molarMass)} g/mol</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-3"><dt className="text-sm text-slate-500">Mass</dt><dd className="mt-1 break-words font-bold text-slate-900">{formatNumber(result.grams)} g</dd></div>
            <div className="rounded-lg bg-white p-3"><dt className="text-sm text-slate-500">Amount</dt><dd className="mt-1 break-words font-bold text-slate-900">{formatNumber(result.moles)} mol</dd></div>
            <div className="rounded-lg bg-white p-3"><dt className="text-sm text-slate-500">Particles</dt><dd className="mt-1 break-words font-bold text-slate-900">{result.particles.toExponential(4)}</dd></div>
          </dl>
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-600">
            <li>Molar mass = {formatNumber(result.molarMass)} g/mol.</li>
            <li>{result.unit === "g" ? "Moles = mass ÷ molar mass" : result.unit === "mol" ? "Mass = moles × molar mass" : "Moles = particles ÷ Avogadro’s number"}.</li>
            <li>One mole contains 6.022 × 10²³ particles.</li>
          </ol>
        </section>
      ) : (
        !error && <p className="mt-5 text-sm text-slate-500">Enter a formula and amount, or choose an example, to get started.</p>
      )}
    </ToolPage>
  );
}
