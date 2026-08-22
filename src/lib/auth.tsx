import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  role: "patient" | "doctor" | "admin";
  phone: string | null;
  department: string | null;
  hospital_id: string | null;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile | null> => {
      const { data: auth } = await supabase.auth.getUser();
      const email = auth.user?.email;
      if (!email) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      if (error) throw error;
      return (data as Profile | null) ?? null;
    },
  });
}

export function useSignOut() {
  const navigate = useNavigate();
  return useCallback(async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }, [navigate]);
}

export function homeForRole(role: string | undefined) {
  if (role === "doctor") return "/doctor" as const;
  if (role === "admin") return "/admin" as const;
  return "/patient" as const;
}
