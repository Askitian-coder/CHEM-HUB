import { useState } from "react";
import { NavLink } from "react-router-dom";

export type ThemeMode = "light" | "dark";

interface NavBarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const links = [
  { to: "/", label: "Home" },
  { to: "/periodic-table", label: "Periodic Table" },
  { to: "/converter", label: "Unit Converter" },
  { to: "/formulas", label: "Formula Sheets" },
  { to: "/concept-maps", label: "Concept Maps" },
  { to: "/calculators/molar-mass", label: "Molar Mass" },
  { to: "/calculators/stoichiometry", label: "Stoichiometry" },
  { to: "/calculators/concentration", label: "Concentration" },
  { to: "/redox", label: "Redox Balancer" },
  { to: "/acid-base-salts", label: "Acids, Bases & Salts" },
  { to: "/oxidation-numbers", label: "Oxidation Numbers" },
];

const linkStyle = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-indigo-700"
  }`;

export default function NavBar({ theme, onToggleTheme }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-indigo-700"
          onClick={() => setMenuOpen(false)}
        >
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">Ch</span>
          ChemHub
        </NavLink>
        <div className="hidden items-center gap-1 2xl:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkStyle}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:px-3"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
            onClick={onToggleTheme}
          >
            <span className="text-lg" aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            <span className="hidden sm:inline">{theme === "light" ? "Dark" : "Light"} mode</span>
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 2xl:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="text-2xl leading-none" aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 shadow-lg 2xl:hidden">
          <div className="mx-auto grid max-w-6xl gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkStyle}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
