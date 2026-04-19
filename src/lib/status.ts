import type { LeadStatus, ApplicationStatus, LeadSource, RiskLevel, TaskPriority } from "@/types";

// Each status gets a human label + a tag style (Tailwind classes for a small badge)
export const LEAD_STATUS: Record<LeadStatus, { label: string; tag: string; dot: string; group: "open" | "active" | "closed" }> = {
  new_lead:            { label: "New lead",            tag: "bg-info-50 text-info-600 ring-info-500/20",       dot: "bg-info-500",       group: "open" },
  attempted_contact:   { label: "Attempted contact",   tag: "bg-ink-50 text-ink-700 ring-ink-300",              dot: "bg-ink-400",        group: "open" },
  contact_made:        { label: "Contact made",        tag: "bg-ink-100 text-ink-800 ring-ink-300",             dot: "bg-ink-600",        group: "active" },
  needs_followup:      { label: "Needs follow-up",     tag: "bg-amber-50 text-amber-700 ring-amber-300",        dot: "bg-amber-500",      group: "active" },
  quoted:              { label: "Quoted",              tag: "bg-amber-100 text-amber-800 ring-amber-400",       dot: "bg-amber-600",      group: "active" },
  application_started: { label: "Application started", tag: "bg-info-50 text-info-700 ring-info-400",           dot: "bg-info-600",       group: "active" },
  underwriting_review: { label: "Underwriting review", tag: "bg-info-100 text-info-700 ring-info-400",          dot: "bg-info-600",       group: "active" },
  approved:            { label: "Approved",            tag: "bg-success-50 text-success-700 ring-success-500/30", dot: "bg-success-500",  group: "active" },
  sold:                { label: "Sold",                tag: "bg-success-500 text-white ring-success-600",       dot: "bg-white",          group: "closed" },
  not_taken:           { label: "Not taken",           tag: "bg-ink-100 text-ink-700 ring-ink-300",             dot: "bg-ink-400",        group: "closed" },
  dead_lead:           { label: "Dead lead",           tag: "bg-ink-200 text-ink-700 ring-ink-400",             dot: "bg-ink-500",        group: "closed" },
  do_not_call:         { label: "Do not call",         tag: "bg-danger-50 text-danger-700 ring-danger-500/30",  dot: "bg-danger-500",     group: "closed" },
};

export const APP_STATUS: Record<ApplicationStatus, { label: string; tag: string }> = {
  not_started:          { label: "Not started",          tag: "bg-ink-100 text-ink-700 ring-ink-300" },
  started:              { label: "Started",              tag: "bg-info-50 text-info-600 ring-info-400" },
  submitted:            { label: "Submitted",            tag: "bg-info-100 text-info-700 ring-info-500" },
  pending_requirements: { label: "Pending requirements", tag: "bg-amber-50 text-amber-700 ring-amber-400" },
  approved:             { label: "Approved",             tag: "bg-success-50 text-success-700 ring-success-500/30" },
  declined:             { label: "Declined",             tag: "bg-danger-50 text-danger-700 ring-danger-500/30" },
  policy_issued:        { label: "Policy issued",        tag: "bg-success-500 text-white ring-success-600" },
};

export const LEAD_SOURCE: Record<LeadSource, string> = {
  facebook:        "Facebook",
  google:          "Google",
  direct_mail:     "Direct mail",
  referral:        "Referral",
  tv:              "TV",
  inbound_call:    "Inbound call",
  purchased_list:  "Purchased list",
  other:           "Other",
};

export const RISK_LEVEL: Record<RiskLevel, { label: string; tag: string }> = {
  preferred:    { label: "Preferred",            tag: "bg-success-50 text-success-700 ring-success-500/30" },
  standard:     { label: "Standard",             tag: "bg-info-50 text-info-700 ring-info-400" },
  graded:       { label: "Graded",               tag: "bg-amber-50 text-amber-700 ring-amber-400" },
  modified:     { label: "Modified",             tag: "bg-amber-100 text-amber-800 ring-amber-500" },
  guaranteed:   { label: "Guaranteed issue",     tag: "bg-ink-100 text-ink-700 ring-ink-400" },
  decline:      { label: "Decline",              tag: "bg-danger-50 text-danger-700 ring-danger-500/30" },
};

export const PRIORITY: Record<TaskPriority, { label: string; tag: string }> = {
  low:    { label: "Low",    tag: "bg-ink-50 text-ink-600 ring-ink-300" },
  normal: { label: "Normal", tag: "bg-info-50 text-info-700 ring-info-400" },
  high:   { label: "High",   tag: "bg-danger-50 text-danger-700 ring-danger-500/30" },
};

export const TEMPERATURE = {
  hot:  { label: "Hot",  tag: "bg-amber-500 text-white",   icon: "🔥" },
  warm: { label: "Warm", tag: "bg-amber-100 text-amber-800", icon: "☀" },
  cold: { label: "Cold", tag: "bg-ink-100 text-ink-600",   icon: "❄" },
} as const;
