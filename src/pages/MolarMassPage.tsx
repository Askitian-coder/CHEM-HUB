import { useEffect, useMemo, useState } from "react";
import { computeMolarMass, parseFormula } from "../lib/formulaParser";
import { getElementBySymbol } from "../data/elements";

const examples = [
  { label: "H₂O", formula: "H2O" },
  { label: "H₂SO₄", formula: "H2SO4" },
  { label: "(NH₄)₂SO₄", formula: "(NH4)2SO4" },
  { label: "Ca(OH)₂", formula: "Ca(OH)2" },
  { label: "CuSO₄·5H₂O", formula: "CuSO4·5H2O" },
  { label: "C₆H₁₂O₆", formula: "C6H12O6" },
];

const toSubscript = (formula: string) =>
  formula.replace(/\d/g, (digit) => "₀₁₂₃₄₅₆₇₈₉"[Number(digit)]);

export default function MolarMassPage() {
  const [formula, setFormula] = useState("");
  const [validation, setValidation] = useState<{ error: string | null; ready: boolean; formula: string }>({
    error: null,
    ready: false,
    formula: "",
  });
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  useEffect(() => {
    if (!formula.trim()) {
      setValidation({ error: null, ready: false, formula });
      return;
    }
    const timeout = window.setTimeout(() => {
      try {
        parseFormula(formula);
        setValidation({ error: null, ready: true, formula });
      } catch (error) {
        setValidation({
          error: error instanceof Error ? error.message : "Unable to parse this formula.",
          ready: true,
          formula,
        });
      }
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [formula]);

  const parsed = useMemo(() => {
    if (validation.formula !== formula || !validation.ready || validation.error || !formula.trim()) return null;
    return parseFormula(formula);
  }, [formula, validation]);
  const molarMass = useMemo(() => {
    if (!parsed) return null;
    return computeMolarMass(formula);
  }, [formula, parsed]);

  const copyMass = async () => {
    if (molarMass === null) return;
    try {
      await navigator.clipboard.writeText(`${molarMass.toFixed(2)} g/mol`);
      setCopied(true);
      setCopyError("");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError("Clipboard access isn't available in this browser.");
    }
  };
  const changeFormula = (value: string) => {
    setFormula(value);
    setValidation({ error: null, ready: false, formula: value });
  };

  const inputStyle = !formula || !validation.ready
    ? "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
    : validation.error
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
      : "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500";

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">Chemistry calculator</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Molar Mass Calculator</h1>
        <p className="mt-3 text-slate-600">Calculate the molar mass of any chemical formula, with step-by-step working.</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold text-slate-900">Examples</h2>
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  type="button"
                  key={example.formula}
                  onClick={() => changeFormula(example.formula)}
                  className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
          <label htmlFor="formula" className="mb-2 block text-sm font-semibold text-slate-700">Chemical formula</label>
          <input
            id="formula"
            value={formula}
            onChange={(event) => changeFormula(event.target.value)}
            placeholder="Enter a formula — e.g. H2O, (NH4)2SO4, CuSO4·5H2O"
            className={`w-full rounded-xl border-2 px-4 py-3 text-base outline-none ring-indigo-500/10 transition focus:ring-4 ${inputStyle}`}
            aria-invalid={Boolean(validation.error)}
            aria-describedby="formula-help formula-validation formula-preview"
          />
          <p id="formula-help" className="mt-2 text-xs leading-5 text-slate-500">
            Supports parentheses, square brackets, hydrate dot (·), and Unicode subscripts.
          </p>
          <p id="formula-validation" aria-live="polite" className={`mt-2 min-h-5 text-sm ${validation.error ? "text-rose-600" : "text-slate-500"}`}>
            {validation.error ?? (validation.ready && formula ? "Formula looks good." : "")}
          </p>
          {formula && <p id="formula-preview" className="mt-1 text-xl font-semibold text-indigo-700">{toSubscript(formula)}</p>}
        </div>
      </div>

      {molarMass !== null && parsed ? (
        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-indigo-600 p-6 text-white shadow-md sm:p-8">
            <div>
              <p className="text-sm font-medium text-indigo-100">Molar mass of {toSubscript(formula)}</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
                {molarMass.toFixed(2)} <span className="text-xl font-semibold text-indigo-100">g/mol</span>
              </p>
            </div>
            <button type="button" onClick={copyMass} className="rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/25">
              {copied ? "Copied!" : "Copy result"}
            </button>
            {copyError && <p className="w-full text-sm text-indigo-100" role="status">{copyError}</p>}
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-slate-900">Step-by-step breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-3 font-semibold sm:px-5">Element</th>
                    <th className="px-3 py-3 font-semibold sm:px-5">Atoms per formula</th>
                    <th className="px-3 py-3 font-semibold sm:px-5">Atomic mass (g/mol)</th>
                    <th className="px-3 py-3 font-semibold sm:px-5">Subtotal (g/mol)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsed.map(({ symbol, count }) => {
                    const element = getElementBySymbol(symbol);
                    if (!element) return null;
                    return (
                      <tr key={symbol}>
                        <td className="px-3 py-3 font-semibold text-slate-900 sm:px-5">{element.name} ({symbol})</td>
                        <td className="px-3 py-3 text-slate-600 sm:px-5">{count}</td>
                        <td className="px-3 py-3 text-slate-600 sm:px-5">{element.atomicMass.toFixed(3)}</td>
                        <td className="px-3 py-3 text-slate-600 sm:px-5">{(count * element.atomicMass).toFixed(3)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900">
                  <tr>
                    <td className="px-3 py-3 sm:px-5" colSpan={3}>Total</td>
                    <td className="px-3 py-3 sm:px-5">{molarMass.toFixed(2)} g/mol</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : (
        !formula && <p className="mt-6 rounded-xl border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500">Type a chemical formula or pick an example to get started.</p>
      )}

      <aside className="mt-8 rounded-2xl bg-slate-100 p-5 text-sm leading-6 text-slate-600">
        <h2 className="font-bold text-slate-800">What is molar mass?</h2>
        <p className="mt-2">Molar mass is the mass of one mole of a substance, measured in grams per mole (g/mol). To calculate it, add the atomic masses of every element, multiplying each one by how many atoms the formula contains. The breakdown above shows each contribution.</p>
      </aside>
    </section>
  );
}
