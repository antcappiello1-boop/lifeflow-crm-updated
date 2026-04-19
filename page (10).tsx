"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, PhoneCall, MessageSquare, Save, Clock, FileText, StickyNote } from "lucide-react";
import { AppShell, EmptyPanel } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityTimeline } from "@/components/leads/activity-timeline";
import { CarrierRecommendation } from "@/components/leads/carrier-recommendation";
import { UnderwritingCard } from "@/components/leads/underwriting-card";
import { useActivity, useLeads, useTasks } from "@/lib/hooks";
import { APP_STATUS, LEAD_SOURCE, LEAD_STATUS, TEMPERATURE } from "@/lib/status";
import { isOverdue, money, prettyDate, prettyDateTime, relative } from "@/lib/format";
import type { LeadStatus, Underwriting } from "@/types";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const { leads, updateLead } = useLeads();
  const { tasks, addTask, toggleTask } = useTasks();
  const { activity, addActivity } = useActivity(params.id);
  const lead = useMemo(() => leads.find((entry) => entry.id === params.id), [leads, params.id]);
  const leadTasks = useMemo(() => tasks.filter((task) => task.leadId === params.id).sort((a, b) => a.dueAt.localeCompare(b.dueAt)), [tasks, params.id]);
  const [note, setNote] = useState(lead?.notesPreview || "");
  const [status, setStatus] = useState<LeadStatus | "">(lead?.status || "");
  const [followup, setFollowup] = useState(lead?.nextFollowupAt ? lead.nextFollowupAt.slice(0, 16) : "");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueAt, setTaskDueAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [taskSaving, setTaskSaving] = useState(false);

  if (!lead) {
    return (
      <AppShell>
        <EmptyPanel title="Lead not found" body="This lead was not found in your database yet." action={<Link href="/leads"><Button>Back to leads</Button></Link>} />
      </AppShell>
    );
  }

  const statusMeta = LEAD_STATUS[lead.status];

  const saveLead = async () => {
    setSaving(true);
    await updateLead(lead.id, {
      notesPreview: note,
      status: (status || lead.status) as LeadStatus,
      nextFollowupAt: followup ? new Date(followup).toISOString() : undefined,
      lastContactedAt: new Date().toISOString(),
    });
    await addActivity(`Updated lead details · status set to ${LEAD_STATUS[(status || lead.status) as LeadStatus].label}`, "status_change");
    setSaving(false);
  };

  const saveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDueAt) return;
    setTaskSaving(true);
    await addTask({ leadId: lead.id, title: taskTitle, dueAt: new Date(taskDueAt).toISOString(), priority: "normal", type: "callback" });
    await addActivity(`Task added · ${taskTitle}`, "task_created");
    setTaskSaving(false);
    setTaskTitle("");
    setTaskDueAt("");
  };

  return (
    <AppShell>
      <Link href="/leads" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-4">
        <ChevronLeft className="h-4 w-4" /> All leads
      </Link>

      <Card className="mb-6 overflow-hidden">
        <div className="p-6 lg:p-7 bg-gradient-to-br from-white via-white to-ink-50">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h1 className="font-display text-3xl font-semibold text-ink-900">{lead.firstName} {lead.lastName}</h1>
                <Badge className={TEMPERATURE[lead.temperature].tag}>{TEMPERATURE[lead.temperature].icon} {TEMPERATURE[lead.temperature].label}</Badge>
                <Badge className={statusMeta.tag} dot={statusMeta.dot}>{statusMeta.label}</Badge>
              </div>
              <div className="text-sm text-ink-500">{lead.age ? `${lead.age} · ` : ""}{lead.state} · {LEAD_SOURCE[lead.source]}</div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-sm text-ink-700">
                <a href={`tel:${lead.phone}`} className="font-medium">{lead.phone}</a>
                {lead.email ? <a href={`mailto:${lead.email}`} className="hover:text-amber-700">{lead.email}</a> : null}
                <span>{lead.city ? `${lead.city}, ` : ""}{lead.state}{lead.zip ? ` ${lead.zip}` : ""}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="lg" iconLeft={<PhoneCall className="h-4 w-4" />}>Call now</Button>
              <Button size="lg" variant="secondary" iconLeft={<MessageSquare className="h-4 w-4" />}>Text</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-5 border-t border-ink-100">
            <QuickFact label="Created" value={prettyDate(lead.createdAt)} />
            <QuickFact label="Last contact" value={relative(lead.lastContactedAt)} />
            <QuickFact label="Next follow-up" value={lead.nextFollowupAt ? prettyDateTime(lead.nextFollowupAt) : "—"} warn={isOverdue(lead.nextFollowupAt)} />
            <QuickFact label="Lead source" value={LEAD_SOURCE[lead.source]} />
            <QuickFact label="Current status" value={statusMeta.label} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Card>
            <CardHeader title="Live CRM controls" subtitle="Everything here saves to Supabase" action={<Button size="sm" iconLeft={<Save className="h-4 w-4" />} onClick={saveLead} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>} />
            <CardBody className="pt-0 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1.5">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className="w-full h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none">
                  {Object.entries(LEAD_STATUS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1.5">Next follow-up</label>
                <input type="datetime-local" value={followup} onChange={(e) => setFollowup(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-ink-700 mb-1.5">Call notes</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="w-full rounded-lg bg-white px-3 py-2 ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Summarize the conversation, objections, budget, beneficiary, and next step." />
              </div>
            </CardBody>
          </Card>

          <UnderwritingCard uw={lead.underwriting as Underwriting | undefined} />
          <CarrierRecommendation uw={lead.underwriting as Underwriting | undefined} currentCarrierId={lead.carrierRecommendationId} />

          <Card>
            <CardHeader title="Application" subtitle={lead.application ? "Policy workflow stored on this lead" : "No application started yet"} action={<Button size="sm" variant="secondary" iconLeft={<FileText className="h-4 w-4" />} onClick={() => void updateLead(lead.id, { application: lead.application || { id: crypto.randomUUID(), status: "started", carrierId: lead.carrierRecommendationId || "c1", product: "Final Expense", faceAmount: 10000, monthlyPremium: 75 } as any })}>Start app</Button>} />
            {lead.application ? (
              <CardBody className="pt-0">
                <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <Field label="Status" value={APP_STATUS[lead.application.status].label} />
                  <Field label="Carrier" value={lead.application.carrierId} />
                  <Field label="Face amount" value={money(lead.application.faceAmount)} />
                  <Field label="Monthly premium" value={money(lead.application.monthlyPremium)} />
                </dl>
              </CardBody>
            ) : null}
          </Card>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader title="Tasks & follow-ups" action={<Clock className="h-4 w-4 text-ink-400" />} />
            <CardBody className="pt-0">
              <form onSubmit={saveTask} className="space-y-2 mb-4">
                <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Add callback or follow-up" className="w-full h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                <input type="datetime-local" value={taskDueAt} onChange={(e) => setTaskDueAt(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-white ring-1 ring-inset ring-ink-200 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                <Button type="submit" disabled={taskSaving} className="w-full">{taskSaving ? "Adding…" : "Add task"}</Button>
              </form>
              {leadTasks.length === 0 ? <p className="text-sm text-ink-500">No tasks scheduled.</p> : (
                <ul className="space-y-2.5">
                  {leadTasks.map((task) => {
                    const overdue = !task.completed && new Date(task.dueAt) < new Date() && new Date(task.dueAt).toDateString() !== new Date().toDateString();
                    return (
                      <li key={task.id} className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-ink-50">
                        <input type="checkbox" checked={task.completed} onChange={(e) => void toggleTask(task.id, e.target.checked)} className="mt-1 h-4 w-4 rounded border-ink-300 text-amber-500 focus:ring-amber-500" />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm ${task.completed ? "text-ink-400 line-through" : "text-ink-900"}`}>{task.title}</div>
                          <div className={`text-xs mt-0.5 ${overdue ? "text-danger-600 font-medium" : "text-ink-500"}`}>{overdue ? "Overdue · " : ""}{prettyDateTime(task.dueAt)}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Activity timeline" subtitle={`${activity.length} events`} action={<StickyNote className="h-4 w-4 text-ink-400" />} />
            <CardBody className="pt-0"><ActivityTimeline items={activity} /></CardBody>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function QuickFact({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-ink-500 font-medium">{label}</div>
      <div className={`text-sm mt-0.5 ${warn ? "text-danger-600 font-medium" : "text-ink-900"}`}>{value}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">{label}</dt>
      <dd className="text-sm mt-0.5 text-ink-900">{value}</dd>
    </div>
  );
}
