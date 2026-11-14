import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./auth/AuthProvider";

const HomePage = lazy(() => import("./pages/HomePage"));
const PeriodicTablePage = lazy(() => import("./pages/PeriodicTablePage"));
const PlaceholderPage = lazy(() => import("./pages/PlaceholderPage"));
const MolarMassPage = lazy(() => import("./pages/MolarMassPage"));
const RedoxPage = lazy(() => import("./pages/RedoxPage"));
const AcidBaseSaltPage = lazy(() => import("./pages/AcidBaseSaltPage"));
const OxidationNumbersPage = lazy(() => import("./pages/OxidationNumbersPage"));
const UnitConverterPage = lazy(() => import("./pages/UnitConverterPage"));
const FormulaSheetsPage = lazy(() => import("./pages/FormulaSheetsPage"));
const StoichiometryPage = lazy(() => import("./pages/StoichiometryPage"));
const ConcentrationPage = lazy(() => import("./pages/ConcentrationPage"));
const ConceptMapsPage = lazy(() => import("./pages/ConceptMapsPage"));
const ChemistryFactsPage = lazy(() => import("./pages/ChemistryFactsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const StudyProgressPage = lazy(() => import("./pages/StudyProgressPage"));
const ElectronConfigurationPage = lazy(() => import("./pages/ElectronConfigurationPage"));
const MoleConverterPage = lazy(() => import("./pages/MoleConverterPage"));
const EquationBalancerPage = lazy(() => import("./pages/EquationBalancerPage"));

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<p className="py-12 text-center text-slate-600" role="status">Loading chemistry tool…</p>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/periodic-table" element={<PeriodicTablePage />} />
            <Route path="/converter" element={<UnitConverterPage />} />
            <Route path="/formulas" element={<FormulaSheetsPage />} />
            <Route path="/concept-maps" element={<ConceptMapsPage />} />
            <Route path="/chemistry-facts" element={<ChemistryFactsPage />} />
            <Route path="/study-progress" element={<StudyProgressPage />} />
            <Route path="/electron-configuration" element={<ElectronConfigurationPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/calculators/molar-mass" element={<MolarMassPage />} />
            <Route path="/redox" element={<RedoxPage />} />
            <Route path="/acid-base-salts" element={<AcidBaseSaltPage />} />
            <Route path="/oxidation-numbers" element={<OxidationNumbersPage />} />
            <Route path="/calculators/stoichiometry" element={<StoichiometryPage />} />
            <Route path="/calculators/concentration" element={<ConcentrationPage />} />
            <Route path="/calculators/mole-converter" element={<MoleConverterPage />} />
            <Route path="/calculators/equation-balancer" element={<EquationBalancerPage />} />
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
        </Suspense>
      </Layout>
    </AuthProvider>
  );
}
