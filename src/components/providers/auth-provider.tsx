"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { hasSupabaseEnv } from "@/lib/env";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
};

export type SubscriptionRecord = {
  user_id: string;
  status: string;
  trial_ends_at: string | null;
  current_period_ends_at: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: SupabaseUser | null;
  profile: Profile | null;
  subscription: SubscriptionRecord | null;
  loading: boolean;
  hasAccess: boolean;
  missingConfig: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (fullName: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function subscriptionHasAccess(subscription: SubscriptionRecord | null) {
  if (!subscription) return false;
  if (subscription.status === "active") return true;
  if (subscription.status === "trialing") {
    return Boolean(subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date());
  }
  if (subscription.current_period_ends_at) {
    return new Date(subscription.current_period_ends_at) > new Date();
  }
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const currentUser = supabase ? (await supabase.auth.getUser()).data.user : null;
    if (!supabase || !currentUser) {
      setProfile(null);
      setSubscription(null);
      return;
    }

    const [{ data: profileRow }, { data: subscriptionRow }] = await Promise.all([
      supabase.from("profiles").select("id,email,full_name,role").eq("id", currentUser.id).maybeSingle(),
      supabase
        .from("subscriptions")
        .select("user_id,status,trial_ends_at,current_period_ends_at")
        .eq("user_id", currentUser.id)
        .maybeSingle(),
    ]);

    setProfile((profileRow as Profile | null) ?? null);
    setSubscription((subscriptionRow as SubscriptionRecord | null) ?? null);
  }, []);

  useEffect(() => {
    if (!hasSupabaseEnv) {
      setLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await refreshProfile();
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        await refreshProfile();
      } else {
        setProfile(null);
        setSubscription(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: "Supabase is not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: "Supabase is not configured." };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    const newUser = data.user;
    if (!newUser) return { error: "Unable to create user." };

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    await Promise.all([
      supabase.from("profiles").upsert({
        id: newUser.id,
        email,
        full_name: fullName,
        role: "owner",
      }),
      supabase.from("subscriptions").upsert({
        user_id: newUser.id,
        status: "inactive",
        trial_ends_at: trialEnd.toISOString(),
      }),
    ]);

    return {};
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
    setSubscription(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    profile,
    subscription,
    loading,
    hasAccess: subscriptionHasAccess(subscription),
    missingConfig: !hasSupabaseEnv,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }), [session, user, profile, subscription, loading, signIn, signUp, signOut, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
