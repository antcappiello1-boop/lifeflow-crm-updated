"use client";

import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { carriers } from "@/data/seed";
import { RISK_LEVEL } from "@/lib/status";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CarriersPage() {
  return (
    <AppShell>
      <PageHeader title="Carriers" subtitle="Your contracted carriers and their fit profiles" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {carriers.map((carrier) => (
          <Card key={carrier.id}>
            <div className="p-5 border-b border-ink-100 flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: carrier.accentColor }}>{carrier.logoInitials}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold text-ink-900">{carrier.name}</h3>
                <p className="text-xs text-ink-500 capitalize">{carrier.riskAppetite} risk appetite</p>
              </div>
            </div>
            <CardBody className="space-y-4 pt-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium mb-1.5">Products</div>
                <div className="flex flex-wrap gap-1">{carrier.productTypes.map((product) => <Badge key={product} className="bg-ink-50 text-ink-700 ring-ink-200">{product}</Badge>)}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium mb-1.5">Preferred profiles</div>
                <div className="flex flex-wrap gap-1">{carrier.preferredHealthProfiles.map((profile) => <Badge key={profile} className={RISK_LEVEL[profile].tag}>{RISK_LEVEL[profile].label}</Badge>)}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium mb-1.5">State availability</div>
                <p className="text-xs text-ink-700">{carrier.statesAvailable.includes("ALL") ? "All states" : carrier.statesAvailable.join(", ")}</p>
              </div>
              {carrier.declineTriggers.length > 0 ? <div><div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium mb-1.5">Decline triggers</div><ul className="space-y-1">{carrier.declineTriggers.map((trigger) => <li key={trigger} className="text-xs text-ink-700 flex items-start gap-1.5"><XCircle className="h-3 w-3 text-danger-500 flex-shrink-0 mt-0.5" />{trigger}</li>)}</ul></div> : null}
              {carrier.notes ? <div className="p-3 rounded-lg bg-amber-50 ring-1 ring-amber-200"><p className="text-xs text-ink-800"><CheckCircle2 className="inline h-3 w-3 text-amber-600 mr-1" />{carrier.notes}</p></div> : null}
            </CardBody>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
