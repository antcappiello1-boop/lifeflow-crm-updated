import type {
  User, Lead, Carrier, Task, Activity, Underwriting, Application,
} from "@/types";

// =====================================================================
// USERS
// =====================================================================
export const users: User[] = [
  { id: "u1", name: "Ray Mercer",    email: "ray@lifeflow.com",    role: "owner",   avatarColor: "bg-ink-700" },
  { id: "u2", name: "Tasha Wells",   email: "tasha@lifeflow.com",  role: "manager", avatarColor: "bg-amber-600" },
  { id: "u3", name: "Devon Hayes",   email: "devon@lifeflow.com",  role: "agent",   avatarColor: "bg-success-600" },
  { id: "u4", name: "Priya Okafor",  email: "priya@lifeflow.com",  role: "agent",   avatarColor: "bg-info-600" },
  { id: "u5", name: "Marco Russo",   email: "marco@lifeflow.com",  role: "agent",   avatarColor: "bg-danger-600" },
];

export const currentUser: User = users[2]; // Devon, an agent, is the logged-in user

// =====================================================================
// CARRIERS
// =====================================================================
export const carriers: Carrier[] = [
  {
    id: "c1", name: "Mutual of Omaha",
    productTypes: ["Living Promise Level", "Living Promise Graded"],
    statesAvailable: ["ALL"],
    preferredHealthProfiles: ["preferred", "standard"],
    declineTriggers: ["Active cancer treatment", "Currently on oxygen", "Congestive heart failure"],
    notes: "Strong in level benefit. Avoid for insulin-dependent diabetics under 50.",
    riskAppetite: "conservative", logoInitials: "MO", accentColor: "#003b5c",
  },
  {
    id: "c2", name: "Americo",
    productTypes: ["Eagle Premier", "Eagle Select", "Eagle Guard"],
    statesAvailable: ["ALL"],
    preferredHealthProfiles: ["preferred", "standard", "graded"],
    declineTriggers: ["Insulin shock in last 12 months", "Felony conviction in last 10yr"],
    notes: "Great for mild-moderate health issues. Flexible on diabetes.",
    riskAppetite: "moderate", logoInitials: "AM", accentColor: "#c8102e",
  },
  {
    id: "c3", name: "Corebridge Financial",
    productTypes: ["Guaranteed Issue Whole Life", "Simplified Issue"],
    statesAvailable: ["ALL"],
    preferredHealthProfiles: ["graded", "modified", "guaranteed"],
    declineTriggers: [],
    notes: "Guaranteed issue fallback. Higher premium but accepts almost anyone 50–80.",
    riskAppetite: "aggressive", logoInitials: "CB", accentColor: "#1a3e72",
  },
  {
    id: "c4", name: "Transamerica",
    productTypes: ["Immediate Solution", "Easy Solution"],
    statesAvailable: ["ALL"],
    preferredHealthProfiles: ["preferred", "standard", "graded"],
    declineTriggers: ["Stroke in last 24 months", "Oxygen use"],
    notes: "Competitive rates for non-tobacco. Strict on cardiac history.",
    riskAppetite: "conservative", logoInitials: "TA", accentColor: "#e87722",
  },
  {
    id: "c5", name: "Liberty Bankers",
    productTypes: ["SafeGuard Plus", "Guaranteed Assurance"],
    statesAvailable: ["ALL"],
    preferredHealthProfiles: ["standard", "graded", "modified"],
    declineTriggers: ["Active cancer", "Terminal diagnosis"],
    notes: "Solid for table-rated cases. Good graded product.",
    riskAppetite: "moderate", logoInitials: "LB", accentColor: "#00573f",
  },
];

// =====================================================================
// LEADS (sample set — enough to populate every view realistically)
// =====================================================================

const uw = (o: Partial<Underwriting>): Underwriting => ({
  tobacco: "none", diabetes: "none", copd: false,
  heartCondition: "none", strokeHistory: "none", cancerHistory: "none",
  hospitalizedLast2Years: false, numMedications: 0, ...o,
});

const app = (o: Partial<Application>): Application => ({
  id: "a_" + Math.random().toString(36).slice(2, 8),
  status: "not_started", carrierId: "c1", product: "Living Promise Level",
  faceAmount: 10000, monthlyPremium: 52, ...o,
});

