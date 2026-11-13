import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Category, Element } from "../data/elements";
import { ELEMENTS } from "../data/elements";

const categories: Category[] = [
  "alkali-metal",
  "alkaline-earth-metal",
  "transition-metal",
  "post-transition-metal",
  "metalloid",
  "nonmetal",
  "halogen",
  "noble-gas",
  "lanthanide",
  "actinide",
];

const categoryStyles: Record<Category, { label: string; color: string; hover: string }> = {
  "alkali-metal": { label: "Alkali metal", color: "bg-rose-500", hover: "hover:bg-rose-600" },
  "alkaline-earth-metal": { label: "Alkaline earth metal", color: "bg-orange-400", hover: "hover:bg-orange-500" },
  "transition-metal": { label: "Transition metal", color: "bg-sky-500", hover: "hover:bg-sky-600" },
  "post-transition-metal": { label: "Post-transition metal", color: "bg-teal-500", hover: "hover:bg-teal-600" },
  metalloid: { label: "Metalloid", color: "bg-lime-500", hover: "hover:bg-lime-600" },
  nonmetal: { label: "Nonmetal", color: "bg-emerald-500", hover: "hover:bg-emerald-600" },
  halogen: { label: "Halogen", color: "bg-violet-500", hover: "hover:bg-violet-600" },
  "noble-gas": { label: "Noble gas", color: "bg-fuchsia-500", hover: "hover:bg-fuchsia-600" },
  lanthanide: { label: "Lanthanide", color: "bg-amber-500", hover: "hover:bg-amber-600" },
  actinide: { label: "Actinide", color: "bg-yellow-600", hover: "hover:bg-yellow-700" },
};

type ElementType = "Metal" | "Metalloid" | "Nonmetal";
type RoomState = "Solid" | "Liquid" | "Gas";

const nonmetalCategories: Category[] = ["nonmetal", "halogen", "noble-gas"];

function categoryLabel(category: Category) {
  return categoryStyles[category].label;
}

function elementType(category: Category): ElementType {
  if (category === "metalloid") return "Metalloid";
  if (nonmetalCategories.includes(category)) return "Nonmetal";
  return "Metal";
}

function stateAtRoomTemperature(element: Element): RoomState | null {
  if (element.meltingPoint === null || element.boilingPoint === null) return null;
  if (element.boilingPoint <= 25) return "Gas";
  if (element.meltingPoint <= 25 && 25 < element.boilingPoint) return "Liquid";
  return "Solid";
}

function ElementCell({
  element,
  dimmed,
  onSelect,
  onJump,
}: {
  element: Element;
  dimmed: boolean;
  onSelect: (element: Element) => void;
  onJump?: () => void;
}) {
  const style = categoryStyles[element.category];
  return (
    <div
      className="relative aspect-square min-w-0"
      style={{ gridColumnStart: element.group ?? undefined, gridRowStart: element.period }}
    >
      <button
        type="button"
        className={`group absolute inset-0 flex items-center justify-center rounded-[3px] p-0 text-white transition focus:z-20 focus:outline-none focus:ring-2 focus:ring-indigo-900 ${style.color} ${style.hover} ${dimmed ? "opacity-25" : "opacity-100"}`}
        aria-label={`${element.name}, ${element.symbol}, atomic number ${element.atomicNumber}`}
        onClick={() => onSelect(element)}
      >
        <span className="absolute left-[2px] top-[1px] text-[6px] font-medium leading-none sm:left-1 sm:top-1 sm:text-[9px]">
          {element.atomicNumber}
        </span>
        <span className="text-[8px] font-extrabold leading-none sm:text-xs md:text-base">{element.symbol}</span>
        <span className="absolute bottom-[1px] hidden text-[8px] leading-none sm:block">
          {Number(element.atomicMass.toFixed(2))}
        </span>
        <span className="pointer-events-none absolute left-1/2 top-full z-40 mt-1 hidden w-40 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-left text-xs font-normal text-white shadow-xl group-hover:block group-focus-visible:block">
          <span className="block font-bold">{element.symbol} · {element.name}</span>
          <span className="mt-1 block">Atomic number: {element.atomicNumber}</span>
          <span className="block">Atomic mass: {element.atomicMass}</span>
          <span className="block">{categoryLabel(element.category)}</span>
        </span>
      </button>
      {onJump && (
        <button
          type="button"
          className="absolute right-0 top-0 z-10 grid h-1.5 w-1.5 place-items-center rounded-bl-sm bg-slate-200 text-[5px] leading-none text-slate-600 hover:bg-slate-300 sm:h-3 sm:w-3 sm:text-[8px]"
          aria-label={`Jump to ${element.atomicNumber === 57 ? "lanthanides" : "actinides"}`}
          onClick={onJump}
        >
          ↘
        </button>
      )}
    </div>
  );
}

