import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PeriodicTablePage from "./pages/PeriodicTablePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import MolarMassPage from "./pages/MolarMassPage";
import RedoxPage from "./pages/RedoxPage";
import AcidBaseSaltPage from "./pages/AcidBaseSaltPage";
import OxidationNumbersPage from "./pages/OxidationNumbersPage";
import UnitConverterPage from "./pages/UnitConverterPage";
import FormulaSheetsPage from "./pages/FormulaSheetsPage";
import StoichiometryPage from "./pages/StoichiometryPage";
import ConcentrationPage from "./pages/ConcentrationPage";
import ConceptMapsPage from "./pages/ConceptMapsPage";
import ChemistryFactsPage from "./pages/ChemistryFactsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/periodic-table" element={<PeriodicTablePage />} />
        <Route path="/converter" element={<UnitConverterPage />} />
        <Route path="/formulas" element={<FormulaSheetsPage />} />
        <Route path="/concept-maps" element={<ConceptMapsPage />} />
        <Route path="/chemistry-facts" element={<ChemistryFactsPage />} />
        <Route path="/calculators/molar-mass" element={<MolarMassPage />} />
        <Route path="/redox" element={<RedoxPage />} />
        <Route path="/acid-base-salts" element={<AcidBaseSaltPage />} />
        <Route path="/oxidation-numbers" element={<OxidationNumbersPage />} />
        <Route path="/calculators/stoichiometry" element={<StoichiometryPage />} />
        <Route path="/calculators/concentration" element={<ConcentrationPage />} />
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
