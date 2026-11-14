import { useState } from "react";
import { Link } from "react-router-dom";
import ToolPage from "../components/ToolPage";
import { getElectronConfiguration, type ElectronConfiguration } from "../lib/electronConfiguration";

const examples = ["O", "Fe", "Cr", "Cu", "Kr"];

export default function ElectronConfigurationPage() {
  const [value, setValue] = useState("");
  const [configuration, setConfiguration] = useState<ElectronConfiguration | null>(null);
  const [error, setError] = useState("");

  const showConfiguration = (nextValue = value) => {
    setValue(nextValue);
    try {
      setConfiguration(getElectronConfiguration(nextValue));
      setError("");
    } catch (issue) {
      setConfiguration(null);
      setError(issue instanceof Error ? issue.message : "Unable to find that configuration.");
    }
  };

  return (
    <ToolPage
      eyebrow="Chemistry reference"
      title="Electron Configuration"
      description="Enter an element symbol or atomic number to see its electron configuration and noble-gas shorthand."
    >
      <Link to="/" className="mb-4 inline-block min-h-11 rounded-lg py-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        ← Back to home
      </Link>
      <label htmlFor="electron-element" className="mb-2 block text-sm font-semibold text-slate-700">Element</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="electron-element"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") showConfiguration();
          }}
          placeholder="e.g. Fe or 26"
          autoComplete="off"
          spellCheck={false}
          aria-describedby="electron-help electron-error"
          aria-invalid={Boolean(error)}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
        <button
          type="button"
          onClick={() => showConfiguration()}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Show configuration
        </button>
      </div>
      <p id="electron-help" className="mt-2 text-sm text-slate-500">This tool covers elements 1–36 (hydrogen through krypton).</p>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Example elements">
        {examples.map((example) => (
          <button
            type="button"
            key={example}
            onClick={() => showConfiguration(example)}
            className="min-h-11 rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            {example}
          </button>
        ))}
      </div>
      {error && <p id="electron-error" role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}

      {configuration ? (
        <section className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5" aria-live="polite">
          <h2 className="text-xl font-bold text-indigo-800">
            {configuration.symbol} <span className="text-base font-medium">(atomic number {configuration.atomicNumber})</span>
          </h2>
          <p className="mt-4 text-sm font-semibold text-slate-700">Full configuration</p>
          <p className="mt-1 break-words font-mono text-lg text-slate-900">{configuration.configuration}</p>
          {configuration.shorthand && (
            <>
              <p className="mt-4 text-sm font-semibold text-slate-700">Noble-gas shorthand</p>
              <p className="mt-1 break-words font-mono text-lg text-slate-900">{configuration.shorthand}</p>
            </>
          )}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Electron counts by subshell">
            {configuration.orbitals.map(({ subshell, electrons }) => (
              <div key={subshell} className="rounded-lg border border-indigo-100 bg-white px-3 py-2 text-center">
                <span className="block font-mono font-bold text-slate-900">{subshell}</span>
                <span className="text-sm text-slate-600">{electrons} electron{electrons === 1 ? "" : "s"}</span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        !error && <p className="mt-6 rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">Your configuration will appear here.</p>
      )}
    </ToolPage>
  );
}
