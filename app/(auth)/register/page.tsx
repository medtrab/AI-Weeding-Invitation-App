"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail); }
      await signIn("credentials", { email, password, redirect: false });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-deep flex items-center justify-center px-4 py-8">
      <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/" className="block text-center mb-8">
          <span className="font-cormorant text-3xl font-light tracking-[0.2em] text-gold uppercase">Invité</span>
        </Link>
        <div className="bg-gradient-to-br from-[#1A160E] to-[#0D0B08] border border-gold/20 p-6 sm:p-8">
          <h1 className="font-cormorant text-2xl font-light text-cream mb-1">Create your account</h1>
          <p className="text-xs text-cream/40 tracking-wide mb-6">Start free — no credit card required</p>
          {error && <div className="mb-4 px-4 py-2.5 border border-red-500/30 bg-red-500/5 text-xs text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name",  value: name,     setValue: setName,     type: "text",     placeholder: "Sofia Leclair",       autoComplete: "name"           },
              { label: "Email",      value: email,    setValue: setEmail,    type: "email",    placeholder: "sofia@example.com",   autoComplete: "email"          },
              { label: "Password",   value: password, setValue: setPassword, type: "password", placeholder: "Min. 8 characters",   autoComplete: "new-password"   },
            ].map(({ label, value, setValue, type, placeholder, autoComplete }) => (
              <div key={label}>
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-1.5">{label}</label>
                <input type={type} value={value} onChange={(e) => setValue(e.target.value)} required
                  autoComplete={autoComplete}
                  className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-base sm:text-sm px-4 py-3 outline-none placeholder:text-cream/20 focus:border-gold/60 transition-colors"
                  placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors disabled:opacity-50 active:scale-[0.98] mt-2">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gold/15" />
            <span className="text-[10px] text-cream/30">or</span>
            <div className="flex-1 h-px bg-gold/15" />
          </div>
          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-3 border border-cream/10 text-xs uppercase tracking-[0.15em] text-cream/50 hover:border-gold/30 hover:text-cream/80 transition-all active:scale-[0.98]">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <p className="text-center text-xs text-cream/30 mt-5">
            Already have an account? <Link href="/login" className="text-gold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
