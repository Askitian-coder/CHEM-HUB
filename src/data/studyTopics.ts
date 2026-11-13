export interface StudyTopic {
  id: string;
  title: string;
  description: string;
  toolLabel: string;
  toolPath: string;
}

export const STUDY_TOPICS: StudyTopic[] = [
  {
    id: "measurement-matter",
    title: "Measurement & Matter",
    description: "Units, significant figures, density, and properties of matter.",
    toolLabel: "Unit converter",
    toolPath: "/converter",
  },
  {
    id: "atomic-structure-light",
    title: "Atomic Structure & Light",
    description: "Atomic models, isotopes, electron energy, and light.",
    toolLabel: "Periodic table",
    toolPath: "/periodic-table",
  },
  {
    id: "moles-stoichiometry",
    title: "Moles & Stoichiometry",
    description: "Moles, formula mass, reaction ratios, and yield.",
    toolLabel: "Stoichiometry solver",
    toolPath: "/calculators/stoichiometry",
  },
  {
    id: "gas-laws",
    title: "Gas Laws",
    description: "Pressure, volume, temperature, and gas-particle relationships.",
    toolLabel: "Formula sheets",
    toolPath: "/formulas",
  },
  {
    id: "solutions-colligative",
    title: "Solutions & Colligative Properties",
    description: "Concentration, dilution, solubility, and solution properties.",
    toolLabel: "Concentration calculator",
    toolPath: "/calculators/concentration",
  },
  {
    id: "thermochemistry-thermodynamics",
    title: "Thermochemistry & Thermodynamics",
    description: "Heat transfer, enthalpy, entropy, and energy changes.",
    toolLabel: "Formula sheets",
    toolPath: "/formulas",
  },
  {
    id: "kinetics-equilibrium",
    title: "Kinetics & Equilibrium",
    description: "Reaction rates, equilibrium, and factors that shift reactions.",
    toolLabel: "Formula sheets",
    toolPath: "/formulas",
  },
  {
    id: "acids-bases-buffers",
    title: "Acids, Bases & Buffers",
    description: "pH, neutralization, indicators, and buffer systems.",
    toolLabel: "Acids, bases & salts",
    toolPath: "/acid-base-salts",
  },
  {
    id: "electrochemistry-nuclear",
    title: "Electrochemistry & Nuclear Chemistry",
    description: "Redox, electrochemical cells, and nuclear changes.",
    toolLabel: "Concept maps",
    toolPath: "/concept-maps",
  },
];
