import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import type { ThemeMode } from "./NavBar";

const pageTitles: Record<string, string> = {
  "/": "ChemHub by Askitian | Interactive Chemistry Study Tools",
  "/periodic-table": "Periodic Table of Elements | ChemHub",
  "/converter": "Chemistry Unit Converter | ChemHub",
  "/formulas": "Chemistry Formula Sheets | ChemHub",
  "/concept-maps": "Chemistry Concept Maps | ChemHub",
  "/chemistry-facts": "Chemistry Facts and Discoveries | ChemHub",
  "/study-progress": "Study Progress | ChemHub",
  "/electron-configuration": "Electron Configuration Tool | ChemHub",
  "/login": "Sign In | ChemHub",
  "/signup": "Create an Account | ChemHub",
  "/calculators/molar-mass": "Molar Mass Calculator | ChemHub",
  "/redox": "Redox Equation Balancer | ChemHub",
  "/acid-base-salts": "Acids, Bases and Salts | ChemHub",
  "/oxidation-numbers": "Oxidation Number Calculator | ChemHub",
  "/calculators/stoichiometry": "Stoichiometry Solver | ChemHub",
  "/calculators/concentration": "Concentration Calculator | ChemHub",
  "/calculators/mole-converter": "Mole Converter | ChemHub",
  "/calculators/equation-balancer": "Chemical Equation Balancer | ChemHub",
};

export default function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const route = pathname.replace(/\/+$/, "") || "/";
    document.title = pageTitles[route] ?? "Page Not Found | ChemHub";
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === "light" ? "dark" : "light")}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
        <p>ChemHub is a study aid, not an official WAEC resource or affiliated with any school. Check calculations and answers with your teacher.</p>
        <nav className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2" aria-label="Site information">
          <a className="min-h-11 px-2 py-3 underline hover:text-indigo-700" href={`${import.meta.env.BASE_URL}privacy.html`}>Privacy</a>
          <a className="min-h-11 px-2 py-3 underline hover:text-indigo-700" href={`${import.meta.env.BASE_URL}terms.html`}>Terms</a>
          <a className="min-h-11 px-2 py-3 underline hover:text-indigo-700" href={`${import.meta.env.BASE_URL}contact.html`}>Contact</a>
        </nav>
        <p className="mt-2">ChemHub — built for chemistry students</p>
      </footer>
    </div>
  );
}