function ElementModal({
  element,
  onClose,
  onNavigate,
}: {
  element: Element;
  onClose: () => void;
  onNavigate: (offset: number) => void;
}) {
  const style = categoryStyles[element.category];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onNavigate]);

  const rows: [string, string][] = [
    ["Atomic mass", `${element.atomicMass} u`],
    ["Category", categoryLabel(element.category)],
    ["Block", `${element.block}-block`],
    ["Period", String(element.period)],
    ["Group", element.group === null ? "—" : String(element.group)],
    ["Electron configuration", element.electronConfig],
    ["Electronegativity (Pauling)", element.electronegativity === null ? "—" : String(element.electronegativity)],
    ["Melting point (°C)", element.meltingPoint === null ? "—" : String(element.meltingPoint)],
    ["Boiling point (°C)", element.boilingPoint === null ? "—" : String(element.boilingPoint)],
    ["Density (g/cm³)", element.density === null ? "—" : String(element.density)],
    ["Discovered by", element.discoveredBy],
    ["Year discovered", String(element.yearDiscovered)],
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="element-modal-title"
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close element details"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-2xl leading-none text-slate-600 shadow-sm transition hover:bg-slate-100"
        >
          ×
        </button>
        <div className="grid gap-6 p-5 pt-14 sm:p-7 sm:pt-14 md:grid-cols-[minmax(160px,0.8fr)_1.5fr]">
          <div className="flex items-start justify-center md:justify-start">
            <div className={`relative flex aspect-square w-full max-w-[220px] flex-col items-center justify-center rounded-2xl text-white shadow-lg ${style.color}`}>
              <span className="absolute left-4 top-4 text-sm font-medium">{element.atomicNumber}</span>
              <span className="text-6xl font-extrabold">{element.symbol}</span>
              <span className="mt-2 text-center text-lg font-semibold">{element.name}</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-indigo-600">{categoryLabel(element.category)}</p>
                <h2 id="element-modal-title" className="text-2xl font-extrabold text-slate-900">{element.name}</h2>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => onNavigate(-1)} aria-label="Previous element" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-lg text-slate-700 hover:bg-slate-50">←</button>
                <button type="button" onClick={() => onNavigate(1)} aria-label="Next element" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-lg text-slate-700 hover:bg-slate-50">→</button>
              </div>
            </div>
            <dl className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {rows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-3 px-3 py-2 text-xs sm:text-sm">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="break-words font-medium text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-800">Common uses</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {element.commonUses.map((use) => (
                  <span key={use} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{use}</span>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{element.summary}</p>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default function PeriodicTable() {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ElementType[]>([]);
  const [selectedStates, setSelectedStates] = useState<RoomState[]>([]);
  const [legendCategory, setLegendCategory] = useState<Category | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const matchingElements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ELEMENTS.filter((element) => {
      const matchesSearch =
        !normalizedQuery ||
        element.name.toLowerCase().includes(normalizedQuery) ||
        element.symbol.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(element.category);
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(elementType(element.category));
      const state = stateAtRoomTemperature(element);
      const matchesState = selectedStates.length === 0 || (state !== null && selectedStates.includes(state));
      return matchesSearch && matchesCategory && matchesType && matchesState;
    });
  }, [query, selectedCategories, selectedTypes, selectedStates]);

  const matchingNumbers = useMemo(
    () => new Set(matchingElements.map((element) => element.atomicNumber)),
    [matchingElements],
  );

  const toggleCategory = (category: Category) =>
    setSelectedCategories((current) =>
      current.includes(category) ? current.filter((value) => value !== category) : [...current, category],
    );
  const toggleType = (type: ElementType) =>
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((value) => value !== type) : [...current, type],
    );
  const toggleState = (state: RoomState) =>
    setSelectedStates((current) =>
      current.includes(state) ? current.filter((value) => value !== state) : [...current, state],
    );

  const navigateElement = (offset: number) => {
    setSelectedElement((current) => {
      if (!current) return current;
      const currentIndex = ELEMENTS.findIndex((element) => element.atomicNumber === current.atomicNumber);
      return ELEMENTS[(currentIndex + offset + ELEMENTS.length) % ELEMENTS.length];
    });
  };
  const clearAll = () => {
    setQuery("");
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedStates([]);
    setLegendCategory(null);
  };

  const matchCount = `${matchingElements.length} ${matchingElements.length === 1 ? "match" : "matches"}`;
  const fBlock = [
    { label: "Lanthanides", elements: ELEMENTS.filter((element) => element.atomicNumber >= 58 && element.atomicNumber <= 71) },
    { label: "Actinides", elements: ELEMENTS.filter((element) => element.atomicNumber >= 90 && element.atomicNumber <= 103) },
  ];
  const hasFilters = Boolean(query) || selectedCategories.length > 0 || selectedTypes.length > 0 || selectedStates.length > 0 || legendCategory !== null;

  return (
    <div>
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="element-search" className="sr-only">Search elements by name or symbol</label>
          <div className="relative min-w-[min(100%,250px)] flex-1 sm:max-w-md">
            <input
              id="element-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by element or symbol…"
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-4 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-lg text-slate-500 hover:bg-slate-100">×</button>
            )}
          </div>
          <span className="text-sm font-medium text-slate-500" aria-live="polite">{matchCount}</span>
          {hasFilters && (
            <button type="button" onClick={clearAll} className="ml-auto text-sm font-semibold text-indigo-700 hover:text-indigo-900">Clear all</button>
          )}
        </div>

        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <FilterRow label="Category">
            {categories.map((category) => (
              <FilterChip
                key={category}
                label={categoryLabel(category)}
                active={selectedCategories.includes(category)}
                onClick={() => toggleCategory(category)}
              />
            ))}
          </FilterRow>
          <FilterRow label="Type">
            {(["Metal", "Metalloid", "Nonmetal"] as ElementType[]).map((type) => (
              <FilterChip key={type} label={type} active={selectedTypes.includes(type)} onClick={() => toggleType(type)} />
            ))}
          </FilterRow>
          <FilterRow label="State">
            {(["Solid", "Liquid", "Gas"] as RoomState[]).map((state) => (
              <FilterChip key={state} label={state} active={selectedStates.includes(state)} onClick={() => toggleState(state)} />
            ))}
          </FilterRow>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2" aria-label="Element category legend">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            aria-pressed={legendCategory === category}
            onClick={() => setLegendCategory((current) => current === category ? null : category)}
            className={`flex items-center gap-1.5 rounded-full px-1 py-1 text-[11px] transition hover:bg-white sm:text-xs ${legendCategory && legendCategory !== category ? "text-slate-400" : "text-slate-700"}`}
          >
            <span className={`h-3 w-3 rounded-sm ${categoryStyles[category].color}`} />
            {categoryLabel(category)}
          </button>
        ))}
      </div>

      <div className="mt-4 grid w-full grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(7,minmax(0,1fr))] gap-[2px] sm:gap-1" aria-label="Periodic table">
        {ELEMENTS.filter((element) => element.group !== null).map((element) => (
          <ElementCell
            key={element.atomicNumber}
            element={element}
            dimmed={!matchingNumbers.has(element.atomicNumber) || Boolean(legendCategory && element.category !== legendCategory)}
            onSelect={setSelectedElement}
            onJump={
              element.atomicNumber === 57
                ? () => document.getElementById("lanthanides")?.scrollIntoView({ behavior: "smooth", block: "center" })
                : element.atomicNumber === 89
                  ? () => document.getElementById("actinides")?.scrollIntoView({ behavior: "smooth", block: "center" })
                  : undefined
            }
          />
        ))}
      </div>

      <div className="mt-4 space-y-2" id="f-block">
        {fBlock.map(({ label, elements }) => {
          const id = label.toLowerCase();
          const category = label === "Lanthanides" ? "lanthanide" : "actinide";
          return (
            <div key={label} id={id} className="flex scroll-mt-24 items-center gap-2">
              <span className={`w-[58px] shrink-0 text-[9px] font-semibold leading-tight sm:w-[78px] sm:text-xs ${category === "lanthanide" ? "text-amber-700" : "text-yellow-700"}`}>
                {label}
              </span>
              <div
                className="grid min-w-0 flex-1 gap-[2px] sm:gap-1"
                style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
              >
                {elements.map((element) => (
                  <ElementCell
                    key={element.atomicNumber}
                    element={element}
                    dimmed={!matchingNumbers.has(element.atomicNumber) || Boolean(legendCategory && element.category !== legendCategory)}
                    onSelect={setSelectedElement}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">Choose an element for its properties. Hover or focus a cell for a quick summary.</p>

      {selectedElement && (
        <ElementModal
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
          onNavigate={navigateElement}
        />
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-xs font-semibold text-slate-500">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition sm:text-xs ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
      }`}
    >
      {label}
    </button>
  );
}
