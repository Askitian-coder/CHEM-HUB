import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "./authErrors";

describe("getAuthErrorMessage", () => {
  it("explains Supabase email rate limits in student-friendly language", () => {
    expect(getAuthErrorMessage({
      code: "over_email_send_rate_limit",
      message: "Email rate limit exceeded",
    })).toMatch(/wait a while/i);
  });

  it("preserves unrelated authentication errors", () => {
    expect(getAuthErrorMessage({ message: "Invalid login credentials" }))
      .toBe("Invalid login credentials");
  });
});
