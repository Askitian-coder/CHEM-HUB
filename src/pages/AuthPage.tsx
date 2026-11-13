import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ToolPage from "../components/ToolPage";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../lib/supabase";
import { getAuthErrorMessage } from "../lib/authErrors";

interface AuthPageProps {
  mode: "login" | "signup";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { user, loading, error: sessionError, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [loading, navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setNeedsConfirmation(false);

    if (!supabase) {
      setError("Authentication is not configured yet.");
      return;
    }
    if (isSignup && password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        const redirectTo = new URL(import.meta.env.BASE_URL, window.location.origin).toString();
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });
        if (signupError) {
          setError(getAuthErrorMessage(signupError));
        } else if (data.session) {
          navigate("/", { replace: true });
        } else {
          setMessage("Account created. Check your email to confirm your address, then sign in.");
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          const confirmationRequired = loginError.code === "email_not_confirmed"
            || loginError.message.toLowerCase().includes("email not confirmed");
          setNeedsConfirmation(confirmationRequired);
          setError(confirmationRequired
            ? "Confirm your email address before signing in. Check your inbox, or request a new confirmation email below."
            : loginError.message);
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "The request could not be completed.");
    } finally {
      setSubmitting(false);
    }
  };

  const resendConfirmation = async () => {
    if (!supabase) {
      setError("Authentication is not configured yet.");
      return;
    }

    setError("");
    setMessage("");
    setResendingConfirmation(true);
    try {
      const emailRedirectTo = new URL(import.meta.env.BASE_URL, window.location.origin).toString();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo },
      });
      if (resendError) {
        setError(getAuthErrorMessage(resendError));
      } else {
        setMessage("Confirmation email sent. Check your inbox and spam folder.");
        setNeedsConfirmation(false);
      }
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Could not resend the confirmation email.");
    } finally {
      setResendingConfirmation(false);
    }
  };

  return (
    <ToolPage
      eyebrow="Your ChemHub account"
      title={isSignup ? "Create your account" : "Welcome back"}
      description={isSignup
        ? "Create a secure ChemHub account to get started."
        : "Sign in to continue your chemistry study journey."}
    >
      {!configured && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          <p className="font-bold">Account sign-in needs setup</p>
          <p className="mt-1">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your local environment.
            See <code>supabase/README.md</code> for setup instructions. Never put a service-role key in the browser.
          </p>
        </div>
      )}
      {sessionError && (
        <p role="alert" className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
          Could not load the current session: {sessionError}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="auth-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email address</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setNeedsConfirmation(false);
              setMessage("");
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
        <div>
          <label htmlFor="auth-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-3 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {isSignup && (
          <div>
            <label htmlFor="auth-confirm-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm password</label>
            <div className="relative">
              <input
                id="auth-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                aria-pressed={showConfirmPassword}
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                className="absolute inset-y-0 right-3 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}
        {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
        {needsConfirmation && (
          <button
            type="button"
            onClick={resendConfirmation}
            disabled={resendingConfirmation || !email}
            className="w-full rounded-xl border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resendingConfirmation ? "Sending confirmation…" : "Resend confirmation email"}
          </button>
        )}
        {message && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
        <button
          type="submit"
          disabled={submitting || !configured}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Please wait…" : !configured ? "Connect Supabase to continue" : isSignup ? "Create account" : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        {isSignup ? "Already have an account?" : "New to ChemHub?"}{" "}
        <Link
          to={isSignup ? "/login" : "/signup"}
          className="font-semibold text-indigo-700 hover:text-indigo-900"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Your password is handled by Supabase Authentication and is never stored in ChemHub’s app code.
      </p>
    </ToolPage>
  );
}
