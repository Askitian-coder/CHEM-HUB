export interface FormulaSheet {
  id: string;
  topic: string;
  title: string;
  equation: string;
  variables: string;
  use: string;
  example: string;
}

export const FORMULA_SHEETS: FormulaSheet[] = [
  {
    id: "moles-from-mass",
    topic: "Moles",
    title: "Moles from mass",
    equation: "n = m / M",
    variables: "n = amount (mol), m = mass (g), M = molar mass (g/mol)",
    use: "Use when a question gives a sample's mass and asks how many moles it contains.",
    example: "58.44 g NaCl ÷ 58.44 g/mol = 1.00 mol NaCl",
  },
  {
    id: "particles-from-moles",
    topic: "Moles",
    title: "Particles from moles",
    equation: "N = n × Nₐ",
    variables: "N = particles, n = amount (mol), Nₐ = 6.022 × 10²³ mol⁻¹",
    use: "Use Avogadro's constant to change moles into atoms, molecules, or formula units.",
    example: "2.00 mol × 6.022 × 10²³ = 1.204 × 10²⁴ particles",
  },
  {
    id: "molarity",
    topic: "Solutions",
    title: "Molarity",
    equation: "c = n / V",
    variables: "c = concentration (mol/L), n = solute amount (mol), V = solution volume (L)",
    use: "Use for the number of moles of dissolved solute in each litre of solution.",
    example: "0.50 mol in 2.0 L gives c = 0.25 mol/L",
  },
  {
    id: "dilution",
    topic: "Solutions",
    title: "Dilution",
    equation: "c₁V₁ = c₂V₂",
    variables: "c₁,V₁ = starting concentration and volume; c₂,V₂ = final concentration and volume",
    use: "Use when adding solvent: the amount of solute stays the same while the solution gets more dilute.",
    example: "To make 100 mL of 0.20 M from 1.0 M stock: V₁ = (0.20 × 100) / 1.0 = 20 mL",
  },
  {
    id: "mass-concentration",
    topic: "Solutions",
    title: "Mass concentration",
    equation: "cₘ = m / V",
    variables: "cₘ = mass concentration (g/L), m = solute mass (g), V = solution volume (L)",
    use: "Use when concentration is reported as grams of solute per litre of solution.",
    example: "5.0 g in 0.50 L gives cₘ = 10 g/L",
  },
  {
    id: "density",
    topic: "Measurements",
    title: "Density",
    equation: "ρ = m / V",
    variables: "ρ = density (g/mL or g/cm³), m = mass, V = volume",
    use: "Use to compare how much mass is packed into a given volume.",
    example: "20 g / 10 mL = 2.0 g/mL",
  },
  {
    id: "stoichiometry",
    topic: "Reactions",
    title: "Mole ratio",
    equation: "n(A) / a = n(B) / b",
    variables: "a and b are balanced-equation coefficients; n(A), n(B) are amounts in moles",
    use: "Use the coefficients in a balanced equation to convert between reactant and product amounts.",
    example: "N₂ + 3H₂ → 2NH₃: 3 mol H₂ can form 2 mol NH₃",
  },
  {
    id: "percent-yield",
    topic: "Reactions",
    title: "Percent yield",
    equation: "% yield = (actual / theoretical) × 100%",
    variables: "Actual = product collected; theoretical = maximum predicted by stoichiometry",
    use: "Use to compare the product collected in an experiment with the maximum possible amount.",
    example: "8.0 g collected from a 10.0 g theoretical yield gives 80% yield",
  },
  {
    id: "ideal-gas",
    topic: "Gases",
    title: "Ideal gas law",
    equation: "PV = nRT",
    variables: "P = pressure, V = volume, n = moles, T = kelvin; R depends on the units used",
    use: "Use for a gas when pressure, volume, amount, or temperature is unknown. Always convert temperature to kelvin.",
    example: "Use R = 0.08206 L·atm/(mol·K) when P is in atm and V is in L",
  },
  {
    id: "boyles-law",
    topic: "Gases",
    title: "Boyle's law",
    equation: "P₁V₁ = P₂V₂",
    variables: "P = pressure, V = volume; temperature and amount of gas stay constant",
    use: "Use when a gas is compressed or expanded at constant temperature.",
    example: "If volume is halved at constant temperature, pressure doubles",
  },
  {
    id: "charles-law",
    topic: "Gases",
    title: "Charles's law",
    equation: "V₁ / T₁ = V₂ / T₂",
    variables: "V = volume and T = temperature in kelvin; pressure and amount stay constant",
    use: "Use when a gas warms or cools at constant pressure. Celsius must be changed to kelvin first.",
    example: "A gas heated from 300 K to 600 K doubles its volume at constant pressure",
  },
  {
    id: "heat",
    topic: "Energy",
    title: "Heating or cooling",
    equation: "q = mcΔT",
    variables: "q = heat (J), m = mass (g), c = specific heat capacity, ΔT = Tfinal − Tinitial",
    use: "Use to calculate heat transferred when a substance changes temperature without changing phase.",
    example: "For water, c ≈ 4.18 J/(g·°C)",
  },
  {
    id: "ph",
    topic: "Acids and bases",
    title: "pH",
    equation: "pH = −log₁₀[H⁺]",
    variables: "[H⁺] is the hydrogen-ion concentration in mol/L",
    use: "Use to describe acidity: a one-unit pH decrease means ten times the hydrogen-ion concentration.",
    example: "[H⁺] = 1 × 10⁻³ mol/L gives pH = 3",
  },
];
