import type { ReactNode } from "react";
"use client";

import Link from "next/link";
import { Clock, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLeads, useTasks } from "@/lib/hooks";
import { PRIORITY } from "@/lib/status";
import { prettyDateTime, prettyTime } from "@/lib/format";
import type { Task } from "@/types";

export default function TasksPage() {
  const { tasks, toggleTask } = useTasks();
  const { leads } = useLeads();

  const overdue = tasks.filter((task) => !task.completed && new Date(task.dueAt) < new Date() && new Date(task.dueAt).toDateString() !== new Date().toDateString());
  const today = tasks.filter((task) => !task.completed && new Date(task.dueAt).toDateString() === new Date().toDateString());
  const upcoming = tasks.filter((task) => !task.completed && new Date(task.dueAt) > new Date() && new Date(task.dueAt).toDateString() !== new Date().toDateString());

  return (
    <AppShell>
      <PageHeader title="Tasks & follow-ups" subtitle={`${overdue.length} overdue · ${today.length} today · ${upcoming.length} upcoming`} />
      <div className="space-y-4 lg:space-y-6">
        {overdue.length > 0 && <TaskGroup title="Overdue" count={overdue.length} tasks={overdue} accent="danger" icon={<AlertCircle className="h-4 w-4" />} leads={leads} toggleTask={toggleTask} />}
        <TaskGroup title="Today" count={today.length} tasks={today} accent="amber" icon={<Clock className="h-4 w-4" />} leads={leads} toggleTask={toggleTask} />
        <TaskGroup title="Upcoming" count={upcoming.length} tasks={upcoming} accent="ink" icon={<Clock className="h-4 w-4" />} leads={leads} toggleTask={toggleTask} />
      </div>
    </AppShell>
  );
}

function TaskGroup({ title, count, tasks, accent, icon, leads, toggleTask }: { title: string; count: number; tasks: Task[]; accent: "danger" | "amber" | "ink"; icon: ReactNode; leads: ReturnType<typeof useLeads>["leads"]; toggleTask: ReturnType<typeof useTasks>["toggleTask"]; }) {
  const accentMap = { danger: "text-danger-700 bg-danger-50", amber: "text-amber-700 bg-amber-50", ink: "text-ink-700 bg-ink-100" };
  return (
    <Card>
      <CardHeader title={<span className="flex items-center gap-2"><span className={`h-7 w-7 rounded-md flex items-center justify-center ${accentMap[accent]}`}>{icon}</span>{title}<Badge className="bg-ink-100 text-ink-700 ring-ink-200">{count}</Badge></span>} />
      <CardBody className="pt-0">
        {tasks.length === 0 ? (
          <div className="py-6 text-center"><CheckCircle2 className="h-6 w-6 mx-auto text-success-500 mb-2" /><p className="text-sm text-ink-500">Nothing here. Clean slate.</p></div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {tasks.map((task) => {
              const lead = leads.find((entry) => entry.id === task.leadId);
              return (
                <li key={task.id} className="py-3 flex items-center gap-3">
                  <input type="checkbox" checked={task.completed} onChange={(e) => void toggleTask(task.id, e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-amber-500 focus:ring-amber-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {lead ? <Link href={`/leads/${lead.id}`} className="font-medium text-sm text-ink-900 hover:text-amber-700">{lead.firstName} {lead.lastName}</Link> : <span className="font-medium text-sm text-ink-900">Lead deleted</span>}
                      <Badge className={PRIORITY[task.priority].tag}>{PRIORITY[task.priority].label}</Badge>
                    </div>
                    <div className="text-sm text-ink-700 mt-0.5">{task.title}</div>
                    <div className="text-xs text-ink-500 tabular mt-1 flex items-center gap-3">
                      {lead ? <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span> : null}
                      <span>{accent === "amber" ? prettyTime(task.dueAt) : prettyDateTime(task.dueAt)}</span>
                    </div>
                  </div>
                  {lead ? <Link href={`/leads/${lead.id}`}><Button size="sm" variant="secondary" iconLeft={<Phone className="h-3.5 w-3.5" />}>Call</Button></Link> : null}
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
