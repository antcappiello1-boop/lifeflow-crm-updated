"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Filter, Plus, Phone, Mail, MapPin } from "lucide-react";
import { AppShell, EmptyPanel, PageHeader } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS, LEAD_SOURCE, TEMPERATURE } from "@/lib/status";
import { relative } from "@/lib/format";
import type { Lead, LeadStatus } from "@/types";

type AddLeadFn = (payload: {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  state: string;
  source?: string;
  notesPreview?: string;
}) => Promise<{ error?: string; data?: Lead }>;

type UpdateLeadFn = (leadId: string, patch: Partial<Lead>) => Promise<{ error?: string; data?: Lead }>;

export function LeadsTable({
  leads,
  loading,
  addLead,
  updateLead,
}: {
  leads: Lead[];
  loading: boolean;
  addLead: AddLeadFn;
  updateLead: UpdateLeadFn;
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [temp, setTemp] = useState<"hot" | "warm" | "cold" | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", state: "", source: "other", notesPreview: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (status !== "all" && lead.status !== status) return false;
      if (temp !== "all" && lead.temperature !== temp) return false;
      if (!q) return true;
      const search = q.toLowerCase();
      const haystack = `${lead.firstName} ${lead.lastName} ${lead.phone} ${lead.email ?? ""} ${lead.state} ${lead.notesPreview ?? ""}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [leads, q, status, temp]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await addLead({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email || undefined,
      state: form.state.toUpperCase(),
      source: form.source,
      notesPreview: form.notesPreview || undefined,
    });
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setShowForm(false);
    setForm({ firstName: "", lastName: "", phone: "", email: "", state: "", source: "other", notesPreview: "" });
  };

  return (
    <AppShell>
      <PageHeader title="Leads" subtitle={loading ? "Loading leads…" : `${filtered.length} of ${leads.length} contacts`} action={<Button iconLeft={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>New lead</Button>} />

      {showForm && (
        <Card className="mb-4 p-4">
          <form onSubmit={submit} className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
            <input required value={form.firstName} onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="First name" className="h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
            <input required value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="Last name" className="h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
            <input required value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
            <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
            <input required value={form.state} onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))} placeholder="State" maxLength={2} className="h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none" />
            <select value={form.source} onChange={(e) => setForm((prev) => ({ ...prev, source: e.target.value }))} className="h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
              {Object.entries(LEAD_SOURCE).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
            </select>
            <input value={form.notesPreview} onChange={(e) => setForm((prev) => ({ ...prev, notesPreview: e.target.value }))} placeholder="Quick note" className="h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none xl:col-span-2" />
            <div className="xl:col-span-4 flex items-center gap-2">
              <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save lead"}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              {error && <span className="text-sm text-danger-600">{error}</span>}
            </div>
          </form>
        </Card>
      )}

      <Card className="mb-4">
        <div className="p-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, phone, email, state…" className="w-full h-10 pl-9 pr-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus | "all")} className="h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
              <option value="all">All statuses</option>
              {Object.entries(LEAD_STATUS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
            </select>
            <select value={temp} onChange={(e) => setTemp(e.target.value as "hot" | "warm" | "cold" | "all")} className="h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
              <option value="all">All temps</option>
              <option value="hot">🔥 Hot</option>
              <option value="warm">☀ Warm</option>
              <option value="cold">❄ Cold</option>
            </select>
            <Button variant="secondary" iconLeft={<Filter className="h-4 w-4" />}>More</Button>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyPanel title="No leads yet" body="Create a lead to start using the CRM for real." action={<Button iconLeft={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>Add your first lead</Button>} />
      ) : (
        <>
          <Card className="overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50">
                  <tr className="text-[11px] uppercase tracking-wider text-ink-500">
                    <th className="text-left font-medium px-4 py-3">Lead</th>
                    <th className="text-left font-medium px-4 py-3">Status</th>
                    <th className="text-left font-medium px-4 py-3">Temp</th>
                    <th className="text-left font-medium px-4 py-3">Source</th>
                    <th className="text-left font-medium px-4 py-3">State</th>
                    <th className="text-left font-medium px-4 py-3">Last contact</th>
                    <th className="text-left font-medium px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {filtered.map((lead) => {
                    const statusMeta = LEAD_STATUS[lead.status];
                    return (
                      <tr key={lead.id} className="hover:bg-ink-50/50">
                        <td className="px-4 py-3">
                          <Link href={`/leads/${lead.id}`} className="font-medium text-ink-900 hover:text-amber-700">{lead.firstName} {lead.lastName}</Link>
                          <div className="text-xs text-ink-500 tabular flex items-center gap-3 mt-0.5">
                            <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                            {lead.email && <span className="inline-flex items-center gap-1 truncate max-w-[200px]"><Mail className="h-3 w-3" />{lead.email}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select value={lead.status} onChange={(e) => void updateLead(lead.id, { status: e.target.value as LeadStatus })} className="h-9 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
                            {Object.entries(LEAD_STATUS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3"><Badge className={TEMPERATURE[lead.temperature].tag}>{TEMPERATURE[lead.temperature].icon} {TEMPERATURE[lead.temperature].label}</Badge></td>
                        <td className="px-4 py-3 text-ink-700">{LEAD_SOURCE[lead.source]}</td>
                        <td className="px-4 py-3 text-ink-700 tabular">{lead.state}</td>
                        <td className="px-4 py-3 text-xs text-ink-500">{relative(lead.lastContactedAt)}</td>
                        <td className="px-4 py-3 text-xs text-ink-500 max-w-[260px] truncate">{lead.notesPreview || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="md:hidden space-y-3">
            {filtered.map((lead) => {
              const statusMeta = LEAD_STATUS[lead.status];
              return (
                <Link key={lead.id} href={`/leads/${lead.id}`} className="block bg-white rounded-xl shadow-card ring-1 ring-ink-100 p-4 hover:shadow-card-hover transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-medium text-ink-900">{lead.firstName} {lead.lastName}</div>
                      <div className="text-xs text-ink-500 tabular mt-0.5">{lead.phone}</div>
                    </div>
                    <Badge className={TEMPERATURE[lead.temperature].tag}>{TEMPERATURE[lead.temperature].icon}</Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge className={statusMeta.tag} dot={statusMeta.dot}>{statusMeta.label}</Badge>
                    <span className="text-xs text-ink-500 inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {lead.state}</span>
                    <span className="text-xs text-ink-500">· {LEAD_SOURCE[lead.source]}</span>
                  </div>
                  {lead.notesPreview && <p className="text-xs text-ink-500 line-clamp-2">{lead.notesPreview}</p>}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}
