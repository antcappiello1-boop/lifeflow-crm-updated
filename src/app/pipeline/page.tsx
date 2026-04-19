"use client";

import Link from "next/link";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/lib/hooks";
import { LEAD_STATUS, TEMPERATURE } from "@/lib/status";
import type { LeadStatus } from "@/types";

const PIPELINE_STAGES: LeadStatus[] = ["new_lead", "contact_made", "needs_followup", "quoted", "application_started", "underwriting_review", "approved", "sold"];

export default function PipelinePage() {
  const { leads } = useLeads();
  return (
    <AppShell>
      <PageHeader title="Pipeline" subtitle="This board is live. Open a lead to update the stage and it moves here automatically." />
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-4"><div className="flex gap-4 min-w-max">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.status === stage);
          const meta = LEAD_STATUS[stage];
          return (
            <div key={stage} className="w-72 flex-shrink-0">
              <div className="flex items-center justify-between mb-3 px-1"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${meta.dot}`} /><h3 className="text-xs font-semibold uppercase tracking-wider text-ink-700">{meta.label}</h3></div><span className="text-xs text-ink-500 tabular">{stageLeads.length}</span></div>
              <div className="space-y-2 min-h-[200px]">
                {stageLeads.map((lead) => (
                  <Link key={lead.id} href={`/leads/${lead.id}`} className="block bg-white rounded-lg shadow-card ring-1 ring-ink-100 p-3 hover:shadow-card-hover hover:ring-ink-200 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1"><span className="font-medium text-sm text-ink-900">{lead.firstName} {lead.lastName}</span><span className="text-xs">{TEMPERATURE[lead.temperature].icon}</span></div>
                    <div className="text-xs text-ink-500 tabular mb-1">{lead.phone}</div>
                    {lead.notesPreview ? <p className="text-xs text-ink-600 line-clamp-2">{lead.notesPreview}</p> : null}
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-ink-400"><Badge className="bg-ink-50 text-ink-600 ring-ink-200">{lead.state}</Badge></div>
                  </Link>
                ))}
                {stageLeads.length === 0 ? <div className="text-center py-8 text-xs text-ink-400 border-2 border-dashed border-ink-200 rounded-lg">No leads</div> : null}
              </div>
            </div>
          );
        })}
      </div></div>
    </AppShell>
  );
}
