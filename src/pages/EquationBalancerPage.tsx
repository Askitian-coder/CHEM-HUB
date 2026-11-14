import { useState } from "react";
import ToolPage from "../components/ToolPage";
import { parseFormula } from "../lib/formulaParser";
import { balanceRedoxEquation } from "../lib/chemistryTools";

const examples = [
  "H2 + O2 -> H2O",
  "Fe + O2 -> Fe2O3",
  "C3H8 + O2 -> CO2 + H2O",
  "Al + HCl -> AlCl3 + H2",
  "Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O",
];

interface AtomRow {
  symbol: string;
  left: number;
  right: number;
}

function stripCharge(formula: string): string {
  return formula.replace(/\^\d*[+-]$/, "").replace(/[+-]$/, "");
}

function getAtomRows(equation: string): AtomRow[] {
  const [leftSide, rightSide] = equation.split(" → ");
  const parseSide = (side: string) => side.split(/\s+\+\s+/).map((species) => {
    const match = species.trim().match(/^(\d+)?\s*(.+)$/);
    if (!match) throw new Error("Unable to read the balanced equation.");
    return { coefficient: Number(match[1] ?? 1), atoms: parseFormula(stripCharge(match[2])) };
  });
  const left = parseSide(leftSide);
  const right = parseSide(rightSide);
  const elements = new Set([...left, ...right].flatMap(({ atoms }) => atoms.map(({ symbol }) => symbol)));
  return [...elements].map((symbol) => ({
    symbol,
    left: left.reduce((total, species) =>
      total + species.coefficient * (species.atoms.find((atom) => atom.symbol === symbol)?.count ?? 0), 0),
    right: right.reduce((total, species) =>
      total + species.coefficient * (species.atoms.find((atom) => atom.symbol === symbol)?.count ?? 0), 0),
  }));
}

const normalizeSeparators = (value: string) =>
  value.replace(/(?<=[A-Za-z0-9)\]])\+(?=[A-Z(\[])/g, " + ");

export default function EquationBalancerPage() {
  const [equation, setEquation] = useState("");
  const [balancedEquation, setBalancedEquation] = useState("");
  const [atomRows, setAtomRows] = useState<AtomRow[]>([]);
  const [error, setError] = useState("");

  const balance = (value = equation) => {
    setEquation(value);
    try {
      if (!value.trim()) throw new Error("Type an equation first.");
      const balanced = balanceRedoxEquation(normalizeSeparators(value));
      setBalancedEquation(balanced);
      setAtomRows(getAtomRows(balanced));
      setError("");
    } catch (issue) {
      setBalancedEquation("");
      setAtomRows([]);
      setError(issue instanceof Error ? issue.message : "Unable to balance this equation.");
    }
  };

  return (
    <ToolPage
      eyebrow="Chemistry calculator"
      title="Chemical Equation Balancer"
      description="Enter an unbalanced equation to find the smallest whole-number coefficients and check the atom counts."
      showBackLink
    >
      <label htmlFor="chemical-equation" className="mb-2 block text-sm font-semibold text-slate-700">Unbalanced equation</label>
      <input
        id="chemical-equation"
        value={equation}
        onChange={(event) => setEquation(event.target.value)}
        onKeyDown={(event) => { if (event.key === "Enter") balance(); }}
        placeholder="e.g. Fe + O2 -> Fe2O3"
        autoComplete="off"
        spellCheck={false}
        aria-invalid={Boolean(error)}
        aria-describedby="equation-help equation-error"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      />
      <p id="equation-help" className="mt-2 text-sm leading-6 text-slate-500">
        Use -&gt;, →, or = between sides. Separate compounds with +. Write subscripts as numbers, such as H2O.
      </p>
      <button
        type="button"
        onClick={() => balance()}
        className="mt-4 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        Balance equation
      </button>
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-slate-700">Practice examples</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              type="button"
              key={example}
              onClick={() => balance(example)}
              className="min-h-11 rounded-full border border-slate-300 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {error && <p id="equation-error" role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {balancedEquation ? (
        <section className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5" aria-live="polite">
          <h2 className="font-bold text-emerald-800">Balanced equation</h2>
          <p className="mt-2 break-words font-mono text-lg font-semibold text-slate-900">{balancedEquation}</p>
          <p className="mt-4 text-sm font-semibold text-slate-700">Atom count check</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {atomRows.map(({ symbol, left, right }) => (
              <li key={symbol} className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
                <span className="font-bold">{symbol}:</span> {left} on the left, {right} on the right
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-emerald-800">
            {atomRows.every(({ left, right }) => left === right)
              ? "Every element has the same number of atoms on both sides."
              : "Atom counts do not match. Check the equation."}
          </p>
        </section>
      ) : (
        !error && <p className="mt-5 text-sm text-slate-500">Your balanced equation and atom check will appear here.</p>
      )}
    </ToolPage>
  );
}
