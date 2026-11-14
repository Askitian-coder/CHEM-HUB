import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export type ThemeMode = "light" | "dark";

interface NavBarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

interface NavigationItem {
  to: string;
  label: string;
  external?: boolean;
}

const primaryLinks: NavigationItem[] = [
  { to: "/", label: "Home" },
  { to: "/study-progress", label: "Study Progress" },
  { to: `${import.meta.env.BASE_URL}tools/practice-quiz-v2.html`, label: "Practice Quizzes", external: true },
  { to: "/periodic-table", label: "Periodic Table" },
  { to: "/converter", label: "Unit Converter" },
];

const toolLinks: NavigationItem[] = [
  { to: "/electron-configuration", label: "Electron Configuration" },
  { to: "/formulas", label: "Formula Sheets" },
  { to: "/concept-maps", label: "Concept Maps" },
  { to: "/chemistry-facts", label: "Chemistry Facts" },
  { to: "/calculators/molar-mass", label: "Molar Mass" },
  { to: "/calculators/stoichiometry", label: "Stoichiometry" },
  { to: "/calculators/concentration", label: "Concentration" },
  { to: "/calculators/mole-converter", label: "Mole Converter" },
  { to: "/calculators/equation-balancer", label: "Equation Balancer" },
  { to: "/redox", label: "Redox Balancer" },
  { to: "/acid-base-salts", label: "Acids, Bases & Salts" },
  { to: "/oxidation-numbers", label: "Oxidation Numbers" },
];

const linkStyle = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-indigo-700"
  }`;

function NavigationLink({
  item,
  onClick,
}: {
  item: NavigationItem;
  onClick?: () => void;
}) {
  if (item.external) {
    return (
      <a
        href={item.to}
        className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  }
  return <NavLink to={item.to} className={linkStyle} onClick={onClick}>{item.label}</NavLink>;
}

export default function NavBar({ theme, onToggleTheme }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const { user, signOut } = useAuth();

  const closeMenu = () => {
    setMenuOpen(false);
    setToolsOpen(false);
  };

  const handleSignOut = async () => {
    setSignOutError("");
    try {
      await signOut();
      closeMenu();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Unable to sign out.");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <NavLink
          to="/"
          className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-indigo-700"
          onClick={closeMenu}
        >
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">Ch</span>
          ChemHub
        </NavLink>
        <div className="hidden items-center gap-1 2xl:flex">
          {primaryLinks.map((item) => <NavigationLink key={item.to} item={item} />)}
          <div className="relative">
            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              onClick={() => setToolsOpen((open) => !open)}
              onKeyDown={(event) => { if (event.key === "Escape") setToolsOpen(false); }}
            >
              Tools <span className="ml-1" aria-hidden="true">⌄</span>
            </button>
            {toolsOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 grid min-w-56 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {toolLinks.map((item) => (
                  <NavigationLink key={item.to} item={item} onClick={() => setToolsOpen(false)} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Sign out
            </button>
          ) : (
            <NavLink to="/login" className={linkStyle}>Sign in</NavLink>
          )}
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:px-3"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
            onClick={onToggleTheme}
          >
            <span className="text-lg" aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            <span className="hidden sm:inline">{theme === "light" ? "Dark" : "Light"} mode</span>
          </button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 2xl:hidden"
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
            {primaryLinks.map((item) => <NavigationLink key={item.to} item={item} onClick={closeMenu} />)}
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"
              aria-expanded={toolsOpen}
              onClick={() => setToolsOpen((open) => !open)}
            >
              Tools <span aria-hidden="true">{toolsOpen ? "−" : "+"}</span>
            </button>
            {toolsOpen && toolLinks.map((item) => (
              <NavigationLink key={item.to} item={item} onClick={closeMenu} />
            ))}
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
              >
                Sign out
              </button>
            ) : (
              <NavLink to="/signup" className={linkStyle} onClick={closeMenu}>Create account</NavLink>
            )}
          </div>
        </div>
      )}
      {signOutError && (
        <p role="alert" className="mx-auto max-w-6xl px-4 pb-2 text-right text-sm text-rose-700">
          {signOutError}
        </p>
      )}
    </header>
  );
}
