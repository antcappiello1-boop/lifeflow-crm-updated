// =====================================================================
// Carrier matching
// ---------------------------------------------------------------------
// Simple rule-based scoring. Given an underwriting profile, rank each
// carrier from best-fit to worst-fit. In a real deployment you'd back
// this with actual carrier underwriting guides, but the shape is right.
// =====================================================================

import type { Carrier, Underwriting, RiskLevel } from "@/types";

export interface CarrierMatch {
  carrier: Carrier;
  score: number;        // 0–100, higher = better fit
  verdict: "best_fit" | "likely_fit" | "possible_fit" | "poor_fit" | "decline";
  reasons: string[];    // plain-english bullets
}

// Derive a risk level from raw underwriting inputs (if one isn't set).
export function deriveRiskLevel(uw: Underwriting): RiskLevel {
  if (uw.cancerHistory === "active") return "decline";
  if (uw.heartCondition === "recent" || uw.strokeHistory === "recent") return "decline";

  if (uw.diabetes === "uncontrolled" || uw.copd) return "guaranteed";
  if (uw.cancerHistory === "remission_under_5yr") return "graded";
  if (uw.hospitalizedLast2Years && uw.numMedications > 5) return "modified";

  const bmi = uw.heightInches && uw.weightLbs
    ? (uw.weightLbs * 703) / (uw.heightInches * uw.heightInches)
    : null;

  if (uw.diabetes === "type2_insulin" || uw.diabetes === "type1") return "graded";
  if (uw.tobacco === "current") return "standard";
  if (bmi && bmi > 40) return "modified";
  if (bmi && bmi > 35) return "graded";

  if (uw.numMedications <= 2 && uw.diabetes === "none" && uw.heartCondition === "none") {
    return "preferred";
  }
  return "standard";
}

export function matchCarriers(uw: Underwriting, carriers: Carrier[]): CarrierMatch[] {
  const risk = uw.riskLevel ?? deriveRiskLevel(uw);

  return carriers
    .map((carrier) => {
      const reasons: string[] = [];
      let score = 50;

      // Core fit: does the carrier like this risk tier?
      if (carrier.preferredHealthProfiles.includes(risk)) {
        score += 30;
        reasons.push(`Strong fit for ${risk} health class`);
      } else {
        score -= 15;
        reasons.push(`${carrier.name} typically avoids ${risk} risk`);
      }

      // Triggers from raw inputs
      if (uw.cancerHistory === "active" && carrier.declineTriggers.some(t => t.toLowerCase().includes("cancer"))) {
        score = 0;
        reasons.push("Active cancer — auto decline");
      }
      if (uw.heartCondition === "recent" && carrier.declineTriggers.some(t => t.toLowerCase().includes("heart"))) {
        score -= 40;
        reasons.push("Recent heart condition flagged by carrier");
      }
      if (uw.strokeHistory === "recent" && carrier.declineTriggers.some(t => t.toLowerCase().includes("stroke"))) {
        score -= 40;
        reasons.push("Recent stroke flagged by carrier");
      }

      // Risk appetite
      if (risk === "guaranteed" && carrier.riskAppetite !== "aggressive") {
        score -= 20;
        reasons.push("Carrier is conservative — GI unlikely");
      }
      if (risk === "preferred" && carrier.riskAppetite === "aggressive") {
        score -= 5;
        reasons.push("Overkill — a conservative carrier likely beats pricing");
      }

      // Diabetes nuance
      if (uw.diabetes === "type2_insulin" && carrier.name === "Mutual of Omaha") {
        score -= 10;
        reasons.push("MoO tough on insulin-dependent");
      }
      if (uw.diabetes !== "none" && carrier.name === "Americo") {
        score += 8;
        reasons.push("Americo flexible on diabetes");
      }

      score = Math.max(0, Math.min(100, score));

      const verdict: CarrierMatch["verdict"] =
        score >= 75 ? "best_fit" :
        score >= 60 ? "likely_fit" :
        score >= 40 ? "possible_fit" :
        score > 0   ? "poor_fit" : "decline";

      return { carrier, score, verdict, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

export const VERDICT_META: Record<CarrierMatch["verdict"], { label: string; tag: string }> = {
  best_fit:     { label: "Best fit",     tag: "bg-success-500 text-white" },
  likely_fit:   { label: "Likely fit",   tag: "bg-success-50 text-success-700 ring-1 ring-success-500/30" },
  possible_fit: { label: "Possible fit", tag: "bg-amber-50 text-amber-700 ring-1 ring-amber-400" },
  poor_fit:     { label: "Poor fit",     tag: "bg-ink-100 text-ink-600 ring-1 ring-ink-300" },
  decline:      { label: "Decline",      tag: "bg-danger-50 text-danger-700 ring-1 ring-danger-500/30" },
};
