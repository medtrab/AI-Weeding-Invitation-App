export default function LandingPage() {
  return (
    <main>
      <section className="min-h-screen flex flex-col items-center justify-center bg-deep text-cream text-center px-6">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold mb-6">AI-Powered Event Invitations</p>
        <h1 className="font-cormorant text-[clamp(3rem,7vw,6rem)] font-light leading-tight mb-6">
          Invitations that<br /><em className="italic text-gold">move hearts</em>
        </h1>
        <p className="text-sm text-cream/50 max-w-md mb-10 leading-relaxed">
          Generate breathtaking, personalized event invitations with AI. Every detail crafted for your most memorable moments.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a href="/dashboard" className="px-8 py-4 bg-gold text-deep text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold-light transition-colors">
            Create Your Invitation
          </a>
          <a href="/login" className="px-8 py-4 border border-cream/20 text-cream text-xs uppercase tracking-[0.2em] hover:border-gold hover:text-gold transition-colors">
            Sign In
          </a>
        </div>
      </section>
    </main>
  );
}
