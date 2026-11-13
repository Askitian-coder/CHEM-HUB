import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PeriodicTablePage from "./pages/PeriodicTablePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import MolarMassPage from "./pages/MolarMassPage";
import RedoxPage from "./pages/RedoxPage";
import AcidBaseSaltPage from "./pages/AcidBaseSaltPage";
import OxidationNumbersPage from "./pages/OxidationNumbersPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/periodic-table" element={<PeriodicTablePage />} />
        <Route
          path="/converter"
          element={
            <PlaceholderPage
              title="Unit Converter"
              description="Convert between moles, grams, temperature, pressure, volume, mass, and energy."
            />
          }
        />
        <Route
          path="/formulas"
          element={
            <PlaceholderPage
              title="Formula Sheets"
              description="Searchable formula sheets for every chemistry topic."
            />
          }
        />
        <Route path="/calculators/molar-mass" element={<MolarMassPage />} />
        <Route path="/redox" element={<RedoxPage />} />
        <Route path="/acid-base-salts" element={<AcidBaseSaltPage />} />
        <Route path="/oxidation-numbers" element={<OxidationNumbersPage />} />
        <Route
          path="/calculators/stoichiometry"
          element={
            <PlaceholderPage
              title="Stoichiometry Solver"
              description="Solve stoichiometry problems step by step — mole ratios, limiting reagents, yields."
            />
          }
        />
        <Route
          path="/calculators/concentration"
          element={
            <PlaceholderPage
              title="Concentration Calculator"
              description="Molarity, mass concentration, and dilution calculator."
            />
          }
        />
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page not found"
              description="That page isn't here, but your next chemistry discovery is."
            />
          }
        />
      </Routes>
    </Layout>
  );
}
