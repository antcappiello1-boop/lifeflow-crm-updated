"use client";

import Link from "next/link";
import { Flame, FileText, TrendingUp, AlertCircle, CheckCircle2, UserPlus, Phone } from "lucide-react";
import { AppShell, EmptyPanel, PageHeader } from "@/components/layout/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLeads, useTasks } from "@/lib/hooks";
import { LEAD_STATUS, TEMPERATURE } from "@/lib/status";
import { money, prettyTime, relative } from "@/lib/format";

export default function DashboardPage() {
  const { leads, loading } = useLeads();
  const { tasks } = useTasks();

  const newLeadsToday = leads.filter((lead) => new Date(lead.createdAt).toDateString() === new Date().toDateString()).length;
  const hotLeads = leads.filter((lead) => lead.temperature === "hot" && !["sold", "dead_lead", "do_not_call", "not_taken"].includes(lead.status));
  const applicationsPending = leads.filter((lead) => lead.application && ["started", "submitted", "pending_requirements"].includes(lead.application.status));
  const policiesIssued = leads.filter((lead) => lead.policy);
  const premiumSold = policiesIssued.reduce((sum, lead) => sum + ((lead.policy?.monthlyPremium || 0) * 12), 0);
  const overdueTasks = tasks.filter((task) => !task.completed && new Date(task.dueAt) < new Date() && new Date(task.dueAt).toDateString() !== new Date().toDateString());
  const todayTasks = tasks.filter((task) => !task.completed && new Date(task.dueAt).toDateString() === new Date().toDateString());

  return (
    <AppShell>
      <PageHeader title="Dashboard" subtitle={`Run the whole agency from one screen. ${loading ? "Refreshing data…" : "Everything here is live from Supabase."}`} />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="New leads today" value={newLeadsToday} accent="info" />
        <StatCard label="Hot leads" value={hotLeads.length} accent="amber" />
        <StatCard label="Apps pending" value={applicationsPending.length} accent="info" />
        <StatCard label="Policies issued" value={policiesIssued.length} accent="success" />
        <StatCard label="Annualized premium" value={money(premiumSold)} accent="success" />
      </div>

      {leads.length === 0 ? (
        <EmptyPanel
          title="No leads yet"
          body="Add your first lead and the CRM will start filling out your dashboard automatically."
          action={<Link href="/leads"><Button iconLeft={<UserPlus className="h-4 w-4" />}>Create first lead</Button></Link>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card>
            <CardHeader title="Today’s call list" subtitle={`${todayTasks.length} scheduled · ${overdueTasks.length} overdue`} />
            <CardBody className="pt-0">
              {todayTasks.length + overdueTasks.length === 0 ? (
                <p className="text-sm text-ink-500">Nothing due today. Create a follow-up from any lead.</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {[...overdueTasks, ...todayTasks].slice(0, 6).map((task) => {
                    const lead = leads.find((entry) => entry.id === task.leadId);
                    if (!lead) return null;
                    const overdue = overdueTasks.some((entry) => entry.id === task.id);
                    return (
                      <li key={task.id} className="py-3 flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${overdue ? "bg-danger-500" : "bg-amber-500"}`} />
                        <div className="flex-1 min-w-0">
                          <Link href={`/leads/${lead.id}`} className="text-sm font-medium text-ink-900 hover:text-amber-700">
                            {lead.firstName} {lead.lastName}
                          </Link>
                          <div className="text-xs text-ink-500 truncate">{task.title}</div>
                        </div>
                        <div className="text-xs text-right">
                          <div className={`font-medium ${overdue ? "text-danger-600" : "text-ink-700"}`}>{overdue ? "Overdue" : prettyTime(task.dueAt)}</div>
                          <div className="text-ink-400 tabular">{lead.phone}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Hot leads" subtitle="Ready to close" action={<Link href="/leads"><Button size="sm" variant="ghost">All</Button></Link>} />
            <CardBody className="pt-0">
              {hotLeads.length === 0 ? (
                <div className="py-8 text-center text-sm text-ink-500">No hot leads right now.</div>
              ) : (
                <ul className="space-y-3">
                  {hotLeads.slice(0, 5).map((lead) => {
                    const status = LEAD_STATUS[lead.status];
                    return (
                      <li key={lead.id}>
                        <Link href={`/leads/${lead.id}`} className="block p-3 -mx-2 rounded-lg hover:bg-ink-50 transition-colors">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-medium text-ink-900">{lead.firstName} {lead.lastName}</span>
                            <span className="text-xs">{TEMPERATURE.hot.icon}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={status.tag} dot={status.dot}>{status.label}</Badge>
                            <span className="text-xs text-ink-500 truncate">{lead.notesPreview || "No notes yet"}</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Quick actions" />
            <CardBody className="pt-0 space-y-2">
              <Link href="/leads" className="block"><Button variant="secondary" className="w-full justify-start" iconLeft={<UserPlus className="h-4 w-4" />}>Add new lead</Button></Link>
              <Link href="/tasks" className="block"><Button variant="secondary" className="w-full justify-start" iconLeft={<Phone className="h-4 w-4" />}>Today’s callbacks</Button></Link>
              <Link href="/applications" className="block"><Button variant="secondary" className="w-full justify-start" iconLeft={<FileText className="h-4 w-4" />}>Application tracker</Button></Link>
              <Link href="/reports" className="block"><Button variant="secondary" className="w-full justify-start" iconLeft={<TrendingUp className="h-4 w-4" />}>Reports</Button></Link>
            </CardBody>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader title="Recent leads" subtitle="Most recent activity" />
            <CardBody className="pt-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-ink-500 border-b border-ink-100">
                    <th className="text-left font-medium pb-2">Lead</th>
                    <th className="text-left font-medium pb-2">Status</th>
                    <th className="text-left font-medium pb-2">Next follow-up</th>
                    <th className="text-left font-medium pb-2">Last contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {leads.slice(0, 8).map((lead) => {
                    const status = LEAD_STATUS[lead.status];
                    return (
                      <tr key={lead.id}>
                        <td className="py-3">
                          <Link href={`/leads/${lead.id}`} className="font-medium text-ink-900 hover:text-amber-700">{lead.firstName} {lead.lastName}</Link>
                          <div className="text-xs text-ink-500 mt-0.5">{lead.phone}</div>
                        </td>
                        <td className="py-3"><Badge className={status.tag} dot={status.dot}>{status.label}</Badge></td>
                        <td className="py-3 text-ink-700">{lead.nextFollowupAt ? new Date(lead.nextFollowupAt).toLocaleString() : "—"}</td>
                        <td className="py-3 text-ink-500">{relative(lead.lastContactedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
