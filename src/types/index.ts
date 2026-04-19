// =====================================================================
// LifeFlow CRM — Domain types
// These describe every entity in the app. When you swap to Prisma/Supabase
// later, mirror these shapes in schema.prisma or your SQL schema.
// =====================================================================

export type UserRole = "owner" | "manager" | "agent" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string; // tailwind color token for initial avatar
}

// -------- Leads --------

export type LeadStatus =
  | "new_lead"
  | "attempted_contact"
  | "contact_made"
  | "needs_followup"
  | "quoted"
  | "application_started"
  | "underwriting_review"
  | "approved"
  | "sold"
  | "not_taken"
  | "dead_lead"
  | "do_not_call";

export type LeadSource =
  | "facebook"
  | "google"
  | "direct_mail"
  | "referral"
  | "tv"
  | "inbound_call"
  | "purchased_list"
  | "other";

export type LeadTemperature = "cold" | "warm" | "hot";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  dob?: string; // ISO date
  age?: number;
  gender?: "M" | "F";
  state: string; // two-letter code
  city?: string;
  zip?: string;
  status: LeadStatus;
  source: LeadSource;
  temperature: LeadTemperature;
  assignedAgentId: string;
  notesPreview?: string;
  createdAt: string;
  lastContactedAt?: string;
  nextFollowupAt?: string;
  underwriting?: Underwriting;
  carrierRecommendationId?: string;
  application?: Application;
  policy?: Policy;
}

// -------- Underwriting --------

export type RiskLevel = "preferred" | "standard" | "graded" | "modified" | "guaranteed" | "decline";

export interface Underwriting {
  tobacco: "none" | "current" | "former_under_12mo" | "former_over_12mo";
  heightInches?: number;
  weightLbs?: number;
  diabetes: "none" | "type2_oral" | "type2_insulin" | "type1" | "uncontrolled";
  copd: boolean;
  heartCondition: "none" | "history_over_2yr" | "recent";
  strokeHistory: "none" | "history_over_2yr" | "recent";
  cancerHistory: "none" | "remission_over_5yr" | "remission_under_5yr" | "active";
  hospitalizedLast2Years: boolean;
  numMedications: number;
  notes?: string;
  riskLevel?: RiskLevel;
  summary?: string;
}

// -------- Carriers --------

export interface Carrier {
  id: string;
  name: string;
  productTypes: string[]; // e.g. "Whole Life", "Final Expense Level"
  statesAvailable: string[]; // two-letter codes; "ALL" shorthand handled in UI
  preferredHealthProfiles: RiskLevel[]; // which risk tiers this carrier likes
  declineTriggers: string[]; // plain-english conditions that auto-decline
  notes?: string;
  riskAppetite: "conservative" | "moderate" | "aggressive";
  logoInitials: string; // for the square badge
  accentColor: string; // hex
}

// -------- Tasks / Follow-ups --------

export type TaskPriority = "low" | "normal" | "high";
export type TaskType = "callback" | "followup" | "quote_review" | "app_submit" | "other";

export interface Task {
  id: string;
  leadId: string;
  type: TaskType;
  title: string;
  dueAt: string; // ISO
  priority: TaskPriority;
  reason?: string;
  completed: boolean;
  completedAt?: string;
}

// -------- Applications / Policies --------

export type ApplicationStatus =
  | "not_started"
  | "started"
  | "submitted"
  | "pending_requirements"
  | "approved"
  | "declined"
  | "policy_issued";

export interface Application {
  id: string;
  status: ApplicationStatus;
  carrierId: string;
  product: string;
  faceAmount: number;
  monthlyPremium: number;
  draftDate?: number; // day of month 1–28
  beneficiary?: string;
  notes?: string;
  submittedAt?: string;
}

export interface Policy {
  policyNumber: string;
  issuedAt: string;
  effectiveAt: string;
  faceAmount: number;
  monthlyPremium: number;
  carrierId: string;
}

// -------- Activity / Notes --------

export type ActivityKind =
  | "call"
  | "note"
  | "status_change"
  | "text"
  | "email"
  | "task_created"
  | "task_completed"
  | "app_submitted"
  | "policy_issued";

export interface Activity {
  id: string;
  leadId: string;
  kind: ActivityKind;
  actorUserId: string;
  timestamp: string;
  body: string;
}
