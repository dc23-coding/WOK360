import { useState } from "react";
import { useSupabaseAuth } from "../context/SupabaseAuthContext";
// optional: import { generateUserCode } from "../utils/generateUserCode";

export default function SignUpForm({ onSuccess }) {
  const { signUpWithEmail, signInWithGoogle } = useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Example: you can generate a per-user code here later
    // const houseCode = generateUserCode(8);

    const { error } = await signUpWithEmail(email.trim(), password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      onSuccess?.();
    }
  };

  const handleGoogle = async () => {
    setError("");
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

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
        disabled={loading}
        className="w-full mt-1 rounded-full bg-amber-400 text-black text-xs font-semibold py-1.5 shadow-[0_0_22px_rgba(252,211,77,0.9)] hover:bg-amber-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full mt-1 rounded-full border border-amber-300/80 text-amber-100 text-[11px] py-1.5 hover:bg-amber-100/10 transition"
      >
        Continue with Google
      </button>
    </form>
  );
}
