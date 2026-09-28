import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted">
          BrandMind uses account and workspace information to provide
          authenticated team memory, experiment retention, and workspace
          collaboration. Workspace data is scoped to its authorized members.
        </p>
      </div>
    </main>
  );
}
