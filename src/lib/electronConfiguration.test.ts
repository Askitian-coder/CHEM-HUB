import { describe, expect, it } from "vitest";
import { getElectronConfiguration } from "./electronConfiguration";

describe("electron configurations", () => {
  it("accepts symbols and atomic numbers", () => {
    expect(getElectronConfiguration("o")).toMatchObject({
      atomicNumber: 8,
      symbol: "O",
      configuration: "1s² 2s² 2p⁴",
      shorthand: "[He] 2s² 2p⁴",
    });
    expect(getElectronConfiguration("26").symbol).toBe("Fe");
  });

  it.each([
    ["Cr", "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹"],
    ["Cu", "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹"],
  ])("uses the observed full transition-metal configuration for %s", (symbol, expected) => {
    expect(getElectronConfiguration(symbol).configuration).toBe(expected);
  });

  it("rejects empty, unknown, and out-of-range elements", () => {
    for (const value of ["", "Xx", "0", "37", "1.5"]) {
      expect(() => getElectronConfiguration(value)).toThrow(/element from 1 to 36/i);
    }
  });
});
