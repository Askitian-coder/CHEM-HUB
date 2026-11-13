import { describe, expect, it } from "vitest";
import { getRecentStudyDays, getStudyStreak, getStudyDateOffset } from "./studyProgress";

describe("study progress dates", () => {
  const now = new Date("2026-11-13T20:00:00.000Z");

  it("counts a streak through today and consecutive prior days", () => {
    expect(getStudyStreak(["2026-11-13", "2026-11-12", "2026-11-11"], now)).toBe(3);
  });

  it("keeps yesterday's streak alive until today's study session", () => {
    expect(getStudyStreak(["2026-11-12", "2026-11-11"], now)).toBe(2);
  });

  it("resets the streak when both today and yesterday are missing", () => {
    expect(getStudyStreak(["2026-11-10"], now)).toBe(0);
  });

  it("counts distinct study days in the last seven UTC dates", () => {
    expect(getRecentStudyDays(["2026-11-13", "2026-11-11", "2026-11-07", "2026-11-06"], now)).toBe(3);
  });

  it("calculates a study date's offset from today in UTC", () => {
    expect(getStudyDateOffset("2026-11-11", now)).toBe(2);
  });
});
