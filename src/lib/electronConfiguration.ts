const SYMBOLS = [
  "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar",
  "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr",
];

const FILL_ORDER: Array<[string, number]> = [
  ["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2], ["3d", 10], ["4p", 6],
];
const DISPLAY_ORDER = ["1s", "2s", "2p", "3s", "3p", "3d", "4s", "4p"];
const EXCEPTIONS: Record<number, Record<string, number>> = {
  24: { "3d": 5, "4s": 1 },
  29: { "3d": 10, "4s": 1 },
};
const NOBLE_GASES = [{ number: 36, symbol: "Kr" }, { number: 18, symbol: "Ar" }, { number: 10, symbol: "Ne" }, { number: 2, symbol: "He" }];
const SUPERSCRIPTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

export interface ElectronConfiguration {
  atomicNumber: number;
  symbol: string;
  configuration: string;
  shorthand: string;
  orbitals: Array<{ subshell: string; electrons: number }>;
}

function fillElectrons(atomicNumber: number): Record<string, number> {
  const fill: Record<string, number> = {};
  let remaining = atomicNumber;
  for (const [subshell, capacity] of FILL_ORDER) {
    if (remaining === 0) break;
    const electrons = Math.min(capacity, remaining);
    fill[subshell] = electrons;
    remaining -= electrons;
  }
  Object.assign(fill, EXCEPTIONS[atomicNumber]);
  return fill;
}

function formatSubshell(subshell: string, electrons: number): string {
  const exponent = String(electrons).replace(/\d/g, (digit) => SUPERSCRIPTS[Number(digit)]);
  return `${subshell}${exponent}`;
}

export function getElectronConfiguration(value: string): ElectronConfiguration {
  const input = value.trim();
  const atomicNumber = /^\d+$/.test(input)
    ? Number(input)
    : SYMBOLS.indexOf(input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()) + 1;
  if (!input || !Number.isInteger(atomicNumber) || atomicNumber < 1 || atomicNumber > 36) {
    throw new Error("Enter an element from 1 to 36, such as Fe or 26.");
  }

  const fill = fillElectrons(atomicNumber);
  const orbitals = DISPLAY_ORDER
    .filter((subshell) => fill[subshell] !== undefined)
    .map((subshell) => ({ subshell, electrons: fill[subshell] }));
  const core = NOBLE_GASES.find(({ number }) => number < atomicNumber);
  const coreFill = core ? fillElectrons(core.number) : {};
  const shorthand = core
    ? `[${core.symbol}] ${DISPLAY_ORDER
        .filter((subshell) => fill[subshell] !== undefined && fill[subshell] !== coreFill[subshell])
        .map((subshell) => formatSubshell(subshell, fill[subshell]))
        .join(" ")}`
    : "";

  return {
    atomicNumber,
    symbol: SYMBOLS[atomicNumber - 1],
    configuration: orbitals.map(({ subshell, electrons }) => formatSubshell(subshell, electrons)).join(" "),
    shorthand,
    orbitals,
  };
}