export const leads: Lead[] = [
  {
    id: "l1", firstName: "Dorothy", lastName: "Ashford", phone: "(407) 555-2841",
    email: "dorothy.a@gmail.com", age: 68, gender: "F", state: "FL", city: "Ocala", zip: "34470",
    status: "quoted", source: "facebook", temperature: "hot",
    assignedAgentId: "u3", createdAt: "2026-04-14T15:22:00Z", lastContactedAt: "2026-04-17T13:10:00Z",
    nextFollowupAt: "2026-04-17T19:00:00Z",
    notesPreview: "Wants $15k. Husband passed 6mo ago, motivated.",
    underwriting: uw({ heightInches: 64, weightLbs: 172, numMedications: 2, riskLevel: "standard",
      summary: "Standard risk. Mild hypertension, well controlled. Level benefit candidate." }),
    carrierRecommendationId: "c1",
    application: app({ status: "started", faceAmount: 15000, monthlyPremium: 78, beneficiary: "Daughter — Karen Ashford" }),
  },
  {
    id: "l2", firstName: "Raymond", lastName: "Polk", phone: "(216) 555-9013",
    age: 72, gender: "M", state: "OH", city: "Akron",
    status: "new_lead", source: "direct_mail", temperature: "warm",
    assignedAgentId: "u3", createdAt: "2026-04-17T12:04:00Z",
    notesPreview: "Responded to DM card. Retired steelworker.",
  },
  {
    id: "l3", firstName: "Evelyn", lastName: "Marsh", phone: "(903) 555-1127",
    email: "evelyn.marsh@outlook.com", age: 61, gender: "F", state: "TX", city: "Tyler",
    status: "needs_followup", source: "facebook", temperature: "warm",
    assignedAgentId: "u3", createdAt: "2026-04-10T09:00:00Z", lastContactedAt: "2026-04-15T16:30:00Z",
    nextFollowupAt: "2026-04-17T16:00:00Z",
    notesPreview: "Asked to call back Friday after her doctor's appointment.",
    underwriting: uw({ heightInches: 65, weightLbs: 188, diabetes: "type2_oral", numMedications: 4,
      riskLevel: "standard", summary: "Type 2 oral meds, no complications. Standard at most carriers." }),
  },
  {
    id: "l4", firstName: "Marcus", lastName: "Deland", phone: "(602) 555-6677",
    age: 58, gender: "M", state: "AZ", city: "Mesa",
    status: "application_started", source: "google", temperature: "hot",
    assignedAgentId: "u3", createdAt: "2026-04-08T11:20:00Z", lastContactedAt: "2026-04-16T20:15:00Z",
    notesPreview: "App in progress. Needs voided check for draft.",
    underwriting: uw({ heightInches: 70, weightLbs: 210, tobacco: "former_over_12mo", numMedications: 1,
      riskLevel: "standard", summary: "Former smoker 3yr, otherwise clean. Good candidate." }),
    carrierRecommendationId: "c2",
    application: app({ status: "started", carrierId: "c2", product: "Eagle Premier",
      faceAmount: 20000, monthlyPremium: 94, beneficiary: "Spouse — Linda Deland" }),
  },
  {
    id: "l5", firstName: "Juanita", lastName: "Vega", phone: "(956) 555-3345",
    age: 74, gender: "F", state: "TX", city: "McAllen",
    status: "sold", source: "referral", temperature: "warm",
    assignedAgentId: "u4", createdAt: "2026-03-20T14:00:00Z", lastContactedAt: "2026-04-12T10:00:00Z",
    notesPreview: "Sold $10k Corebridge GI. Policy issued.",
    underwriting: uw({ heightInches: 62, weightLbs: 155, diabetes: "type2_insulin",
      heartCondition: "history_over_2yr", numMedications: 7, riskLevel: "guaranteed",
      summary: "Complex health — GI was right fit. Accepted, drafting monthly." }),
    carrierRecommendationId: "c3",
    application: app({ status: "policy_issued", carrierId: "c3", product: "Guaranteed Issue Whole Life",
      faceAmount: 10000, monthlyPremium: 88, beneficiary: "Son — Miguel Vega", submittedAt: "2026-03-28T00:00:00Z" }),
    policy: { policyNumber: "CB-2026-44871", issuedAt: "2026-04-05T00:00:00Z",
      effectiveAt: "2026-04-10T00:00:00Z", faceAmount: 10000, monthlyPremium: 88, carrierId: "c3" },
  },
  {
    id: "l6", firstName: "Harold", lastName: "Benning", phone: "(304) 555-7788",
    age: 69, gender: "M", state: "WV", city: "Charleston",
    status: "contact_made", source: "tv", temperature: "warm",
    assignedAgentId: "u5", createdAt: "2026-04-15T18:40:00Z", lastContactedAt: "2026-04-16T14:00:00Z",
    nextFollowupAt: "2026-04-18T15:00:00Z",
    notesPreview: "Interested but shopping. Wife wants to compare.",
  },
  {
    id: "l7", firstName: "Loretta", lastName: "Sims", phone: "(334) 555-4421",
    age: 77, gender: "F", state: "AL", city: "Montgomery",
    status: "underwriting_review", source: "direct_mail", temperature: "hot",
    assignedAgentId: "u4", createdAt: "2026-04-02T10:00:00Z", lastContactedAt: "2026-04-14T11:20:00Z",
    notesPreview: "App submitted to Americo. Waiting on Rx check.",
    underwriting: uw({ heightInches: 63, weightLbs: 210, diabetes: "type2_oral",
      numMedications: 5, riskLevel: "graded",
      summary: "Graded case. Americo Eagle Select most likely approval." }),
    carrierRecommendationId: "c2",
    application: app({ status: "pending_requirements", carrierId: "c2", product: "Eagle Select",
      faceAmount: 12000, monthlyPremium: 96, submittedAt: "2026-04-14T00:00:00Z" }),
  },
  {
    id: "l8", firstName: "Bernard", lastName: "Quill", phone: "(717) 555-0098",
    age: 81, gender: "M", state: "PA",
    status: "attempted_contact", source: "purchased_list", temperature: "cold",
    assignedAgentId: "u3", createdAt: "2026-04-16T08:00:00Z",
    notesPreview: "3 attempts — left voicemail. Try again tomorrow AM.",
    nextFollowupAt: "2026-04-18T10:00:00Z",
  },
  {
    id: "l9", firstName: "Glenda", lastName: "Torres", phone: "(702) 555-2210",
    age: 65, gender: "F", state: "NV", city: "Henderson",
    status: "approved", source: "facebook", temperature: "hot",
    assignedAgentId: "u5", createdAt: "2026-04-05T13:00:00Z", lastContactedAt: "2026-04-16T17:45:00Z",
    notesPreview: "Approved standard. Awaiting policy delivery.",
    underwriting: uw({ heightInches: 66, weightLbs: 145, numMedications: 1, riskLevel: "preferred",
      summary: "Clean health. Preferred rate. Easy approval." }),
    carrierRecommendationId: "c4",
    application: app({ status: "approved", carrierId: "c4", product: "Immediate Solution",
      faceAmount: 25000, monthlyPremium: 118, submittedAt: "2026-04-10T00:00:00Z" }),
  },
  {
    id: "l10", firstName: "Dale", lastName: "Whitaker", phone: "(503) 555-6655",
    age: 70, gender: "M", state: "OR",
    status: "do_not_call", source: "purchased_list", temperature: "cold",
    assignedAgentId: "u3", createdAt: "2026-03-15T00:00:00Z",
    notesPreview: "Requested DNC on 4/11.",
  },
  {
    id: "l11", firstName: "Arlene", lastName: "Bishop", phone: "(615) 555-9911",
    email: "arlene.b@yahoo.com", age: 73, gender: "F", state: "TN", city: "Nashville",
    status: "needs_followup", source: "referral", temperature: "hot",
    assignedAgentId: "u3", createdAt: "2026-04-11T10:00:00Z", lastContactedAt: "2026-04-14T15:00:00Z",
    nextFollowupAt: "2026-04-17T14:30:00Z",
    notesPreview: "Referral from Juanita Vega. Ready to move forward.",
    underwriting: uw({ heightInches: 64, weightLbs: 160, numMedications: 2, riskLevel: "standard" }),
  },
  {
    id: "l12", firstName: "Orville", lastName: "Pace", phone: "(704) 555-3322",
    age: 66, gender: "M", state: "NC",
    status: "not_taken", source: "facebook", temperature: "cold",
    assignedAgentId: "u4", createdAt: "2026-03-28T00:00:00Z", lastContactedAt: "2026-04-08T00:00:00Z",
    notesPreview: "Approved but didn't take policy. Budget concerns.",
  },
  {
    id: "l13", firstName: "Mabel", lastName: "Drexler", phone: "(313) 555-8844",
    age: 79, gender: "F", state: "MI",
    status: "dead_lead", source: "purchased_list", temperature: "cold",
    assignedAgentId: "u3", createdAt: "2026-02-10T00:00:00Z",
    notesPreview: "7 attempts, no contact. Closed out.",
  },
  {
    id: "l14", firstName: "Frank", lastName: "Osei", phone: "(678) 555-7733",
    age: 62, gender: "M", state: "GA", city: "Atlanta",
    status: "new_lead", source: "google", temperature: "warm",
    assignedAgentId: "u3", createdAt: "2026-04-17T14:00:00Z",
    notesPreview: "Filled out web form 2hr ago. No contact yet.",
  },
];

