import { createClient } from "npm:@supabase/supabase-js@2";

interface AuthCounts {
  total_accounts: number;
  new_accounts_last_24h: number;
}

function isAuthCounts(value: unknown): value is AuthCounts {
  if (typeof value !== "object" || value === null) return false;
  const counts = value as Record<string, unknown>;
  return Number.isInteger(counts.total_accounts)
    && Number.isInteger(counts.new_accounts_last_24h)
    && Number(counts.total_accounts) >= 0
    && Number(counts.new_accounts_last_24h) >= 0;
}

function matchesSecret(expected: string, provided: string | null): boolean {
  if (!provided || expected.length !== provided.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ provided.charCodeAt(index);
  }
  return difference === 0;
}

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  const cronSecret = Deno.env.get("CHEMHUB_CRON_SECRET");
  if (!cronSecret) return jsonResponse(500, { error: "Report authentication is not configured." });
  if (!matchesSecret(cronSecret, request.headers.get("x-cron-secret"))) {
    return jsonResponse(401, { error: "Unauthorized." });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const reportFrom = Deno.env.get("REPORT_FROM");
  const reportTo = Deno.env.get("REPORT_TO");
  if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !reportFrom || !reportTo) {
    return jsonResponse(500, { error: "The aggregate email report is not fully configured." });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase.rpc("get_daily_auth_counts");
  if (error) {
    console.error("Could not retrieve account aggregates.", error.message);
    return jsonResponse(502, { error: "Could not retrieve account aggregates." });
  }
  if (!isAuthCounts(data)) {
    console.error("The aggregate query returned an invalid result.");
    return jsonResponse(502, { error: "The aggregate query returned an invalid result." });
  }

  const reportDate = new Date().toISOString().slice(0, 10);
  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: reportFrom,
      to: [reportTo],
      subject: `ChemHub daily account summary — ${reportDate}`,
      text: [
        `ChemHub account summary for ${reportDate} (UTC)`,
        "",
        `New accounts in the last 24 hours: ${data.new_accounts_last_24h}`,
        `Total accounts: ${data.total_accounts}`,
        "",
        "This report contains aggregate counts only; it does not include account records or personal information.",
      ].join("\n"),
    }),
  });

  if (!emailResponse.ok) {
    console.error("The email provider rejected the aggregate report.", emailResponse.status);
    return jsonResponse(502, { error: "The email provider rejected the aggregate report." });
  }

  return jsonResponse(200, { sent: true, reportDate });
});
