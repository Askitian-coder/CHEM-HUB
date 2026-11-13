export interface AuthErrorLike {
  code?: string;
  message: string;
}

export function getAuthErrorMessage(authError: AuthErrorLike): string {
  const isEmailRateLimit = authError.code === "over_email_send_rate_limit"
    || /email.{0,30}rate.?limit|rate.?limit.{0,30}email/i.test(authError.message);
  return isEmailRateLimit
    ? "Too many confirmation emails have been requested. Please wait a while before trying again."
    : authError.message;
}
