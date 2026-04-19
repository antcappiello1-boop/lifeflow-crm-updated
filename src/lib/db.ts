// =====================================================================
// Data Access Layer
// ---------------------------------------------------------------------
// In-memory store backed by the seed data. Exposes the same kind of
// query surface Prisma would give you. When you're ready for real
// persistence, replace the bodies of these functions with Prisma or
// Supabase calls — the rest of the app won't change.
//
// PRODUCTION SWAP GUIDE:
//   1. npm i @prisma/client prisma
//   2. Create prisma/schema.prisma mirroring src/types/index.ts
//   3. Replace `store` below with `import { prisma } from "./prisma"`
//   4. Each function becomes a prisma.<model>.find/update call
// =====================================================================

import {
  users as seedUsers,
  leads as seedLeads,
  carriers as seedCarriers,
  tasks as seedTasks,
  activity as seedActivity,
} from "@/data/seed";
import type { Lead, Task, Activity, User, Carrier, LeadStatus } from "@/types";

// Mutable in-memory store (resets on server restart — fine for MVP)
const store = {
  users: [...seedUsers],
  leads: [...seedLeads],
  carriers: [...seedCarriers],
  tasks: [...seedTasks],
  activity: [...seedActivity],
};

// -------- Users --------
export const db = {
  users: {
    all: (): User[] => store.users,
    byId: (id: string) => store.users.find((u) => u.id === id),
  },

  carriers: {
    all: (): Carrier[] => store.carriers,
    byId: (id: string) => store.carriers.find((c) => c.id === id),
  },

  leads: {
    all: (): Lead[] => store.leads,
    byId: (id: string) => store.leads.find((l) => l.id === id),
    byStatus: (s: LeadStatus) => store.leads.filter((l) => l.status === s),
    byAgent: (agentId: string) => store.leads.filter((l) => l.assignedAgentId === agentId),
    update: (id: string, patch: Partial<Lead>) => {
      const i = store.leads.findIndex((l) => l.id === id);
      if (i >= 0) store.leads[i] = { ...store.leads[i], ...patch };
      return store.leads[i];
    },
  },

  tasks: {
    all: (): Task[] => store.tasks,
    forLead: (leadId: string) =>
      store.tasks.filter((t) => t.leadId === leadId).sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
    today: () => {
      const now = new Date();
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      const end = new Date(now); end.setHours(23, 59, 59, 999);
      return store.tasks.filter((t) => {
        const d = new Date(t.dueAt);
        return d >= start && d <= end && !t.completed;
      });
    },
    overdue: () => {
      const now = new Date();
      return store.tasks.filter((t) => !t.completed && new Date(t.dueAt) < now &&
        new Date(t.dueAt).toDateString() !== now.toDateString());
    },
    upcoming: () => {
      const end = new Date(); end.setHours(23, 59, 59, 999);
      return store.tasks.filter((t) => !t.completed && new Date(t.dueAt) > end);
    },
  },

  activity: {
    forLead: (leadId: string) =>
      store.activity
        .filter((a) => a.leadId === leadId)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
  },
};
