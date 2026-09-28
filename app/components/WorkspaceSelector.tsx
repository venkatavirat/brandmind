"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Workspace, WorkspaceMember } from "@/types/workspace";

type Props = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  members: WorkspaceMember[];
  onSelect: (workspace: Workspace) => void;
  onCreate: (name: string) => Promise<void>;
  onInvite: (email: string) => Promise<void>;
};
const ease = [0.16, 1, 0.3, 1] as const;

export default function WorkspaceSelector({
  workspaces,
  activeWorkspace,
  members,
  onSelect,
  onCreate,
  onInvite,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<"create" | "invite" | "members" | null>(
    null,
  );
  const [value, setValue] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    if (dialog === "create") await onCreate(value.trim());
    if (dialog === "invite") await onInvite(value.trim());
    setValue("");
    setDialog(null);
  };
  const field =
    "h-11 w-full rounded border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400 [&>option]:bg-white dark:[&>option]:bg-zinc-900 [&>option]:text-zinc-900 dark:[&>option]:text-zinc-100";
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex min-h-11 max-w-[230px] items-center gap-2 rounded border border-zinc-200 bg-white px-3 text-left text-sm text-zinc-900 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-500"
        >
          <span className="truncate">
            {activeWorkspace?.name || "Select workspace"}
          </span>
          <span aria-hidden="true" className="h-1.5 w-1.5 -translate-y-0.5 rotate-45 border-b border-r border-zinc-500 dark:border-zinc-400" />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute right-0 top-12 z-30 w-64 rounded border border-zinc-200 bg-white p-1 shadow-none dark:border-zinc-800 dark:bg-zinc-950"
              initial={{ opacity: 0, scale: 0.98, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.2, ease }}
            >
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => {
                    onSelect(workspace);
                    setMenuOpen(false);
                  }}
                  className="flex min-h-11 w-full items-center rounded px-3 text-left text-sm text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  {workspace.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setDialog("create");
                  setMenuOpen(false);
                }}
                className="flex min-h-11 w-full items-center gap-2 rounded border-t border-zinc-200 px-3 text-left text-sm font-medium text-zinc-900 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                + Create new workspace
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={() => setDialog("members")}
        className="min-h-11 rounded border border-zinc-200 bg-white px-3 font-mono text-xs text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
      >
        Team ({members.length})
      </button>
      <button
        type="button"
        onClick={() => setDialog("invite")}
        className="min-h-11 rounded border border-zinc-200 bg-white px-3 font-mono text-xs text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
      >
        Invite
      </button>
      <AnimatePresence>
        {dialog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#09090B]/20 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
          >
            <motion.div
              className="w-full max-w-md gap-4 rounded-xl border border-slate-200 bg-white/90 p-6 text-slate-900 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 sm:p-7"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.98, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.2, ease }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {dialog === "members"
                      ? "Workspace people"
                      : "Workspace settings"}
                  </p>
                  <h2 className="mt-2 text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                    {dialog === "members"
                      ? "Team members"
                      : dialog === "create"
                        ? "Create workspace"
                        : "Invite member"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDialog(null)}
                  className="rounded px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
              {dialog === "members" ? (
                <div className="mt-5 space-y-2">
                  {members.length ? (
                    members.map((member) => (
                      <motion.div
                        layout
                        key={member.user_id}
                        className="flex items-center justify-between rounded border border-zinc-200 px-3 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                      >
                        <span>{member.email || member.user_id}</span>
                        <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          {member.role}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      No team members found yet.
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={submit} className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {dialog === "create" ? "Workspace name" : "Member email"}
                  </label>
                  <input
                    autoFocus
                    required
                    type={dialog === "invite" ? "email" : "text"}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder={
                      dialog === "create"
                        ? "Acme Corp Marketing"
                        : "teammate@company.com"
                    }
                    className={field}
                  />
                  <button
                    type="submit"
                    className="mt-4 h-11 w-full rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    {dialog === "create"
                      ? "Create workspace"
                      : "Send invitation"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
