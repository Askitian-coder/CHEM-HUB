import { useState } from "react";
import ToolPage from "../components/ToolPage";
import {
  prepareStoichiometricReaction,
  solveStoichiometry,
  type AmountUnit,
  type StoichiometryResult,
  type StoichiometricReaction,
} from "../lib/stoichiometry";

const exampleEquation = "N2 + H2 -> NH3";

export default function StoichiometryPage() {
  const [equation, setEquation] = useState(exampleEquation);
  const [reaction, setReaction] = useState<StoichiometricReaction | null>(null);
  const [amounts, setAmounts] = useState<Record<string, { value: string; unit: AmountUnit }>>({});
  const [product, setProduct] = useState("");
  const [actualMass, setActualMass] = useState("");
  const [result, setResult] = useState<StoichiometryResult | null>(null);
  const [error, setError] = useState("");

  const prepareReaction = () => {
    try {
      const balanced = prepareStoichiometricReaction(equation);
      setReaction(balanced);
      setAmounts(Object.fromEntries(
        balanced.reactants.map(({ formula }) => [formula, { value: "", unit: "mol" }]),
      ));
      setProduct(balanced.products[0]?.formula ?? "");
      setResult(null);
      setError("");
    } catch (issue) {
      setReaction(null);
      setResult(null);
      setError(issue instanceof Error ? issue.message : "Could not prepare this reaction.");
    }
  };

  const solve = () => {
    try {
      const enteredAmounts = Object.entries(amounts)
        .filter(([, amount]) => amount.value.trim())
        .map(([formula, amount]) => ({
          formula,
          amount: Number(amount.value),
          unit: amount.unit,
        }));
      const solved = solveStoichiometry(
        equation,
        enteredAmounts,
        product,
        actualMass.trim() ? Number(actualMass) : undefined,
      );
      setResult(solved);
      setError("");
    } catch (issue) {
      setResult(null);
      setError(issue instanceof Error ? issue.message : "Could not solve this stoichiometry problem.");
    }
  };

  const updateAmount = (formula: string, update: Partial<{ value: string; unit: AmountUnit }>) => {
    setAmounts((current) => ({
      ...current,
      [formula]: { ...current[formula], ...update },
    }));
    setResult(null);
    setError("");
  };

  return (
    <ToolPage
      eyebrow="Reaction calculator"
      title="Stoichiometry Solver"
      description="Balance a reaction, compare reactant amounts, and calculate the theoretical product yield step by step."
    >
      <label htmlFor="stoich-equation" className="mb-2 block text-sm font-semibold text-slate-700">
        Chemical equation
      </label>
      <textarea
        id="stoich-equation"
        value={equation}
        onChange={(event) => {
          setEquation(event.target.value);
          setReaction(null);
          setResult(null);
          setError("");
        }}
        rows={2}
        placeholder="e.g. N2 + H2 -> NH3"
        className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
      />
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Enter the correct reactants and products. Coefficients are balanced for you; the solver cannot guess missing reaction products.
      </p>
      <button type="button" onClick={prepareReaction} className="mt-4 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
        Balance &amp; prepare
      </button>

      {reaction && (
        <div className="mt-5 space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Balanced equation</p>
            <p className="mt-2 break-words font-mono text-lg font-semibold text-slate-900">{reaction.equation}</p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900">Starting reactant amounts</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Enter every available reactant to find the limiting reagent. Any reactant you leave blank is assumed to be in excess.
            </p>
            <div className="mt-3 space-y-3">
              {reaction.reactants.map((reactant) => (
                <div key={reactant.formula} className="rounded-xl border border-slate-200 p-3">
                  <p className="mb-2 text-sm font-semibold text-slate-800">
                    {reactant.coefficient} {reactant.formula} · {reactant.molarMass.toFixed(2)} g/mol
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      aria-label={`${reactant.formula} amount`}
                      value={amounts[reactant.formula]?.value ?? ""}
                      onChange={(event) => updateAmount(reactant.formula, { value: event.target.value })}
                      placeholder="Amount"
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2"
                    />
                    <select
                      aria-label={`${reactant.formula} unit`}
                      value={amounts[reactant.formula]?.unit ?? "mol"}
                      onChange={(event) => updateAmount(reactant.formula, { unit: event.target.value as AmountUnit })}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2"
                    >
                      <option value="mol">mol</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="stoich-product" className="mb-2 block text-sm font-semibold text-slate-700">
                Product to calculate
              </label>
              <select id="stoich-product" value={product} onChange={(event) => { setProduct(event.target.value); setResult(null); }} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
                {reaction.products.map((item) => (
                  <option key={item.formula} value={item.formula}>{item.formula}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="actual-yield" className="mb-2 block text-sm font-semibold text-slate-700">
                Actual product collected (g, optional)
              </label>
              <input id="actual-yield" type="number" min="0" step="any" value={actualMass} onChange={(event) => { setActualMass(event.target.value); setResult(null); }} placeholder="For percent yield" className="w-full rounded-xl border border-slate-300 px-4 py-3" />
            </div>
          </div>
          <button type="button" onClick={solve} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            Solve stoichiometry
          </button>
        </div>
      )}

      {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
      {result && (
        <section className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:p-5" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Step-by-step result</p>
          <p className="mt-2 text-sm text-slate-700">
            Limiting reactant: <strong>{result.limitingReactant}</strong>. It runs out first and sets the maximum product amount.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-slate-500">Theoretical product amount</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900">{result.productMoles.toPrecision(5)} mol</p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-slate-500">Theoretical yield</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900">{result.theoreticalMassGrams.toFixed(2)} g</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            {result.reactants.map((item) => (
              <p key={item.formula}>
                {item.formula}: {item.availableMoles.toPrecision(4)} mol ÷ coefficient {item.coefficient} = reaction extent {item.reactionExtent.toPrecision(4)} mol
              </p>
            ))}
            <p>
              Product moles = smallest reaction extent × {result.productFormula}'s coefficient.
            </p>
          </div>
          {result.percentYield !== null && (
            <p className="mt-4 border-t border-indigo-100 pt-3 text-sm font-semibold text-indigo-800">
              Percent yield = {result.actualYieldGrams?.toFixed(2)} g ÷ {result.theoreticalMassGrams.toFixed(2)} g × 100 = {result.percentYield.toFixed(2)}%
              {result.percentYield > 100 && " (Over 100% usually signals wet or impure product, or a measurement error.)"}
            </p>
          )}
        </section>
      )}

      <aside className="mt-7 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
        First balance the equation. Its coefficients give mole ratios. Convert each measured mass to moles, divide by its coefficient, and the smallest result identifies the limiting reactant.
      </aside>
    </ToolPage>
  );
}
