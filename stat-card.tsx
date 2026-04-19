"use client";

import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/lib/hooks";
import { LEAD_SOURCE } from "@/lib/status";
import { money } from "@/lib/format";
import type { LeadSource } from "@/types";

export default function ReportsPage() {
  const { leads } = useLeads();
  const total = leads.length;
  const contacted = leads.filter((lead) => !["new_lead", "attempted_contact"].includes(lead.status)).length;
  const quoted = leads.filter((lead) => ["quoted", "application_started", "underwriting_review", "approved", "sold", "not_taken"].includes(lead.status)).length;
  const appSubmitted = leads.filter((lead) => lead.application && ["submitted", "pending_requirements", "approved", "declined", "policy_issued"].includes(lead.application.status)).length;
  const approved = leads.filter((lead) => ["approved", "sold"].includes(lead.status)).length;
  const placed = leads.filter((lead) => lead.status === "sold" || lead.policy).length;
  const premium = leads.filter((lead) => lead.policy).reduce((sum, lead) => sum + ((lead.policy?.monthlyPremium || 0) * 12), 0);
  const rate = (a: number, b: number) => b === 0 ? "0%" : `${Math.round((a / b) * 100)}%`;

  const sourceStats = (Object.keys(LEAD_SOURCE) as LeadSource[]).map((src) => {
    const set = leads.filter((lead) => lead.source === src);
    const sold = set.filter((lead) => lead.status === "sold" || lead.policy).length;
    return { src, count: set.length, rate: set.length ? Math.round((sold / set.length) * 100) : 0 };
  }).filter((row) => row.count > 0).sort((a, b) => b.rate - a.rate);

  return (
    <AppShell>
      <PageHeader title="Reports" subtitle="Live production pulled from your CRM data" />
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <StatCard label="Leads" value={total} accent="info" />
        <StatCard label="Contact rate" value={rate(contacted, total)} accent="info" />
        <StatCard label="Quote rate" value={rate(quoted, total)} accent="amber" />
        <StatCard label="App rate" value={rate(appSubmitted, total)} accent="amber" />
        <StatCard label="Placement" value={rate(placed, total)} accent="success" />
        <StatCard label="Annualized" value={money(premium)} accent="success" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader title="Funnel snapshot" subtitle="How your book is converting" />
          <CardBody className="pt-0 space-y-4">
            {[
              ["Total leads", total],
              ["Contacted", contacted],
              ["Quoted", quoted],
              ["Submitted", appSubmitted],
              ["Approved", approved],
              ["Placed", placed],
            ].map(([label, value], index) => (
              <div key={String(label)}>
                <div className="flex items-center justify-between text-sm mb-1"><span className="text-ink-900 font-medium">{label}</span><span className="tabular text-ink-700">{value as number}</span></div>
                <div className="h-2 rounded-full bg-ink-100 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: `${total ? ((value as number) / total) * 100 : 0}%` }} /></div>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Lead source conversion" subtitle="Close rate by channel" />
          <CardBody className="pt-0">
            <ul className="space-y-3">
              {sourceStats.map((row) => {
                const maxRate = Math.max(...sourceStats.map((entry) => entry.rate), 10);
                return (
                  <li key={row.src}>
                    <div className="flex items-center justify-between text-sm mb-1"><span className="text-ink-900 font-medium">{LEAD_SOURCE[row.src]}</span><div className="flex items-center gap-3"><Badge className="bg-ink-100 text-ink-600 ring-ink-200 tabular">{row.count} leads</Badge><span className="text-ink-700 tabular font-semibold w-10 text-right">{row.rate}%</span></div></div>
                    <div className="h-2 rounded-full bg-ink-100 overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all" style={{ width: `${(row.rate / maxRate) * 100}%` }} /></div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
