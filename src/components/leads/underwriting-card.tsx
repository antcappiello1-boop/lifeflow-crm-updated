import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RISK_LEVEL } from "@/lib/status";
import type { Underwriting } from "@/types";
import { Stethoscope, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnderwritingCard({ uw }: { uw?: Underwriting }) {
  if (!uw) {
    return (
      <Card>
        <CardHeader
          title="Underwriting"
          subtitle="No intake completed yet"
          action={<Button size="sm" iconLeft={<Stethoscope className="h-4 w-4" />}>Start intake</Button>}
        />
        <CardBody className="pt-0">
          <div className="py-6 text-center text-sm text-ink-500">
            Walk through the health questions with the lead to get a carrier fit.
          </div>
        </CardBody>
      </Card>
    );
  }

  const bmi = uw.heightInches && uw.weightLbs
    ? ((uw.weightLbs * 703) / (uw.heightInches * uw.heightInches)).toFixed(1)
    : null;

  const fields: Array<[string, string]> = [
    ["Tobacco", fmtTobacco(uw.tobacco)],
    ["Height / Weight", uw.heightInches && uw.weightLbs
      ? `${Math.floor(uw.heightInches / 12)}'${uw.heightInches % 12}" · ${uw.weightLbs} lb${bmi ? ` · BMI ${bmi}` : ""}`
      : "—"],
    ["Diabetes", fmtDiabetes(uw.diabetes)],
    ["COPD", uw.copd ? "Yes" : "No"],
    ["Heart condition", fmtHistory(uw.heartCondition)],
    ["Stroke history", fmtHistory(uw.strokeHistory)],
    ["Cancer history", fmtCancer(uw.cancerHistory)],
    ["Hospitalized (2yr)", uw.hospitalizedLast2Years ? "Yes" : "No"],
    ["Medications", String(uw.numMedications)],
  ];

  return (
    <Card>
      <CardHeader
        title="Underwriting"
        subtitle="Health profile for carrier matching"
        action={
          <div className="flex items-center gap-2">
            {uw.riskLevel && (
              <Badge className={RISK_LEVEL[uw.riskLevel].tag}>{RISK_LEVEL[uw.riskLevel].label}</Badge>
            )}
            <Button size="sm" variant="ghost" iconLeft={<Pencil className="h-3.5 w-3.5" />}>Edit</Button>
          </div>
        }
      />
      <CardBody className="pt-0">
        <dl className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
          {fields.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[11px] uppercase tracking-wider text-ink-500 font-medium">{k}</dt>
              <dd className="text-sm text-ink-900 mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>

        {uw.summary && (
          <div className="mt-4 pt-4 border-t border-ink-100">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-medium mb-1">Summary</div>
            <p className="text-sm text-ink-700">{uw.summary}</p>
          </div>
        )}

        {uw.notes && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 ring-1 ring-amber-200">
            <div className="text-[11px] uppercase tracking-wider text-amber-700 font-medium mb-1">Agent notes</div>
            <p className="text-sm text-ink-800">{uw.notes}</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

const fmtTobacco = (t: Underwriting["tobacco"]) => ({
  none: "Non-user",
  current: "Current user",
  former_under_12mo: "Former (< 12 mo)",
  former_over_12mo: "Former (> 12 mo)",
}[t]);

const fmtDiabetes = (d: Underwriting["diabetes"]) => ({
  none: "None",
  type2_oral: "Type 2 — oral",
  type2_insulin: "Type 2 — insulin",
  type1: "Type 1",
  uncontrolled: "Uncontrolled",
}[d]);

const fmtHistory = (h: "none" | "history_over_2yr" | "recent") => ({
  none: "None",
  history_over_2yr: "History (> 2 yr)",
  recent: "Recent (< 2 yr)",
}[h]);

const fmtCancer = (c: Underwriting["cancerHistory"]) => ({
  none: "None",
  remission_over_5yr: "Remission (> 5 yr)",
  remission_under_5yr: "Remission (< 5 yr)",
  active: "Active treatment",
}[c]);
