import type { ReactNode } from "react";
"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { AppShell, EmptyPanel, PageHeader } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { useLeads } from "@/lib/hooks";
import { APP_STATUS } from "@/lib/status";
import { money, prettyDate } from "@/lib/format";
import type { ApplicationStatus } from "@/types";

export default function ApplicationsPage() {
  const { leads } = useLeads();
  const withApps = leads.filter((lead) => lead.application);
  const byStatus = (status: ApplicationStatus) => withApps.filter((lead) => lead.application!.status === status);
  const totalPremium = withApps.reduce((sum, lead) => sum + ((lead.application?.monthlyPremium || 0) * 12), 0);

  return (
    <AppShell>
      <PageHeader title="Applications" subtitle={`${withApps.length} applications in flight`} />
      {withApps.length === 0 ? (
        <EmptyPanel title="No applications yet" body="Start an application from a lead record and it will show up here." action={<Link href="/leads"><Buttonish>Go to leads</Buttonish></Link>} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="In progress" value={byStatus("started").length} accent="info" />
            <StatCard label="Submitted" value={byStatus("submitted").length + byStatus("pending_requirements").length} accent="info" />
            <StatCard label="Approved" value={byStatus("approved").length + byStatus("policy_issued").length} accent="success" />
            <StatCard label="Total annualized" value={money(totalPremium)} accent="success" />
          </div>
          <Card className="overflow-hidden">
            <CardHeader title="All applications" subtitle="Click to open the lead" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50">
                  <tr className="text-[11px] uppercase tracking-wider text-ink-500">
                    <th className="text-left font-medium px-4 py-3">Lead</th>
                    <th className="text-left font-medium px-4 py-3">Carrier</th>
                    <th className="text-left font-medium px-4 py-3">Product</th>
                    <th className="text-right font-medium px-4 py-3">Face</th>
                    <th className="text-right font-medium px-4 py-3">Monthly</th>
                    <th className="text-left font-medium px-4 py-3">Status</th>
                    <th className="text-left font-medium px-4 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {withApps.map((lead) => {
                    const app = lead.application!;
                    return (
                      <tr key={lead.id} className="hover:bg-ink-50/50">
                        <td className="px-4 py-3"><Link href={`/leads/${lead.id}`} className="font-medium text-ink-900 hover:text-amber-700">{lead.firstName} {lead.lastName}</Link><div className="text-xs text-ink-500 tabular mt-0.5">{lead.phone}</div></td>
                        <td className="px-4 py-3 text-ink-700">{app.carrierId}</td>
                        <td className="px-4 py-3 text-ink-700">{app.product}</td>
                        <td className="px-4 py-3 text-right tabular text-ink-700">{money(app.faceAmount)}</td>
                        <td className="px-4 py-3 text-right tabular font-semibold text-ink-900">{money(app.monthlyPremium)}</td>
                        <td className="px-4 py-3"><Badge className={APP_STATUS[app.status].tag}>{APP_STATUS[app.status].label}</Badge></td>
                        <td className="px-4 py-3 text-xs text-ink-500">{prettyDate(app.submittedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </AppShell>
  );
}

function Buttonish({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-10 items-center rounded-lg bg-ink-900 px-4 text-sm font-medium text-white">{children}</span>;
}
