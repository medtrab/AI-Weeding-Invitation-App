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
    <div className="min-h-screen bg-deep flex items-center justify-center px-6 py-12">
      <motion.div className="w-full max-w-md" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}>
        <Link href="/" className="block text-center mb-10">
          <span className="font-cormorant text-3xl font-light tracking-[0.2em] text-gold uppercase">Invité</span>
        </Link>
        <div className="bg-gradient-to-br from-[#1A160E] to-[#0D0B08] border border-gold/20 p-8">
          <h1 className="font-cormorant text-2xl font-light text-cream mb-1">Create your account</h1>
          <p className="text-xs text-cream/40 tracking-wide mb-6">Start free — no credit card required</p>
          {error && <div className="mb-4 px-4 py-2.5 border border-red-500/30 bg-red-500/5 text-xs text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label:"Full Name", value:name, setValue:setName, type:"text", placeholder:"Sofia Leclair" },
              { label:"Email", value:email, setValue:setEmail, type:"email", placeholder:"sofia@example.com" },
              { label:"Password", value:password, setValue:setPassword, type:"password", placeholder:"Min. 8 characters" },
            ].map(({ label, value, setValue, type, placeholder }) => (
              <div key={label}>
                <label className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-1.5">{label}</label>
                <input type={type} value={value} onChange={(e) => setValue(e.target.value)} required
                  className="w-full bg-gold/[0.04] border border-gold/20 text-cream text-sm px-4 py-3 outline-none placeholder:text-cream/20 focus:border-gold/60"
                  placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors disabled:opacity-50 mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-xs text-cream/30 mt-6">
            Already have an account? <Link href="/login" className="text-gold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
