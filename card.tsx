"use client";

import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { LEAD_STATUS } from "@/lib/status";

export default function SettingsPage() {
  const { profile, subscription } = useAuth();
  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Core account and billing information" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader title="Account" subtitle="Who owns this CRM workspace" />
          <CardBody className="pt-0 space-y-3 text-sm text-ink-700">
            <div><span className="text-ink-500">Name:</span> {profile?.full_name || "—"}</div>
            <div><span className="text-ink-500">Email:</span> {profile?.email || "—"}</div>
            <div><span className="text-ink-500">Role:</span> <span className="capitalize">{profile?.role || "owner"}</span></div>
            <div><span className="text-ink-500">Billing status:</span> <span className="capitalize">{subscription?.status || "inactive"}</span></div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Lead statuses" subtitle="Visual reference used across the CRM" />
          <CardBody className="pt-0"><div className="flex flex-wrap gap-2">{Object.entries(LEAD_STATUS).map(([key, value]) => <Badge key={key} className={value.tag} dot={value.dot}>{value.label}</Badge>)}</div></CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
