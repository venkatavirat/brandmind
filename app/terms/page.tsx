import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-16 text-foreground sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground"
        >
          BrandMind / Back to workspace
        </Link>
        <h1 className="mt-12 font-display text-5xl font-normal tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted">
          BrandMind is a collaborative marketing experiment memory workspace.
          Use it responsibly, keep credentials private, and only store
          information your team is authorized to use.
        </p>
      </div>
    </main>
  );
}
