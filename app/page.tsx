"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/immutability, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars */
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import AuthModal from "@/app/components/AuthModal";
import ThemeToggle from "@/app/components/ThemeToggle";
import WorkspaceSelector from "@/app/components/WorkspaceSelector";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type {
  EvaluationResponse,
  MarketingExperiment,
} from "@/types/experiment";
import type { BrandProfile, Workspace, WorkspaceMember } from "@/types/workspace";

type Tab = "brand" | "evaluator" | "outcome" | "timeline";
type Draft = Omit<MarketingExperiment, "id" | "created_at"> & {
  created_at?: string;
};
type Notice = { type: "success" | "error"; message: string } | null;
const empty: Draft = {
  objective: "",
  hypothesis: "",
  audience: "",
  strategy_used: "",
  variables: [],
  result_metrics: "",
  audience_reaction: "",
  outcome_status: "INCONCLUSIVE",
  interpretation: "",
  learning: "",
};
const tabs: { id: Tab; label: string }[] = [
  { id: "brand", label: "Brand & Strategy" },
  { id: "evaluator", label: "Evaluator & Review" },
  { id: "outcome", label: "Outcome & Audience Logger" },
  { id: "timeline", label: "Memory Timeline" },
];
const metrics = ["CAC", "ROAS", "CTR", "Retention"];
const ease = [0.16, 1, 0.3, 1] as const;
const vt = { duration: 0.25, ease };
function Logo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#09090B] text-white">
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4"
        role="img"
        aria-label="BrandMind mark"
      >
        <path
          d="M2 2h4v4H2zM10 2h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4zM6 4h4M6 12h4M4 6v4M12 6v4"
          fill="none"
          stroke="currentColor"
        />
      </svg>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  const c =
    "w-full rounded border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2";
  return (
    <label className="block text-sm font-medium text-zinc-950">
      {label}
      {multiline ? (
        <textarea
          required
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${c} mt-2 resize-none`}
        />
      ) : (
        <input
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${c} mt-2`}
        />
      )}
    </label>
  );
}
function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-5 py-6 text-xs text-zinc-500 sm:px-8">
      <div className="mx-auto flex max-w-7xl justify-between gap-4">
        <span>BrandMind Engine v3.0 · © 2026</span>
        <span className="flex gap-5">
          <a href="/terms" className="hover:text-zinc-950 hover:underline">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:text-zinc-950 hover:underline">
            Privacy Policy
          </a>
        </span>
      </div>
    </footer>
  );
}
function Landing({ openAuth }: { openAuth: () => void }) {
  return (
    <motion.main
      key="landing"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 6 }}
      transition={vt}
      className="min-h-screen bg-white text-zinc-950"
    >
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="font-medium tracking-tight">BrandMind</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Marketing experiment intelligence
              </p>
            </div>
          </div>
          <button
            onClick={openAuth}
            className="rounded-sm bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
          >
            Sign In / Register
          </button>
          <ThemeToggle />
        </div>
      </header>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={vt}
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-12">
          <h1 className="font-display text-4xl font-normal leading-tight tracking-tight sm:text-6xl lg:col-span-7">
            Autonomous Marketing Experiment Engine for High-Growth Teams
          </h1>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
              Eliminate campaign memory loss. Intercept flawed marketing
              hypotheses with team memory before burning budget.
            </p>
            <button
              onClick={openAuth}
              className="mt-7 rounded-sm bg-zinc-950 px-6 py-3 font-medium text-white hover:bg-zinc-800"
            >
              Launch Team Workspace -&gt;
            </button>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 gap-4 border-y border-zinc-200 py-4 sm:grid-cols-4">
          {[
            "Shared team memory",
            "Adversarial review",
            "Dual-write audit",
            "Cumulative learning",
          ].map((x, i) => (
            <div key={x}>
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                0{i + 1}
              </p>
              <p className="mt-2 text-sm">{x}</p>
            </div>
          ))}
        </div>
      </motion.section>
      <Footer />
    </motion.main>
  );
}
function Notice({ notice }: { notice: Notice }) {
  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded border border-zinc-200 bg-white px-4 py-3 text-sm"
        >
          {notice.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function Breakdown({ close }: { close: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.aside
        className="h-full w-full max-w-md border-l border-zinc-200 bg-white p-6 sm:p-8"
        initial={{ opacity: 0, scale: 0.98, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 4 }}
        transition={{ duration: 0.2, ease }}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Scoring method
        </p>
        <h2 className="mt-3 font-display text-4xl tracking-tight">
          How this score was calculated
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-zinc-600">
          The verdict combines vector semantic similarity with observed
          workspace outcomes. Similarity finds related memories; outcomes
          determine whether repetition is risky.
        </p>
        <button
          onClick={close}
          className="mt-8 rounded-sm bg-zinc-950 px-5 py-3 text-sm text-white"
        >
          Close breakdown
        </button>
      </motion.aside>
    </motion.div>
  );
}
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null),
    [authOpen, setAuthOpen] = useState(false),
    [workspaces, setWorkspaces] = useState<Workspace[]>([]),
    [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null),
    [members, setMembers] = useState<WorkspaceMember[]>([]),
    [tab, setTab] = useState<Tab>("brand"),
    [draft, setDraft] = useState<Draft>(empty),
    [experiments, setExperiments] = useState<MarketingExperiment[]>([]),
    [hypothesis, setHypothesis] = useState(""),
    [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null),
    [notice, setNotice] = useState<Notice>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [breakdown, setBreakdown] = useState(false),
    [step, setStep] = useState(1),
    [selected, setSelected] = useState<string[]>([]),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("ALL"),
    [expanded, setExpanded] = useState<string | null>(null),
    [brandProfile, setBrandProfile] = useState<BrandProfile>({ positioning: "", target_audience: "", tone_of_voice: "", core_differentiators: [] }),
    [brandQuery, setBrandQuery] = useState(""),
    [ideation, setIdeation] = useState<{ title: string; concept: string; memory_basis: string; avoid: string; measure: string }[]>([]),
    [brandBusy, setBrandBusy] = useState(false);
  let mounted = true;
  useEffect(() => {
    let alive = true;
    supabaseBrowser.auth
      .getUser()
      .then(({ data }) => alive && setUser(data.user));
    const { data: l } = supabaseBrowser.auth.onAuthStateChange((_, s) =>
      setUser(s?.user ?? null),
    );
    return () => {
      alive = false;
      l.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!user) {
      setWorkspaces([]);
      setActiveWorkspace(null);
      return;
    }
    const load = async () => {
      const { data } = await supabaseBrowser
        .from("workspaces")
        .select("*")
        .order("created_at");
      let list = (data || []) as Workspace[];
      if (!list.length) {
        const { data: c } = await supabaseBrowser
          .from("workspaces")
          .insert({
            name: `${user.email?.split("@")[0] || "Personal"} Marketing`,
            owner_id: user.id,
          })
          .select()
          .single();
        if (c) {
          await supabaseBrowser
            .from("workspace_members")
            .insert({ workspace_id: c.id, user_id: user.id, role: "owner" });
          list = [c as Workspace];
        }
      }
      if (mounted) {
        setWorkspaces(list);
        setActiveWorkspace(list[0] || null);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user]);
  useEffect(() => {
    if (!activeWorkspace) return;
    let alive = true;
    const load = async () => {
      const [{ data: memberData }, { data: experimentData }] =
        await Promise.all([
          supabaseBrowser
            .from("workspace_members")
            .select("workspace_id,user_id,role")
            .eq("workspace_id", activeWorkspace.id),
          supabaseBrowser
            .from("experiments")
            .select("*")
            .eq("workspace_id", activeWorkspace.id)
            .order("created_at", { ascending: false }),
        ]);
      if (!alive) return;
      setMembers((memberData || []) as WorkspaceMember[]);
      const existing = (experimentData || []) as MarketingExperiment[];
      if (existing.length) {
        setExperiments(existing);
        return;
      }
      const { data: sessionData } = await supabaseBrowser.auth.getSession();
      if (!sessionData.session) return;
      const response = await fetch("/api/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({ workspace_id: activeWorkspace.id }),
      });
      if (!response.ok) return;
      const seeded = (await response.json()) as {
        experiments?: MarketingExperiment[];
      };
      if (alive) setExperiments(seeded.experiments || []);
    };
    load();
    return () => {
      alive = false;
    };
  }, [activeWorkspace]);
  useEffect(() => {
    if (!activeWorkspace) return;
    let alive = true;
    const loadProfile = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (!data.session) return;
      const response = await fetch(`/api/brand?workspace_id=${activeWorkspace.id}`, { headers: { Authorization: `Bearer ${data.session.access_token}` } });
      if (!response.ok) return;
      const result = await response.json() as { brand_profile?: BrandProfile };
      if (alive && result.brand_profile) setBrandProfile(result.brand_profile);
    };
    loadProfile();
    return () => { alive = false; };
  }, [activeWorkspace]);
  const update = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft((x) => ({ ...x, [k]: v }));
  const headers = async () => {
    const { data } = await supabaseBrowser.auth.getSession();
    return {
      "Content-Type": "application/json",
      ...(data.session?.access_token
        ? { Authorization: `Bearer ${data.session.access_token}` }
        : {}),
    };
  };
  const evaluate = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/evaluate", {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify({
          query: hypothesis,
          workspace_id: activeWorkspace.id,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setEvaluation(d);
      setNotice({ type: "success", message: "Evaluation complete." });
    } catch (x) {
      setError(x instanceof Error ? x.message : "Evaluation failed.");
    } finally {
      setBusy(false);
    }
  };
  const updateBrandProfile = (key: keyof BrandProfile, value: string) => setBrandProfile((profile) => ({ ...profile, [key]: key === "core_differentiators" ? value.split(",").map((item) => item.trim()).filter(Boolean) : value }));
  const saveBrandProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeWorkspace) return;
    setBrandBusy(true);
    try {
      const response = await fetch("/api/brand", { method: "POST", headers: await headers(), body: JSON.stringify({ workspace_id: activeWorkspace.id, brand_profile: brandProfile }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setActiveWorkspace((workspace) => workspace ? { ...workspace, brand_profile: result.brand_profile } : workspace);
      setNotice({ type: "success", message: "Brand intelligence saved." });
    } catch (error) { setNotice({ type: "error", message: error instanceof Error ? error.message : "Unable to save brand profile." }); }
    finally { setBrandBusy(false); }
  };
  const refineIdea = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeWorkspace || !brandQuery.trim()) return;
    setBrandBusy(true);
    try {
      const response = await fetch("/api/ideate", { method: "POST", headers: await headers(), body: JSON.stringify({ workspace_id: activeWorkspace.id, query: brandQuery }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setIdeation(Array.isArray(result.concepts) ? result.concepts : []);
    } catch (error) { setNotice({ type: "error", message: error instanceof Error ? error.message : "Unable to refine idea." }); }
    finally { setBrandBusy(false); }
  };
  const retain = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !activeWorkspace) return;
    setBusy(true);
    const experiment = {
      ...draft,
      variables: selected,
      created_at: new Date().toISOString(),
      user_id: user.id,
      workspace_id: activeWorkspace.id,
    };
    try {
      const r = await fetch("/api/logger", {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify(experiment),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setExperiments((x) => [{ ...experiment, id: d.experimentId, strategic_rule: d.refined_rule || undefined, lineage_experiment_ids: d.lineage_experiment_ids }, ...x]);
      setDraft(empty);
      setSelected([]);
      setStep(1);
      setNotice({
        type: "success",
        message: "Experiment saved to team memory.",
      });
    } catch (x) {
      setNotice({
        type: "error",
        message: x instanceof Error ? x.message : "Save failed.",
      });
    } finally {
      setBusy(false);
    }
  };
  const filtered = useMemo(
    () =>
      experiments.filter(
        (x) =>
          (!search ||
            [x.objective, x.learning].some((v) =>
              v.toLowerCase().includes(search.toLowerCase()),
            )) &&
          (filter === "ALL" || x.outcome_status === filter),
      ),
    [experiments, search, filter],
  );
  const create = async (name: string) => {
    if (!user) return;
    const { data, error: e } = await supabaseBrowser
      .from("workspaces")
      .insert({ name, owner_id: user.id })
      .select()
      .single();
    if (e || !data)
      return setNotice({
        type: "error",
        message: e?.message || "Unable to create workspace.",
      });
    await supabaseBrowser
      .from("workspace_members")
      .insert({ workspace_id: data.id, user_id: user.id, role: "owner" });
    setWorkspaces((x) => [...x, data as Workspace]);
    setActiveWorkspace(data as Workspace);
  };
  const invite = async (email: string) => {
    const r = await fetch("/api/workspaces/invite", {
      method: "POST",
      headers: await headers(),
      body: JSON.stringify({ email, workspace_id: activeWorkspace?.id }),
    });
    const d = await r.json();
    setNotice({
      type: r.ok ? "success" : "error",
      message: d.message || d.error,
    });
  };
  const confidence = evaluation
    ? evaluation.verdict === "CHALLENGED"
      ? 91
      : evaluation.verdict === "VALIDATED"
        ? 84
        : 52
    : 0;
  const verdict = evaluation?.verdict === "CHALLENGED" ? "HIGH RISK" : evaluation?.verdict === "VALIDATED" ? "CLEAR" : evaluation?.verdict || "CAUTION";
  const input =
    "w-full rounded border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2";
  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <>
          <Landing openAuth={() => setAuthOpen(true)} />
          <AuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            onAuthenticated={(u, m) => {
              setUser(u);
              setNotice({ type: "success", message: m });
            }}
          />
          <Notice notice={notice} />
        </>
      ) : (
        <motion.main
          key="dashboard"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={vt}
          className="min-h-screen bg-white text-zinc-950"
        >
          <header className="border-b border-zinc-200">
            <div className="mx-auto max-w-[1480px] px-5 py-5 sm:px-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-3">
                  <Logo />
                  <div>
                    <p className="font-medium tracking-tight">BrandMind</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Team experiment operating system
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <WorkspaceSelector
                    workspaces={workspaces}
                    activeWorkspace={activeWorkspace}
                    members={members}
                    onSelect={setActiveWorkspace}
                    onCreate={create}
                    onInvite={invite}
                  />
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    {experiments.length} records
                  </span>
                  <span className="max-w-[180px] truncate text-sm text-zinc-600">
                    {user.email}
                  </span>
                  <button
                    onClick={() => supabaseBrowser.auth.signOut()}
                    className="rounded px-2 py-2 text-sm text-zinc-600 hover:text-zinc-950 hover:underline"
                  >
                    Sign out
                  </button>
                  <ThemeToggle />
                </div>
              </div>
              <nav className="mt-6 flex overflow-x-auto border-b border-zinc-200">
                {tabs.map(({ id, label }, i) => {
                  return (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`relative min-h-12 shrink-0 px-4 text-sm ${tab === id ? "text-zinc-950" : "text-zinc-500"} focus:outline-none focus:ring-2 focus:ring-zinc-950`}
                    >
                      <span className="font-mono text-xs">0{i + 1}. </span>
                      {label}
                      {tab === id && (
                        <motion.span
                          layoutId="activeTabUnderline"
                          className="absolute inset-x-0 -bottom-px h-0.5 bg-zinc-950"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </header>
          <div className="mx-auto max-w-[1480px] px-5 py-8 sm:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={vt}
              >
                {!activeWorkspace ? (
                  <p className="text-sm text-zinc-600">
                    Preparing your workspace.
                  </p>
                ) : tab === "brand" ? (
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <section className="rounded border border-zinc-200 bg-zinc-50/50 p-5 sm:p-7 lg:col-span-5">
                      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">01 / Brand &amp; Strategy</p>
                      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08, ease }} className="mt-5 font-display text-4xl tracking-tight sm:text-5xl">Make the brand legible.</motion.h1>
                      <p className="mt-4 text-sm leading-relaxed text-zinc-600">Persistent identity and tone context for every campaign decision.</p>
                      <form onSubmit={saveBrandProfile} className="mt-8 space-y-5">
                        <Field label="Positioning" value={brandProfile.positioning} onChange={(value) => updateBrandProfile("positioning", value)} placeholder="Affordable, beginner-friendly fitness coaching" />
                        <Field label="Target audience" value={brandProfile.target_audience} onChange={(value) => updateBrandProfile("target_audience", value)} placeholder="Young professionals beginning fitness" />
                        <Field label="Tone of voice" value={brandProfile.tone_of_voice} onChange={(value) => updateBrandProfile("tone_of_voice", value)} placeholder="Encouraging, practical, non-intimidating" />
                        <Field label="Core differentiators" value={brandProfile.core_differentiators.join(", ")} onChange={(value) => updateBrandProfile("core_differentiators", value)} placeholder="Flexible coaching, visible progress" multiline />
                        <button className="rounded-sm bg-zinc-950 px-5 py-3 text-sm font-medium text-white">{brandBusy ? "Saving..." : "Save brand intelligence"}</button>
                      </form>
                    </section>
                    <section className="lg:col-span-7 lg:border-l lg:border-zinc-200 lg:pl-8">
                      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Memory-informed ideation</p>
                      <h2 className="mt-4 font-display text-3xl tracking-tight">Refine the rough idea.</h2>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-600">Every concept is checked against this workspace&apos;s Hindsight memory, including what failed and what to avoid repeating.</p>
                      <form onSubmit={refineIdea} className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <input value={brandQuery} onChange={(event) => setBrandQuery(event.target.value)} placeholder="A practical campaign direction for new members..." className={`${input} flex-1`} />
                        <button className="rounded-sm bg-zinc-950 px-5 py-3 text-sm font-medium text-white">{brandBusy ? "Checking memory..." : "Refine with memory"}</button>
                      </form>
                      <AnimatePresence mode="popLayout">
                        <div className="mt-8 space-y-4">
                          {ideation.map((concept) => <motion.article layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} key={concept.title} className="border border-zinc-200 p-5 transition-colors hover:border-zinc-500">
                            <h3 className="font-display text-2xl">{concept.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{concept.concept}</p>
                            <div className="mt-4 grid gap-3 text-xs text-zinc-600 sm:grid-cols-3"><p><span className="font-mono uppercase tracking-wider text-zinc-500">Memory basis</span><br />{concept.memory_basis}</p><p><span className="font-mono uppercase tracking-wider text-zinc-500">Avoid</span><br />{concept.avoid}</p><p><span className="font-mono uppercase tracking-wider text-zinc-500">Measure</span><br />{concept.measure}</p></div>
                          </motion.article>)}
                        </div>
                      </AnimatePresence>
                    </section>
                  </div>
                ) : tab === "evaluator" ? (
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <section className="rounded border border-zinc-200 bg-zinc-50/50 p-5 sm:p-7 lg:col-span-8">
                      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                        02 / Evaluator &amp; Review
                      </p>
                      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08, ease }} className="mt-5 font-serif text-3xl font-normal tracking-tight sm:text-5xl">
                        Intercept the next bad bet.
                      </motion.h1>
                      <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                        What channel, offer, and audience segment are you
                        testing?
                      </p>
                      <form onSubmit={evaluate} className="mt-8">
                        <textarea
                          required
                          rows={5}
                          value={hypothesis}
                          onChange={(e) => setHypothesis(e.target.value)}
                          placeholder="We will test [offer] in [channel] for [audience] because..."
                          className={`${input} resize-none`}
                        />
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setHypothesis(
                                "We plan to run direct promo posts with 20% discount codes across social channels to boost Q3 acquisition.",
                              )
                            }
                            className="rounded-sm border border-zinc-300 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-600 hover:border-zinc-950 hover:text-zinc-950"
                          >
                            [ Pre-fill Test Campaign ]
                          </button>
                          <button className="rounded-sm bg-zinc-950 px-6 py-3 text-sm font-medium text-white">
                            {busy ? "Reviewing..." : "Evaluate strategy"}
                          </button>
                        </div>
                      </form>
                      <div className="mt-8 border-t border-zinc-200 pt-7">
                        {evaluation ? (
                          <motion.div layout initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
                            <motion.div variants={{ hidden: { opacity: 0, height: 0 }, visible: { opacity: 1, height: "auto" } }} className="border-b border-zinc-200 pb-5">
                              <div>
                                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                                  1. Recommendation &amp; Risk Verdict
                                </p>
                                <p className="mt-2 font-display text-4xl">{verdict}</p>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{evaluation.synthesis}</p>
                              </div>
                              <div className="mt-5 text-left">
                                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                                  Confidence
                                </p>
                                <p className="mt-2 font-mono text-2xl">
                                  {confidence}%
                                </p>
                              </div>
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, height: 0 }, visible: { opacity: 1, height: "auto" } }} className="mt-6 border-b border-zinc-200 pb-6">
                              <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">2. Historical Evidence &amp; Linked Experiments</p>
                              <div className="mt-4 space-y-3">
                                {evaluation.tiers.raw_experience.experiment_ids.map((id) => {
                                  const experiment = evaluation.supporting_experiments.find((item) => item.id === id);
                                  return <div key={id} className="border-l-2 border-zinc-950 pl-3"><p className="font-mono text-xs">{id}</p><p className="mt-1 text-sm text-zinc-600">{experiment?.result_metrics || "Recorded metric unavailable"}</p></div>;
                                })}
                              </div>
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, height: 0 }, visible: { opacity: 1, height: "auto" } }} className="mt-6 border-b border-zinc-200 pb-6">
                              <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">3. Level 3 Brand Rule</p>
                              <p className="mt-3 font-display text-2xl leading-tight">{evaluation.tiers.strategic_rule}</p>
                              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{evaluation.tiers.tactical_learning}</p>
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0, height: 0 }, visible: { opacity: 1, height: "auto" } }} className="mt-6">
                              <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">4. Suggested Strategy Modifications</p>
                              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                                {(evaluation.suggested_modifications.length ? evaluation.suggested_modifications : [evaluation.recommended_action]).map((modification) => <li key={modification} className="border-l-2 border-zinc-300 pl-3">{modification}</li>)}
                              </ul>
                            </motion.div>
                            <button
                              onClick={() => setBreakdown(true)}
                              className="mt-5 rounded-sm border border-zinc-200 px-4 py-2.5 text-sm"
                            >
                              How this score was calculated
                            </button>
                          </motion.div>
                        ) : (
                          <p className="text-sm text-zinc-600">
                            Your evidence-led verdict is waiting.
                          </p>
                        )}
                      </div>
                    </section>
                    <aside className="lg:col-span-4 lg:border-l lg:border-zinc-200 lg:pl-8">
                      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                        Workspace memory
                      </p>
                      <p className="mt-3 font-serif text-5xl">
                        {experiments.length}
                      </p>
                      <p className="mt-2 text-sm text-zinc-600">
                        records in this session
                      </p>
                    </aside>
                  </div>
                ) : tab === "outcome" ? (
                  <section className="max-w-5xl rounded border border-zinc-200 bg-zinc-50/50 p-5 sm:p-7">
                    <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                      03 / Outcome &amp; Audience Logger
                    </p>
                    <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08, ease }} className="mt-5 font-serif text-3xl tracking-tight sm:text-5xl">
                      Make the learning durable.
                    </motion.h1>
                    <p className="mt-4 text-sm text-zinc-600">
                      Step {step} of 3. Capture evidence, then leave a useful
                      takeaway.
                    </p>
                    <form onSubmit={retain} className="mt-8 space-y-5">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 6 }}
                          transition={vt}
                          className="grid grid-cols-1 gap-5 md:grid-cols-2"
                        >
                          {step === 1 ? (
                            <>
                              <Field
                                label="Objective"
                                value={draft.objective}
                                onChange={(v) => update("objective", v)}
                                placeholder="What outcome are we trying to change?"
                              />
                              <Field
                                label="Hypothesis"
                                value={draft.hypothesis}
                                onChange={(v) => update("hypothesis", v)}
                                placeholder="What did we expect, and why?"
                              />
                              <Field
                                label="Audience"
                                value={draft.audience}
                                onChange={(v) => update("audience", v)}
                                placeholder="Who was exposed?"
                              />
                              <Field
                                label="Strategy used"
                                value={draft.strategy_used}
                                onChange={(v) => update("strategy_used", v)}
                                placeholder="What did the team do?"
                              />
                            </>
                          ) : step === 2 ? (
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium">
                                Choose the metrics that defined the test.
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {metrics.map((metric) => (
                                  <button
                                    type="button"
                                    key={metric}
                                    onClick={() =>
                                      setSelected((x) =>
                                        x.includes(metric)
                                          ? x.filter((y) => y !== metric)
                                          : [...x, metric],
                                      )
                                    }
                                    className={`rounded-sm border px-4 py-3 font-mono text-xs ${selected.includes(metric) ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white text-zinc-600"}`}
                                  >
                                    {metric}
                                  </button>
                                ))}
                              </div>
                              <Field
                                label="Result metrics"
                                value={draft.result_metrics}
                                onChange={(v) => update("result_metrics", v)}
                                placeholder="Baseline, delta, and period"
                                multiline
                              />
                            </div>
                          ) : (
                            <>
                              <Field
                                label="Audience reaction"
                                value={draft.audience_reaction}
                                onChange={(v) => update("audience_reaction", v)}
                                placeholder="What did the audience do?"
                                multiline
                              />
                              <Field
                                label="Learning"
                                value={draft.learning}
                                onChange={(v) => update("learning", v)}
                                placeholder="What should the team remember?"
                                multiline
                              />
                              <Field
                                label="Interpretation"
                                value={draft.interpretation}
                                onChange={(v) => update("interpretation", v)}
                                placeholder="What explains the result?"
                                multiline
                              />
                              <div>
                                <label className="block text-sm font-medium">
                                  Outcome status
                                  <select
                                    value={draft.outcome_status}
                                    onChange={(e) =>
                                      update(
                                        "outcome_status",
                                        e.target
                                          .value as Draft["outcome_status"],
                                      )
                                    }
                                    className={`${input} mt-2 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800 [&>option]:bg-zinc-900 [&>option]:text-zinc-100`}
                                  >
                                    <option>SUCCESS</option>
                                    <option>FAILURE</option>
                                    <option>INCONCLUSIVE</option>
                                  </select>
                                </label>
                              </div>
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                      <div className="flex gap-3 border-t border-zinc-200 pt-5">
                        {step < 3 ? (
                          <button
                            type="button"
                            onClick={() => setStep(step + 1)}
                            className="rounded-sm bg-zinc-950 px-6 py-3 text-sm text-white"
                          >
                            Continue
                          </button>
                        ) : (
                          <button className="rounded-sm bg-zinc-950 px-6 py-3 text-sm text-white">
                            {busy ? "Saving..." : "Commit outcome"}
                          </button>
                        )}
                        {step > 1 && (
                          <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="rounded-sm border border-zinc-200 px-6 py-3 text-sm"
                          >
                            Back
                          </button>
                        )}
                      </div>
                    </form>
                  </section>
                ) : (
                  <section>
                    <div className="flex flex-col justify-between gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-end">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                          04 / Memory Timeline
                        </p>
                        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08, ease }} className="mt-4 font-serif text-3xl tracking-tight sm:text-5xl">
                          How the team got smarter.
                        </motion.h1>
                      </div>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search memory"
                        className={`${input} md:w-72`}
                      />
                    </div>
                    <div className="mt-5 flex gap-2">
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-sm border border-zinc-200 bg-white px-3 py-2 font-mono text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 [&>option]:bg-zinc-900 [&>option]:text-zinc-100"
                      >
                        <option value="ALL">All outcomes</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILURE">Failure</option>
                      </select>
                    </div>
                    <AnimatePresence mode="popLayout">
                    <motion.ul
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.05 } },
                      }}
                      className="mt-8"
                    >
                      {filtered.map((x, i) => {
                        const id = x.id || String(i);
                        return (
                          <motion.li
                            layout
                            key={id}
                            variants={{
                              hidden: { opacity: 0, y: 8 },
                              show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.3, ease }}
                            whileHover={{ x: 2 }}
                            className="border border-transparent border-b-zinc-200 py-6 transition-colors hover:border-zinc-500"
                          >
                            <button
                              onClick={() =>
                                setExpanded(expanded === id ? null : id)
                              }
                              className="grid w-full gap-3 text-left md:grid-cols-12"
                            >
                              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 md:col-span-2">
                                {x.created_at
                                  ? new Date(x.created_at).toLocaleDateString()
                                  : "Undated"}
                              </span>
                              <span className="md:col-span-7">
                                <span className="block text-lg">
                                  {x.objective}
                                </span>
                                <span className="mt-2 block text-sm text-zinc-600">
                                  {x.learning}
                                </span>
                              </span>
                              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 md:col-span-3 md:text-right">
                                {x.outcome_status}
                              </span>
                            </button>
                            <AnimatePresence>
                              {expanded === id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden pt-5 text-sm text-zinc-600"
                                >
                                  <p className="border-t border-zinc-200 pt-5">
                                    Hypothesis: {x.hypothesis}
                                  </p>
                                  <p className="mt-2 font-mono text-xs">
                                    Vector ID: {x.id || "pending-retention"}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                    </AnimatePresence>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <Footer />
          <AnimatePresence>
            {breakdown && <Breakdown close={() => setBreakdown(false)} />}
          </AnimatePresence>
          <AuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            onAuthenticated={(u, m) => {
              setUser(u);
              setNotice({ type: "success", message: m });
            }}
          />
          <Notice notice={notice} />
        </motion.main>
      )}
    </AnimatePresence>
  );
}
