"use client";

import { LeadsTable } from "@/components/leads/leads-table";
import { useLeads } from "@/lib/hooks";

export default function LeadsPage() {
  const { leads, addLead, updateLead, loading } = useLeads();
  return <LeadsTable leads={leads} loading={loading} addLead={addLead} updateLead={updateLead} />;
}
