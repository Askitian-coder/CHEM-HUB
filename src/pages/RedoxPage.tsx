import { useState } from "react";
import { balanceRedoxEquation } from "../lib/chemistryTools";
import ToolPage from "../components/ToolPage";

const example = "MnO4^- + Fe^2+ + H+ -> Mn^2+ + Fe^3+ + H2O";

export default function RedoxPage() {
  const [equation, setEquation] = useState(example);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const balance = () => {
    try {
      setResult(balanceRedoxEquation(equation));
      setError("");
    } catch (issue) {
      setResult(null);
      setError(issue instanceof Error ? issue.message : "Could not balance this reaction.");
    }
  };

  return (
    <ToolPage
      eyebrow="Reaction tools"
      title="Redox Reaction Balancer"
      description="Balance atoms and total ionic charge in oxidation-reduction reactions."
    >
      <label htmlFor="redox-equation" className="mb-2 block text-sm font-semibold text-slate-700">Unbalanced reaction</label>
      <textarea
        id="redox-equation"
        value={equation}
        onChange={(event) => {
          setEquation(event.target.value);
          setResult(null);
          setError("");
        }}
        rows={3}
        placeholder="Fe^2+ + MnO4^- + H+ -> Fe^3+ + Mn^2+ + H2O"
        className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      />
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Separate species with a plus sign surrounded by spaces. Use <code>^2+</code> or <code>^-</code> for ionic charges, and <code>→</code> or <code>-&gt;</code> between sides.
      </p>
      <button type="button" onClick={balance} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
        Balance reaction
      </button>
      {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
      {result && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Balanced equation</p>
          <p className="mt-2 break-words font-mono text-base font-semibold leading-7 text-slate-900 sm:text-lg">{result}</p>
          <p className="mt-2 text-xs text-emerald-800">The coefficients conserve every element and the total ionic charge.</p>
        </div>
      )}
      <div className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
        Add water, hydrogen ions, or hydroxide ions to the equation when your reaction is balanced in acidic or basic solution.
        This tool solves the atom and charge balance for the species you enter; it cannot choose missing reaction products for you.
      </div>
    </ToolPage>
  );
}
