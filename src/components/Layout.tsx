import { useEffect, useState, type ReactNode } from "react";
import NavBar from "./NavBar";
import type { ThemeMode } from "./NavBar";

export default function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() =>
    window.localStorage.getItem("chemhub-theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("chemhub-theme", theme);
  }, [theme]);

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
        ChemHub — built for chemistry students
      </footer>
    </div>
  );
}
