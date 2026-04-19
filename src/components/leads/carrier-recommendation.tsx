import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { matchCarriers, VERDICT_META } from "@/lib/carrier-match";
import { carriers as seedCarriers } from "@/data/seed";
import type { Underwriting } from "@/types";
import { Shield, Check } from "lucide-react";

export function CarrierRecommendation({
  uw, currentCarrierId,
}: {
  uw?: Underwriting;
  currentCarrierId?: string;
}) {
  if (!uw) return null;

  const matches = matchCarriers(uw, seedCarriers).slice(0, 4);

  return (
    <Card>
      <CardHeader
        title="Carrier recommendation"
        subtitle="Ranked by fit for this health profile"
        action={<Shield className="h-4 w-4 text-ink-400" />}
      />
      <CardBody className="pt-0 space-y-2">
        {matches.map((m) => {
          const isCurrent = currentCarrierId === m.carrier.id;
          return (
            <div
              key={m.carrier.id}
              className={`p-3 rounded-lg ring-1 transition-colors ${
                isCurrent
                  ? "bg-amber-50 ring-amber-300"
                  : "bg-white ring-ink-100 hover:ring-ink-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: m.carrier.accentColor }}
                >
                  {m.carrier.logoInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink-900 text-sm">{m.carrier.name}</span>
                      {isCurrent && (
                        <Badge className="bg-amber-500 text-white">
                          <Check className="h-3 w-3" /> Selected
                        </Badge>
                      )}
                    </div>
                    <Badge className={VERDICT_META[m.verdict].tag}>{VERDICT_META[m.verdict].label}</Badge>
                  </div>
                  <div className="text-xs text-ink-500 mb-1.5">
                    {m.carrier.productTypes[0]} · Fit score {m.score}
                  </div>
                  <ul className="text-xs text-ink-600 space-y-0.5">
                    {m.reasons.slice(0, 2).map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-ink-300 mt-0.5">·</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
