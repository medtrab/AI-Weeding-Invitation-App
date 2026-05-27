"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const result = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/dashboard" });
    if (result?.error) { setError("Invalid email or password"); setLoading(false); }
    else router.push("/dashboard");
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/dashboard" });

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center px-6">
      <motion.div className="w-full max-w-md" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}>
        <Link href="/" className="block text-center mb-10">
          <span className="font-cormorant text-3xl font-light tracking-[0.2em] text-gold uppercase">Invité</span>
        </Link>
        <div className="bg-gradient-to-br from-[#1A160E] to-[#0D0B08] border border-gold/20 p-8">
          <h1 className="font-cormorant text-2xl font-light text-cream mb-1">Welcome back</h1>
          <p className="text-xs text-cream/40 tracking-wide mb-6">Sign in to manage your invitations</p>
          {error && <div className="mb-4 px-4 py-2.5 border border-red-500/30 bg-red-500/5 text-xs text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-gold/[0.04] border border-gold/20 text-cream font-jost text-sm px-4 py-3 outline-none placeholder:text-cream/20 focus:border-gold/60 transition-colors"
                placeholder="your@email.com" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-gold/[0.04] border border-gold/20 text-cream font-jost text-sm px-4 py-3 outline-none placeholder:text-cream/20 focus:border-gold/60 transition-colors"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors disabled:opacity-50 mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gold/15" />
            <span className="text-[10px] text-cream/30">or</span>
            <div className="flex-1 h-px bg-gold/15" />
          </div>
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 border border-cream/10 text-xs uppercase tracking-[0.15em] text-cream/50 hover:border-gold/30 hover:text-cream/80 transition-all">
            Continue with Google
          </button>
          <p className="text-center text-xs text-cream/30 mt-6">
            No account? <Link href="/register" className="text-gold hover:underline">Create one free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
