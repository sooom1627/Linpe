import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { type Session } from "@supabase/supabase-js";

export const useAuthRedirect = (session: Session | null) => {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";

    if (session && inAuthGroup) {
      router.replace("/(protected)");
    } else if (!session && inProtectedGroup) {
      router.replace("/(auth)/loginScreen");
    }
  }, [session, segments, router]);
};