// =====================================================================
// TASKS (follow-ups)
// =====================================================================
const today = new Date();
const iso = (d: Date) => d.toISOString();
const mkDate = (dayOffset: number, hour: number, min = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, min, 0, 0);
  return iso(d);
};

export const tasks: Task[] = [
  { id: "t1", leadId: "l1", type: "callback", title: "Follow up on quote — ready to close",
    dueAt: mkDate(0, 15), priority: "high", reason: "Quote sent, said call at 3pm",
    completed: false },
  { id: "t2", leadId: "l3", type: "callback", title: "Callback after doctor appt",
    dueAt: mkDate(0, 16), priority: "high", completed: false },
  { id: "t3", leadId: "l11", type: "followup", title: "Run underwriting, recommend carrier",
    dueAt: mkDate(0, 14, 30), priority: "high", completed: false },
  { id: "t4", leadId: "l4", type: "app_submit", title: "Collect voided check, submit app",
    dueAt: mkDate(0, 11), priority: "high", completed: true, completedAt: mkDate(0, 10) },
  { id: "t5", leadId: "l6", type: "callback", title: "Follow up after wife's review",
    dueAt: mkDate(1, 15), priority: "normal", completed: false },
  { id: "t6", leadId: "l8", type: "callback", title: "Retry — 4th attempt",
    dueAt: mkDate(1, 10), priority: "normal", completed: false },
  { id: "t7", leadId: "l7", type: "followup", title: "Check underwriting decision",
    dueAt: mkDate(-1, 14), priority: "high", completed: false }, // OVERDUE
  { id: "t8", leadId: "l2", type: "callback", title: "First contact attempt",
    dueAt: mkDate(-2, 10), priority: "normal", completed: false }, // OVERDUE
];

