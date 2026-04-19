"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { carriers as seedCarriers } from "@/data/seed";
import type { Activity, Application, Carrier, Lead, LeadStatus, Policy, Task, Underwriting } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";

function mapLeadRow(row: any): Lead {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    email: row.email || undefined,
    dob: row.dob || undefined,
    age: row.age || undefined,
    gender: row.gender || undefined,
    state: row.state,
    city: row.city || undefined,
    zip: row.zip || undefined,
    status: row.status,
    source: row.source,
    temperature: row.temperature,
    assignedAgentId: row.assigned_agent_id || row.user_id,
    notesPreview: row.notes_preview || undefined,
    createdAt: row.created_at,
    lastContactedAt: row.last_contacted_at || undefined,
    nextFollowupAt: row.next_followup_at || undefined,
    underwriting: (row.underwriting as Underwriting | null) || undefined,
    carrierRecommendationId: row.carrier_recommendation_id || undefined,
    application: (row.application as Application | null) || undefined,
    policy: (row.policy as Policy | null) || undefined,
  };
}

function mapTaskRow(row: any): Task {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: row.type,
    title: row.title,
    dueAt: row.due_at,
    priority: row.priority,
    reason: row.reason || undefined,
    completed: row.completed,
    completedAt: row.completed_at || undefined,
  };
}

function mapActivityRow(row: any): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    kind: row.kind,
    actorUserId: row.actor_user_id,
    timestamp: row.timestamp,
    body: row.body,
  };
}

export function useLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  const refresh = useCallback(async () => {
    if (!supabase || !user) {
      setLeads([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error) setLeads((data || []).map(mapLeadRow));
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const addLead = useCallback(async (payload: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    state: string;
    source?: string;
    notesPreview?: string;
  }) => {
    if (!supabase || !user) return { error: "Not signed in." };
    const insert = {
      user_id: user.id,
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
      email: payload.email || null,
      state: payload.state,
      source: payload.source || "other",
      notes_preview: payload.notesPreview || null,
      status: "new_lead",
      temperature: "warm",
      assigned_agent_id: user.id,
    };
    const { data, error } = await supabase.from("leads").insert(insert).select("*").single();
    if (error) return { error: error.message };
    const mapped = mapLeadRow(data);
    setLeads((prev: Lead[]) => [mapped, ...prev]);
    await supabase.from("activity").insert({
      user_id: user.id,
      lead_id: data.id,
      kind: "note",
      actor_user_id: user.id,
      body: "Lead created",
    });
    return { data: mapped };
  }, [supabase, user]);

  const updateLead = useCallback(async (leadId: string, patch: Partial<Lead>) => {
    if (!supabase || !user) return { error: "Not signed in." };
    const dbPatch: any = {};
    if (patch.firstName !== undefined) dbPatch.first_name = patch.firstName;
    if (patch.lastName !== undefined) dbPatch.last_name = patch.lastName;
    if (patch.phone !== undefined) dbPatch.phone = patch.phone;
    if (patch.email !== undefined) dbPatch.email = patch.email;
    if (patch.state !== undefined) dbPatch.state = patch.state;
    if (patch.city !== undefined) dbPatch.city = patch.city;
    if (patch.zip !== undefined) dbPatch.zip = patch.zip;
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (patch.temperature !== undefined) dbPatch.temperature = patch.temperature;
    if (patch.notesPreview !== undefined) dbPatch.notes_preview = patch.notesPreview;
    if (patch.lastContactedAt !== undefined) dbPatch.last_contacted_at = patch.lastContactedAt;
    if (patch.nextFollowupAt !== undefined) dbPatch.next_followup_at = patch.nextFollowupAt;
    if (patch.underwriting !== undefined) dbPatch.underwriting = patch.underwriting;
    if (patch.carrierRecommendationId !== undefined) dbPatch.carrier_recommendation_id = patch.carrierRecommendationId;
    if (patch.application !== undefined) dbPatch.application = patch.application;
    if (patch.policy !== undefined) dbPatch.policy = patch.policy;

    const { data, error } = await supabase.from("leads").update(dbPatch).eq("id", leadId).eq("user_id", user.id).select("*").single();
    if (error) return { error: error.message };
    const mapped = mapLeadRow(data);
    setLeads((prev: Lead[]) => prev.map((lead: Lead) => (lead.id === leadId ? mapped : lead)));
    return { data: mapped };
  }, [supabase, user]);

  return { leads, loading, refresh, addLead, updateLead };
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  const refresh = useCallback(async () => {
    if (!supabase || !user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("due_at", { ascending: true });
    if (!error) setTasks((data || []).map(mapTaskRow));
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const addTask = useCallback(async (payload: {
    leadId: string;
    title: string;
    dueAt: string;
    priority?: string;
    type?: string;
    reason?: string;
  }) => {
    if (!supabase || !user) return { error: "Not signed in." };
    const { data, error } = await supabase.from("tasks").insert({
      user_id: user.id,
      lead_id: payload.leadId,
      title: payload.title,
      due_at: payload.dueAt,
      priority: payload.priority || "normal",
      type: payload.type || "callback",
      reason: payload.reason || null,
      completed: false,
    }).select("*").single();
    if (error) return { error: error.message };
    const mapped = mapTaskRow(data);
    setTasks((prev: Task[]) => [...prev, mapped].sort((a: Task, b: Task) => a.dueAt.localeCompare(b.dueAt)));
    return { data: mapped };
  }, [supabase, user]);

  const toggleTask = useCallback(async (taskId: string, completed: boolean) => {
    if (!supabase || !user) return { error: "Not signed in." };
    const { data, error } = await supabase.from("tasks").update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    }).eq("id", taskId).eq("user_id", user.id).select("*").single();
    if (error) return { error: error.message };
    const mapped = mapTaskRow(data);
    setTasks((prev: Task[]) => prev.map((task: Task) => (task.id === taskId ? mapped : task)));
    return { data: mapped };
  }, [supabase, user]);

  return { tasks, loading, refresh, addTask, toggleTask };
}

export function useActivity(leadId?: string) {
  const { user } = useAuth();
  const [activity, setActivity] = useState<Activity[]>([]);
  const supabase = getSupabaseBrowserClient();

  const refresh = useCallback(async () => {
    if (!supabase || !user || !leadId) {
      setActivity([]);
      return;
    }
    const { data, error } = await supabase
      .from("activity")
      .select("*")
      .eq("user_id", user.id)
      .eq("lead_id", leadId)
      .order("timestamp", { ascending: false });
    if (!error) setActivity((data || []).map(mapActivityRow));
  }, [supabase, user, leadId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const addActivity = useCallback(async (body: string, kind: Activity["kind"] = "note") => {
    if (!supabase || !user || !leadId) return { error: "Not signed in." };
    const { data, error } = await supabase.from("activity").insert({
      user_id: user.id,
      lead_id: leadId,
      kind,
      actor_user_id: user.id,
      body,
    }).select("*").single();
    if (error) return { error: error.message };
    const mapped = mapActivityRow(data);
    setActivity((prev: Activity[]) => [mapped, ...prev]);
    return { data: mapped };
  }, [supabase, user, leadId]);

  return { activity, refresh, addActivity };
}

export function useCarriers(): Carrier[] {
  return useMemo(() => seedCarriers, []);
}
