import { getElementBySymbol } from "../data/elements";

export interface ParsedElement {
  symbol: string;
  count: number;
}

const subscripts: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
};

const normalizeFormula = (formula: string) =>
  formula
    .replace(/[₀-₉]/g, (digit) => subscripts[digit])
    .replace(/\s/g, "");

function readNumber(source: string, start: number) {
  let end = start;
  while (end < source.length && /\d/.test(source[end])) end += 1;
  return end === start ? { value: 1, end } : { value: Number(source.slice(start, end)), end };
}

function addCounts(target: Map<string, number>, source: Map<string, number>, multiplier: number) {
  for (const [symbol, count] of source) {
    target.set(symbol, (target.get(symbol) ?? 0) + count * multiplier);
  }
}

function parseSegment(segment: string): Map<string, number> {
  const counts = new Map<string, number>();
  let index = 0;

  const parseSequence = (expectedClose?: string): Map<string, number> => {
    const result = new Map<string, number>();
    let hasTerm = false;

    while (index < segment.length) {
      const character = segment[index];

      if (character === ")" || character === "]") {
        if (character !== expectedClose) {
          throw new Error("Unbalanced brackets in chemical formula.");
        }
        if (!hasTerm) throw new Error("Empty groups are not valid in a chemical formula.");
        index += 1;
        return result;
      }

      if (character === "(" || character === "[") {
        const closing = character === "(" ? ")" : "]";
        index += 1;
        const group = parseSequence(closing);
        const { value: multiplier, end } = readNumber(segment, index);
        index = end;
        addCounts(result, group, multiplier);
        hasTerm = true;
        continue;
      }

      if (/\d/.test(character)) {
        if (!hasTerm) {
          throw new Error("A number must follow an element or group.");
        }
        throw new Error("A number must follow an element or group.");
      }

      if (!/[a-z]/i.test(character)) {
        throw new Error(`Unexpected character "${character}" in chemical formula.`);
      }

      const twoLetter = segment.slice(index, index + 2);
      const singleElement = getElementBySymbol(character);
      const nextCharacter = segment[index + 1];
      const nextIsUppercase = nextCharacter !== undefined && nextCharacter === nextCharacter.toUpperCase();
      const nextElement = nextCharacter ? getElementBySymbol(nextCharacter) : undefined;
      const twoLetterElement = twoLetter.length === 2 ? getElementBySymbol(twoLetter) : undefined;
      const preferSingleLetters = nextIsUppercase && singleElement !== undefined && nextElement !== undefined;
      const element = twoLetterElement && !preferSingleLetters ? twoLetterElement : singleElement;
      const symbolLength = element === twoLetterElement && !preferSingleLetters ? 2 : 1;
      if (!element) {
        const unknown = twoLetter.length === 2 ? twoLetter : character;
        const displaySymbol = unknown[0].toUpperCase() + unknown.slice(1).toLowerCase();
        throw new Error(`Unknown element: ${displaySymbol}`);
      }

      index += symbolLength;
      const { value: multiplier, end } = readNumber(segment, index);
      index = end;
      result.set(element.symbol, (result.get(element.symbol) ?? 0) + multiplier);
      hasTerm = true;
    }

    if (expectedClose) throw new Error("Unbalanced brackets in chemical formula.");
    if (!hasTerm) throw new Error("Empty formula segment.");
    return result;
  };

  const parsed = parseSequence();
  addCounts(counts, parsed, 1);
  return counts;
}

export function parseFormula(formula: string): ParsedElement[] {
  const normalized = normalizeFormula(formula);
  if (!normalized) throw new Error("Formula cannot be empty.");

  const segments = normalized.split(/[·.]/);
  const totals = new Map<string, number>();

  segments.forEach((segment, segmentIndex) => {
    if (!segment) throw new Error("A hydrate separator must have a formula on both sides.");

    let multiplier = 1;
    let body = segment;
    if (/^\d/.test(body)) {
      if (segmentIndex === 0) throw new Error("A number must follow an element or group.");
      const coefficient = readNumber(body, 0);
      multiplier = coefficient.value;
      body = body.slice(coefficient.end);
      if (!body) throw new Error("A hydrate multiplier must be followed by a formula.");
    }

    addCounts(totals, parseSegment(body), multiplier);
  });

  return Array.from(totals, ([symbol, count]) => ({ symbol, count }));
}

export function computeMolarMass(formula: string): number {
  const mass = parseFormula(formula).reduce((total, { symbol, count }) => {
    const element = getElementBySymbol(symbol);
    if (!element) throw new Error(`Unknown element: ${symbol}`);
    return total + element.atomicMass * count;
  }, 0);
  return Number(mass.toFixed(2));
}
