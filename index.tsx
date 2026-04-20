"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function RootPage() {
  const router = useRouter();
  const { loading, user, hasAccess, missingConfig } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (missingConfig) {
      router.replace("/login");
      return;
    }
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(hasAccess ? "/dashboard" : "/subscribe");
  }, [loading, user, hasAccess, router, missingConfig]);

  return <div className="min-h-screen bg-ink-50" />;
}
