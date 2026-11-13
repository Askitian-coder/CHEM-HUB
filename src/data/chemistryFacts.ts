export interface ChemistryFact {
  id: string;
  topic: string;
  title: string;
  fact: string;
  whyItMatters: string;
  misconception?: {
    claim: string;
    correction: string;
  };
  relatedTool?: {
    label: string;
    path: string;
  };
}

export const CHEMISTRY_FACTS: ChemistryFact[] = [
  {
    id: "periodic-law",
    topic: "Atoms & the Periodic Table",
    title: "The periodic table is a pattern-finder",
    fact: "Elements are arranged by atomic number, and repeating patterns in their properties create the table's rows and columns.",
    whyItMatters: "Elements in the same group often have similar outer-electron arrangements, which helps predict how they react.",
    misconception: {
      claim: "Elements are arranged by increasing atomic mass.",
      correction: "The modern table is arranged by increasing atomic number: the number of protons in each atom.",
    },
    relatedTool: { label: "Explore the Periodic Table", path: "/periodic-table" },
  },
  {
    id: "isotopes",
    topic: "Atoms & the Periodic Table",
    title: "Isotopes are the same element with different weights",
    fact: "Isotopes have the same number of protons but different numbers of neutrons.",
    whyItMatters: "They are the same element, but their different masses matter in nuclear chemistry and help explain an element's average atomic mass.",
    misconception: {
      claim: "An isotope with extra neutrons is a different element.",
      correction: "Element identity is set by proton number; changing neutron number makes a different isotope.",
    },
  },
  {
    id: "average-atomic-mass",
    topic: "Atoms & the Periodic Table",
    title: "Periodic-table masses are weighted averages",
    fact: "An element's standard atomic weight reflects the masses and natural abundances of its isotopes.",
    whyItMatters: "That is why a periodic-table atomic mass is often not a whole number; use isotope fractions as decimals in a weighted average.",
    relatedTool: { label: "Open the formula sheets", path: "/formulas" },
  },
  {
    id: "atom-scale",
    topic: "Atoms & the Periodic Table",
    title: "Atoms are mostly space",
    fact: "An atom's nucleus is tiny compared with the whole atom, even though it contains nearly all of the atom's mass.",
    whyItMatters: "The electron cloud determines much of an atom's size and chemistry; the compact nucleus carries its positive charge.",
  },
  {
    id: "carbon-bonds",
    topic: "Atoms & the Periodic Table",
    title: "Carbon can build a huge variety of molecules",
    fact: "Carbon can form four covalent bonds and bond to itself, making chains, branches, and rings.",
    whyItMatters: "This bonding flexibility is one reason carbon is the backbone of the enormous variety of molecules in living things and materials.",
  },
  {
    id: "one-mole",
    topic: "Moles & Reactions",
    title: "A mole is a counting unit",
    fact: "One mole contains exactly 6.02214076 × 10²³ specified particles.",
    whyItMatters: "It connects atoms and molecules, which are too small to count individually, to measurable laboratory amounts.",
    misconception: {
      claim: "A mole is a mass or a kind of molecule.",
      correction: "A mole counts particles. The mass of one mole depends on which substance is being counted.",
    },
    relatedTool: { label: "Calculate molar mass", path: "/calculators/molar-mass" },
  },
  {
    id: "teaspoon-water",
    topic: "Moles & Reactions",
    title: "A teaspoon of water holds an enormous number of molecules",
    fact: "A 5 mL teaspoon of water contains roughly 1.7 × 10²³ water molecules.",
    whyItMatters: "The estimate uses water's density, molar mass, and Avogadro's constant—an everyday example of the mole bridge.",
    relatedTool: { label: "Try the molar-mass calculator", path: "/calculators/molar-mass" },
  },
  {
    id: "coefficients-subscripts",
    topic: "Moles & Reactions",
    title: "Coefficients and subscripts do different jobs",
    fact: "A coefficient counts whole particles or moles; a subscript counts atoms inside each particle.",
    whyItMatters: "Changing a coefficient balances an equation. Changing a subscript changes the substance itself.",
    misconception: {
      claim: "You can change a formula's subscripts to balance an equation.",
      correction: "Never change subscripts when balancing: that would turn one chemical into another.",
    },
    relatedTool: { label: "Balance a reaction", path: "/redox" },
  },
  {
    id: "mass-conservation",
    topic: "Moles & Reactions",
    title: "Chemical reactions rearrange atoms",
    fact: "In an ordinary chemical reaction, atoms are conserved and rearranged into new combinations.",
    whyItMatters: "A balanced equation has the same number of each kind of atom on both sides; ionic equations must also conserve charge.",
    relatedTool: { label: "Try the stoichiometry solver", path: "/calculators/stoichiometry" },
  },
  {
    id: "limiting-reactant",
    topic: "Moles & Reactions",
    title: "The limiting reactant is the recipe ingredient that runs out first",
    fact: "The reactant with the smallest amount relative to its balanced-equation coefficient limits how much product can form.",
    whyItMatters: "Compare moles divided by coefficients—not just the starting masses—to identify it.",
    relatedTool: { label: "Solve a stoichiometry problem", path: "/calculators/stoichiometry" },
  },
  {
    id: "catalyst",
    topic: "Moles & Reactions",
    title: "Catalysts change the route, not the destination",
    fact: "A catalyst provides a lower-activation-energy pathway and is regenerated by the end of the reaction.",
    whyItMatters: "It helps a system reach equilibrium faster, but does not change the equilibrium position or the reaction's overall energy change.",
    misconception: {
      claim: "A catalyst makes more product at equilibrium.",
      correction: "A catalyst speeds up both directions; it changes how quickly equilibrium is reached, not the equilibrium mixture.",
    },
  },
  {
    id: "reaction-temperature",
    topic: "Moles & Reactions",
    title: "Heating usually makes reactions faster",
    fact: "At a higher temperature, particles move faster and a greater fraction of collisions have enough energy to overcome the activation barrier.",
    whyItMatters: "The important change is the fraction of successful collisions, not simply that particles collide more often.",
  },
  {
    id: "water-ice",
    topic: "Water & Materials",
    title: "Ice floats because solid water is less dense",
    fact: "Hydrogen bonds hold water molecules in a more open arrangement in ordinary ice than in liquid water.",
    whyItMatters: "Floating ice insulates the water below, helping lakes and ponds avoid freezing solid from the bottom up.",
  },
  {
    id: "water-polar",
    topic: "Water & Materials",
    title: "Water is a polar molecule",
    fact: "Water's bent shape and unequal electron sharing give it partial positive and negative ends.",
    whyItMatters: "Water molecules attract ions and other polar substances, making water an excellent solvent for many—but not all—materials.",
    misconception: {
      claim: "Water dissolves everything.",
      correction: "Polar and ionic substances often dissolve well in water; many nonpolar substances, such as oils, do not.",
    },
  },
  {
    id: "phase-change",
    topic: "Water & Materials",
    title: "Boiling water does not split its molecules",
    fact: "During boiling, water molecules separate from one another; the O–H covalent bonds inside each H₂O molecule remain intact.",
    whyItMatters: "A phase change overcomes intermolecular attractions. Breaking chemical bonds is a chemical change.",
  },
  {
    id: "kelvin-gases",
    topic: "Gases & Solutions",
    title: "Gas-law temperatures must be absolute",
    fact: "Use kelvin—not Celsius—in gas-law ratios and the ideal gas law.",
    whyItMatters: "Kelvin starts at absolute zero, so a gas temperature ratio such as T₂/T₁ has a meaningful zero point.",
    misconception: {
      claim: "A temperature of 0 °C means gas particles have stopped moving.",
      correction: "0 °C is 273.15 K, far above absolute zero.",
    },
    relatedTool: { label: "Convert temperature units", path: "/converter" },
  },
  {
    id: "ideal-gas-limits",
    topic: "Gases & Solutions",
    title: "Real gases are not perfectly ideal",
    fact: "The ideal-gas model works best at relatively low pressure and high temperature.",
    whyItMatters: "At high pressure or low temperature, particle volume and attractions matter more, so real gases can depart from PV = nRT.",
  },
  {
    id: "molarity-molality",
    topic: "Gases & Solutions",
    title: "Molarity and molality are not interchangeable",
    fact: "Molarity uses litres of solution; molality uses kilograms of solvent.",
    whyItMatters: "Solution volume can change with temperature, while solvent mass does not—important when comparing temperature-dependent measurements.",
    relatedTool: { label: "Calculate solution concentration", path: "/calculators/concentration" },
  },
  {
    id: "ph-logarithmic",
    topic: "Acids & Bases",
    title: "One pH unit means a tenfold concentration change",
    fact: "For dilute aqueous solutions, pH = −log₁₀[H⁺]; a solution at pH 3 has about ten times the hydrogen-ion concentration of one at pH 4.",
    whyItMatters: "The pH scale is logarithmic, so a small-looking number change can represent a large chemical difference.",
    relatedTool: { label: "Review acids and bases", path: "/acid-base-salts" },
  },
  {
    id: "acid-strength",
    topic: "Acids & Bases",
    title: "Strong does not mean concentrated",
    fact: "Acid strength describes how extensively an acid ionizes; concentration describes how much acid is present per volume.",
    whyItMatters: "A weak acid can be concentrated, and a strong acid can be dilute.",
    misconception: {
      claim: "A concentrated acid must be strong.",
      correction: "Strength and concentration are separate properties—check both the acid's ionization and its amount per volume.",
    },
  },
  {
    id: "neutral-ph",
    topic: "Acids & Bases",
    title: "Neutral always means equal H⁺ and OH⁻",
    fact: "Neutral water has equal hydrogen-ion and hydroxide-ion concentrations.",
    whyItMatters: "At 25 °C this corresponds to pH 7; neutral pH can differ at other temperatures because water's ionization changes.",
    misconception: {
      claim: "Every neutral solution has pH exactly 7.",
      correction: "pH 7 is neutral at 25 °C. Neutrality means [H⁺] = [OH⁻], and the neutral pH depends on temperature.",
    },
  },
  {
    id: "buffers",
    topic: "Acids & Bases",
    title: "Buffers resist—not prevent—pH change",
    fact: "A buffer contains a weak acid/base and its conjugate partner, which can react with small added amounts of acid or base.",
    whyItMatters: "Buffers are important in biology and chemistry, but they have a limited capacity; enough added acid or base overwhelms them.",
    relatedTool: { label: "Study acid-base formulas", path: "/formulas" },
  },
  {
    id: "electrolytes",
    topic: "Electrochemistry",
    title: "Ionic compounds conduct only when their ions can move",
    fact: "Molten salts and salt solutions conduct electricity because their ions are mobile; solid ionic crystals usually do not.",
    whyItMatters: "This is why an electrolyte must have mobile ions for electrolysis to occur.",
    relatedTool: { label: "Explore electrochemistry", path: "/concept-maps" },
  },
  {
    id: "anode-cathode",
    topic: "Electrochemistry",
    title: "The anode is always where oxidation happens",
    fact: "Oxidation occurs at the anode; reduction occurs at the cathode—in both galvanic and electrolytic cells.",
    whyItMatters: "The electrode signs change between cell types: galvanic anodes are negative, electrolytic anodes are positive.",
    misconception: {
      claim: "The anode is always positive.",
      correction: "Remember the reaction, not the sign: anode = oxidation and cathode = reduction.",
    },
    relatedTool: { label: "View the electrochemistry maps", path: "/concept-maps" },
  },
  {
    id: "redox-agents",
    topic: "Electrochemistry",
    title: "The oxidizing agent is the one that gets reduced",
    fact: "An oxidizing agent accepts electrons from another species; a reducing agent donates electrons.",
    whyItMatters: "The names describe what the agents do to the other reactant, not what happens to the agents themselves.",
    misconception: {
      claim: "An oxidizing agent is oxidized.",
      correction: "The oxidizing agent gains electrons and is reduced; the reducing agent loses electrons and is oxidized.",
    },
    relatedTool: { label: "Balance a redox equation", path: "/redox" },
  },
  {
    id: "salt-bridge",
    topic: "Electrochemistry",
    title: "A salt bridge keeps a galvanic cell running",
    fact: "Ions move through the salt bridge to prevent charge from building up in either half-cell.",
    whyItMatters: "The wire carries electrons; the salt bridge allows ions to move and completes the internal circuit.",
    relatedTool: { label: "Learn cell diagrams", path: "/concept-maps" },
  },
  {
    id: "enthalpy-sign",
    topic: "Energy & Thermochemistry",
    title: "Exothermic reactions warm the surroundings",
    fact: "For an exothermic process, the reacting system releases heat and its enthalpy change is negative (ΔH < 0).",
    whyItMatters: "The measured surroundings may warm even though the system loses energy as heat.",
    misconception: {
      claim: "A negative ΔH means the surroundings get colder.",
      correction: "Negative ΔH means the system releases heat to its surroundings, which usually warm up.",
    },
  },
  {
    id: "enzymes",
    topic: "Energy & Thermochemistry",
    title: "Enzymes are biological catalysts",
    fact: "Enzymes speed up specific reactions by lowering activation energy, and they are not used up in the overall reaction.",
    whyItMatters: "Their shape and chemical environment affect activity, which is why temperature and pH can change how well an enzyme works.",
  },
  {
    id: "rust",
    topic: "Electrochemistry",
    title: "Rusting is an electrochemical process",
    fact: "Iron corrosion involves electron transfer and usually needs both oxygen and water; salts can speed it up by helping ions move.",
    whyItMatters: "Paint, oil, and protective metal coatings slow corrosion by limiting contact or providing a sacrificial metal.",
  },
  {
    id: "acid-safety",
    topic: "Lab Safety",
    title: "Always add acid to water",
    fact: "Diluting concentrated acid releases heat. Add acid slowly to water while stirring and wearing proper protective equipment.",
    whyItMatters: "Adding water to concentrated acid can heat a small surface layer rapidly and cause splashing.",
  },
  {
    id: "lab-tasting",
    topic: "Lab Safety",
    title: "Never taste a laboratory chemical",
    fact: "A substance's appearance or smell cannot establish that it is safe.",
    whyItMatters: "Use only teacher-approved tests and follow lab instructions; never taste chemicals or smell them directly.",
  },
];

export function getDailyChemistryFact(date = new Date()): ChemistryFact {
  const firstDay = Date.UTC(date.getUTCFullYear(), 0, 1);
  const currentDay = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dayOfYear = Math.floor((currentDay - firstDay) / 86_400_000);
  return CHEMISTRY_FACTS[dayOfYear % CHEMISTRY_FACTS.length];
}