// =====================================================================
// ACTIVITY (for timelines)
// =====================================================================
export const activity: Activity[] = [
  { id: "ac1", leadId: "l1", kind: "call", actorUserId: "u3", timestamp: mkDate(0, 13, 10),
    body: "Spoke 14 min. Quoted $15k level at $78/mo. Wants to close today." },
  { id: "ac2", leadId: "l1", kind: "status_change", actorUserId: "u3", timestamp: mkDate(0, 13, 12),
    body: "Status changed: Contact made → Quoted" },
  { id: "ac3", leadId: "l1", kind: "task_created", actorUserId: "u3", timestamp: mkDate(0, 13, 13),
    body: "Task created: Follow up on quote — ready to close (today 3:00pm)" },
  { id: "ac4", leadId: "l1", kind: "note", actorUserId: "u3", timestamp: mkDate(-1, 16, 20),
    body: "Initial call. Dorothy's husband passed 6mo ago, she wants $15k to cover her own final expenses. No other coverage. Motivated." },
  { id: "ac5", leadId: "l4", kind: "app_submitted", actorUserId: "u3", timestamp: mkDate(-1, 11),
    body: "Application started — Americo Eagle Premier $20k, $94/mo" },
  { id: "ac6", leadId: "l5", kind: "policy_issued", actorUserId: "u4", timestamp: mkDate(-12, 9),
    body: "Policy issued: Corebridge CB-2026-44871 — $10k, $88/mo" },
];
