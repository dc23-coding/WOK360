import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useSupabaseAuth } from "../context/ClerkAuthContext";
import { assignPersonalCode } from "../lib/zoneAccessControl";

export default function SignUpForm({ onSuccess, signupZone = "kazmo-mansion" }) {
  const { signUp, isLoaded } = useSignUp();
  const { supabase } = useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [personalCode, setPersonalCode] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setError("");
    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setError("");
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      
      if (result.status === "complete") {
        await signUp.setActive({ session: result.createdSessionId });
        
        // Assign personal code with user email
        const userId = result.createdUserId;
        if (userId) {
          const codeResult = await assignPersonalCode(supabase, userId, signupZone, email);
          if (codeResult.success) {
            setPersonalCode(codeResult.personalCode);
            setTimeout(() => onSuccess?.(), 3000);
          } else {
            onSuccess?.();
          }
        }
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    
    setError("");
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + "/sso-callback",
        redirectUrlComplete: window.location.origin + "/",
      });
    } catch (err) {
      setError(err.errors?.[0]?.message || "Google sign up failed");
    }
  };

  return (
    <div className="space-y-3 text-left">
      {personalCode ? (
        // Show personal code after successful signup
        <div className="p-4 rounded-lg bg-amber-500/20 border border-amber-400/50 text-center">
          <p className="text-amber-100 text-xs mb-2">Account created! Your personal access code:</p>
          <div className="text-2xl font-bold text-amber-300 tracking-wider mb-2">
            {personalCode}
          </div>
          <p className="text-[10px] text-amber-200/70">
            Save this code! Use it as a quick login shortcut.
          </p>
        </div>
      ) : verifying ? (
        // Verification code form
        <form onSubmit={handleVerify} className="space-y-3">
          <p className="text-xs text-amber-100 mb-2">Enter the verification code sent to your email:</p>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-amber-200/40 text-amber-50 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300 text-center tracking-widest"
          />
          {error && (
            <p className="text-[10px] text-red-300/90 leading-snug">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !isLoaded}
            className="w-full mt-1 rounded-full bg-amber-400 text-black text-xs font-semibold py-1.5 shadow-[0_0_22px_rgba(252,211,77,0.9)] hover:bg-amber-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      ) : (
        // Initial signup form
        <form onSubmit={handleSubmit} className="space-y-3">
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
            {loading ? "Creating account..." : "Create account"}
          </button>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={!isLoaded}
            className="w-full mt-1 rounded-full border border-amber-300/80 text-amber-100 text-[11px] py-1.5 hover:bg-amber-100/10 transition disabled:opacity-60"
          >
            🔐 Continue with Google
          </button>
        </form>
      )}
    </div>
  );
}
