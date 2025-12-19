import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";

export default function SignInForm({ onSuccess }) {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await signIn.setActive({ session: result.createdSessionId });
        onSuccess?.();
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + "/sso-callback",
        redirectUrlComplete: window.location.origin + "/",
      });
    } catch (err) {
      setError(err.errors?.[0]?.message || "Google sign in failed");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });
      setResetSent(true);
      setShowForgotPassword(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: password, // Using password field for reset code
      });

      if (result.status === "complete") {
        await signIn.setActive({ session: result.createdSessionId });
        onSuccess?.();
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword && resetSent) {
    return (
      <div className="space-y-3 text-left">
        <p className="text-xs text-amber-100 mb-2">
          Check your email for a password reset code, then create a new password.
        </p>
        <form onSubmit={handleResetPassword} className="space-y-3">
          <div>
            <label className="block text-xs text-amber-100 mb-1">Reset Code</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter code from email"
              className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-amber-200/40 text-amber-50 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300"
            />
          </div>

          {error && (
            <p className="text-[10px] text-red-300/90 leading-snug">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !isLoaded}
            className="w-full mt-1 rounded-full bg-amber-400 text-black text-xs font-semibold py-1.5 shadow-[0_0_22px_rgba(252,211,77,0.9)] hover:bg-amber-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(false);
              setResetSent(false);
              setPassword("");
            }}
            className="w-full text-[10px] text-amber-200/70 underline hover:text-amber-100/90"
          >
            Back to Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <div>
        <label className="block text-xs text-amber-100 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-amber-200/40 text-amber-50 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300"
        />
      </div>

      <div>
        <label className="block text-xs text-amber-100 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-amber-200/40 text-amber-50 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300"
        />
      </div>

      {error && (
        <p className="text-[10px] text-red-300/90 leading-snug">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !isLoaded}
        className="w-full mt-1 rounded-full bg-amber-400 text-black text-xs font-semibold py-1.5 shadow-[0_0_22px_rgba(252,211,77,0.9)] hover:bg-amber-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={!isLoaded}
        className="w-full mt-1 rounded-full border border-amber-300/80 text-amber-100 text-[11px] py-1.5 hover:bg-amber-100/10 transition disabled:opacity-60"
      >
        🔐 Continue with Google
      </button>

      <button
        type="button"
        onClick={handleForgotPassword}
        disabled={loading || !isLoaded}
        className="w-full text-[10px] text-amber-200/70 underline hover:text-amber-100/90"
      >
        Forgot password?
      </button>
    </form>
  );
}
