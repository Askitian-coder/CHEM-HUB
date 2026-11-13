import redoxImage from "../assets/concept-maps/redox-reaction.jpeg";
import galvanicImage from "../assets/concept-maps/galvanic-cell.jpeg";
import electrolyticImage from "../assets/concept-maps/electrolytic-cell.jpeg";
import applicationsImage from "../assets/concept-maps/electrochemical-applications.jpeg";
import indicatorsImage from "../assets/concept-maps/acid-base-indicators.jpeg";
import acidsBasesImage from "../assets/concept-maps/acids-bases-salts.jpeg";

export type ConceptMapTopic = "Electrochemistry" | "Acids, bases & salts";

export interface ConceptMap {
  id: string;
  title: string;
  topic: ConceptMapTopic;
  description: string;
  image: string;
  imageAlt: string;
  sections: {
    heading: string;
    points: string[];
  }[];
  relatedLinks: {
    label: string;
    to: string;
  }[];
}

export const CONCEPT_MAPS: ConceptMap[] = [
  {
    id: "redox",
    title: "Oxidation and reduction",
    topic: "Electrochemistry",
    description: "Redox reactions transfer electrons and always pair oxidation with reduction.",
    image: redoxImage,
    imageAlt: "Concept map comparing oxidation and reduction by electron, oxygen, hydrogen, and oxidation-state changes.",
    sections: [
      {
        heading: "How to recognize each process",
        points: [
          "Oxidation is loss of electrons, gain of oxygen, loss of hydrogen, or an increase in oxidation number.",
          "Reduction is gain of electrons, loss of oxygen, gain of hydrogen, or a decrease in oxidation number.",
          "Oxidation and reduction happen together: electrons lost by one species are gained by another.",
        ],
      },
      {
        heading: "Agents and common tests",
        points: [
          "An oxidizing agent makes another species oxidize and is itself reduced. Potassium manganate(VII) and potassium dichromate(VI) are common oxidizing agents.",
          "A reducing agent makes another species reduce and is itself oxidized. Hydrogen, carbon, and carbon monoxide can act as reducing agents.",
          "Acidified dichromate changes from orange to green when reduced; aqueous iodide can change from colorless to brown when oxidized.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Balance a redox reaction", to: "/redox" },
      { label: "Calculate oxidation numbers", to: "/oxidation-numbers" },
    ],
  },
  {
    id: "galvanic-cells",
    title: "Galvanic (voltaic) cells",
    topic: "Electrochemistry",
    description: "A spontaneous redox reaction can drive electron flow through an external circuit.",
    image: galvanicImage,
    imageAlt: "Concept map of a galvanic cell, salt bridge, cell notation, standard electrode potentials, and spontaneity.",
    sections: [
      {
        heading: "Cell parts and electron flow",
        points: [
          "Two half-cells contain the oxidation and reduction half-reactions; electrons travel through the wire from the anode to the cathode.",
          "A salt bridge completes the circuit and keeps each half-cell close to electrically neutral as ions move.",
          "A cell can be shown as a diagram or written as cell notation, with the anode on the left and cathode on the right.",
        ],
      },
      {
        heading: "Using standard reduction potentials",
        points: [
          "Standard electrode potentials are measured relative to the standard hydrogen electrode (SHE).",
          "A more positive reduction potential means reduction is more favorable and the species is a stronger oxidizing agent.",
          "A more negative reduction potential means the reverse oxidation is more favorable; the reduced form is a stronger reducing agent.",
          "E°cell = E°cathode − E°anode. A positive E°cell predicts a spontaneous reaction under standard conditions.",
        ],
      },
    ],
    relatedLinks: [{ label: "Review redox and oxidation states", to: "/oxidation-numbers" }],
  },
  {
    id: "electrolytic-cells",
    title: "Electrolytic cells",
    topic: "Electrochemistry",
    description: "Electrical energy drives a non-spontaneous chemical reaction in electrolysis.",
    image: electrolyticImage,
    imageAlt: "Concept map showing electrolysis, molten salts and aqueous solutions, electrode reactions, and Faraday's laws.",
    sections: [
      {
        heading: "Electrolysis and electrodes",
        points: [
          "An electrolytic cell uses an external power source to drive a reaction that is not spontaneous on its own.",
          "The electrolyte must contain mobile ions, usually in a molten ionic compound or an aqueous solution.",
          "Oxidation always occurs at the anode; in an electrolytic cell the anode is positive. Reduction always occurs at the cathode; here the cathode is negative.",
          "Cations move toward the cathode and gain electrons; anions move toward the anode and lose electrons.",
        ],
      },
      {
        heading: "Charge and amount of product",
        points: [
          "The charge passed is Q = It, where I is current in amperes and t is time in seconds.",
          "One mole of electrons carries the Faraday constant, about 96,485 C/mol e⁻ (often rounded to 96,500 C/mol).",
          "Use the balanced half-reaction to relate electron moles to product moles: n(e⁻) = Q/F.",
          "Electrolysis is used in processes such as metal extraction, electroplating, and producing useful chemicals.",
        ],
      },
    ],
    relatedLinks: [{ label: "Practice balancing redox equations", to: "/redox" }],
  },
  {
    id: "electrochemical-applications",
    title: "Electrochemical reactions in everyday life",
    topic: "Electrochemistry",
    description: "Redox chemistry connects batteries and metal production with processes in living things.",
    image: applicationsImage,
    imageAlt: "Concept map connecting electrochemical redox reactions to smelting, metabolism, photosynthesis, combustion, batteries, electrolysis, and galvanization.",
    sections: [
      {
        heading: "Biology and combustion",
        points: [
          "Cellular respiration transfers electrons as glucose reacts with oxygen, releasing usable energy and forming carbon dioxide and water.",
          "Photosynthesis uses light energy to drive electron transfer as carbon dioxide and water form glucose and oxygen.",
          "Combustion is a rapid oxidation reaction. Enough oxygen is needed for complete combustion; limited oxygen can produce carbon monoxide.",
        ],
      },
      {
        heading: "Industry and technology",
        points: [
          "Smelting extracts metals from ores; unwanted rocky material called gangue is separated during processing.",
          "Batteries turn spontaneous redox reactions into electrical energy; electrolysis uses electricity to cause chemical change.",
          "Galvanization protects iron or steel by coating it with zinc, which oxidizes preferentially if the coating is scratched.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Explore the Periodic Table", to: "/periodic-table" },
      { label: "Review electrolysis calculations", to: "/formulas" },
    ],
  },
  {
    id: "acid-base-indicators",
    title: "Acids, bases, pH, and indicators",
    topic: "Acids, bases & salts",
    description: "Acid-base behavior can be described by proton transfer and tested with indicators.",
    image: indicatorsImage,
    imageAlt: "Concept map classifying aqueous solutions by proton transfer, pH, litmus, universal indicator, and red-cabbage indicator.",
    sections: [
      {
        heading: "The proton-transfer model",
        points: [
          "A Brønsted–Lowry acid donates a proton (H⁺); a Brønsted–Lowry base accepts a proton.",
          "In water, acids increase hydronium (H₃O⁺); bases remove H⁺ from water or increase hydroxide (OH⁻).",
          "At about 25 °C, pH below 7 is acidic, pH 7 is neutral, and pH above 7 is basic for ordinary dilute aqueous solutions.",
        ],
      },
      {
        heading: "Testing safely",
        points: [
          "Litmus turns red in acid and blue in base. Universal indicator shows a range of colors; neutral solutions are usually green.",
          "Red-cabbage juice is a natural indicator: it tends toward red or pink in acids and blue, green, or yellow in bases, depending on pH.",
          "The concept map mentions sour and bitter tastes as traditional descriptions. Never taste laboratory chemicals; use indicators and follow lab safety rules.",
        ],
      },
    ],
    relatedLinks: [{ label: "Identify an acid, base, or salt", to: "/acid-base-salts" }],
  },
  {
    id: "acids-bases-salts",
    title: "Acids, bases, strengths, and salts",
    topic: "Acids, bases & salts",
    description: "Compare acid and base strength, learn common reactions, and predict whether a salt dissolves.",
    image: acidsBasesImage,
    imageAlt: "Hand-drawn concept map of acid and base strength, indicators, reactions, salts, and solubility.",
    sections: [
      {
        heading: "Strength is not concentration",
        points: [
          "A strong acid ionizes almost completely in water; a weak acid ionizes only partly. Hydrochloric and nitric acids are common strong acids; acetic, citric, and ascorbic acids are weak acids.",
          "A concentrated solution contains a lot of solute per volume; a dilute solution contains less. Concentration and strength describe different things.",
          "Strong soluble bases include sodium hydroxide and potassium hydroxide. Ammonia is a common weak base.",
          "Many metal oxides and hydroxides are poorly soluble. Group 1 hydroxides are soluble, while some compounds such as zinc oxide and aluminum hydroxide are amphoteric.",
        ],
      },
      {
        heading: "Acid reactions and salt formation",
        points: [
          "Acid + base → salt + water (neutralization).",
          "Acid + carbonate → salt + water + carbon dioxide.",
          "Acid + a sufficiently reactive metal → salt + hydrogen gas.",
          "A salt is an ionic compound in which the replaceable hydrogen of an acid has been replaced by a metal ion or ammonium (NH₄⁺). Examples include table salt NaCl, fertilizer ammonium nitrate NH₄NO₃, and Epsom salt MgSO₄.",
        ],
      },
      {
        heading: "Useful solubility patterns",
        points: [
          "All nitrates, Group 1 salts, and ammonium salts are soluble in water.",
          "Most chlorides are soluble, with important exceptions such as silver chloride; most sulfates are soluble, but barium sulfate is insoluble.",
          "Most carbonates are insoluble unless they contain a Group 1 ion or ammonium.",
          "Mixing solutions can form an insoluble precipitate, such as AgCl or BaSO₄.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Try the acid/base/salt determiner", to: "/acid-base-salts" },
      { label: "Search chemistry formulas", to: "/formulas" },
    ],
  },
];
