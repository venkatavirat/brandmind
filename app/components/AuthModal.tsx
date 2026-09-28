"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Props = {
  open: boolean;
  onClose: () => void;
  onAuthenticated: (user: User, message: string) => void;
};
const ease = [0.16, 1, 0.3, 1] as const;

export default function AuthModal({ open, onClose, onAuthenticated }: Props) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const result =
      mode === "sign-in"
        ? await supabaseBrowser.auth.signInWithPassword({ email, password })
        : await supabaseBrowser.auth.signUp({ email, password, options: { data: { username: username.trim().replace(/^@/, "") } } });
    if (result.error) setMessage(result.error.message);
    else if (result.data.user) {
      let authenticatedUser = result.data.user;
      let hasSession = Boolean(result.data.session);
      if (mode === "sign-up" && !hasSession) {
        const signIn = await supabaseBrowser.auth.signInWithPassword({ email, password });
        if (!signIn.error && signIn.data.session && signIn.data.user) {
          authenticatedUser = signIn.data.user;
          hasSession = true;
        }
      }
      if (hasSession) {
        await supabaseBrowser.from("user_profiles").upsert({
          id: authenticatedUser.id,
          email: authenticatedUser.email || email,
          username: (authenticatedUser.user_metadata?.username || username || email.split("@")[0]).replace(/^@/, "").slice(0, 50),
          updated_at: new Date().toISOString(),
        });
      }
      if (hasSession) {
        onAuthenticated(authenticatedUser, "Authentication successful.");
        onClose();
      } else {
        setMessage("Account created. Supabase email confirmation is required before sign-in.");
      }
    }
    setIsSubmitting(false);
  };
  const field =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400";
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/20 p-4 backdrop-blur-md sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease }}
        >
          <motion.div
            className="w-full max-w-md gap-4 rounded-xl border border-slate-200 bg-white/90 p-6 text-slate-900 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 sm:p-7"
            initial={{ opacity: 0, scale: 0.98, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.2, ease }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Private workspace
                </p>
                <h2
                  id="auth-title"
                  className="mt-2 text-xl font-medium tracking-tight text-slate-900 dark:text-slate-100"
                >
                  {mode === "sign-in" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  Keep experiment memory tied to your team identity.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
            <form onSubmit={submit} className="mt-7 space-y-4">
              {mode === "sign-up" && <div><label htmlFor="auth-username" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Username</label><input id="auth-username" type="text" required minLength={3} maxLength={50} autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="yourname" className={field} /></div>}
              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={
                    mode === "sign-in" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={field}
                />
              </div>
              {message && (
                <p
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  role="alert"
                >
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {isSubmitting
                  ? "Working..."
                  : mode === "sign-in"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "sign-in" ? "sign-up" : "sign-in");
                setMessage("");
              }}
              className="mt-5 w-full rounded py-2 text-center text-sm text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {mode === "sign-in"
                ? "Need an account? Register"
                : "Already registered? Sign in"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
