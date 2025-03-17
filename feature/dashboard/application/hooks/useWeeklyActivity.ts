import { useCallback } from "react";
import useSWR from "swr";

import { useSession } from "@/feature/auth/application/hooks/useSession";
import { SWR_DISPLAY_CONFIG } from "../cache/swrConfig";
import { weeklyActivityService } from "../services/weeklyActivityService";

export function useWeeklyActivity() {
  const { session } = useSession();
  const userId = session?.user?.id;

  const fetcher = useCallback(async () => {
    if (!userId) {
      console.debug("[useWeeklyActivity] No userId available");
      return null;
    }

    console.debug("[useWeeklyActivity] Fetching data for userId:", userId);
    try {
      // 更新されたサービスを使用
      const data = await weeklyActivityService.getWeeklyActivity(userId);
      console.debug("[useWeeklyActivity] Successfully fetched data:", data);
      return weeklyActivityService.toViewModel(data);
    } catch (error) {
      console.error("[useWeeklyActivity] Error fetching data:", error);
      throw error;
    }
  }, [userId]);

  const { data, error, isLoading } = useSWR(
    userId ? ["weeklyActivity", userId] : null,
    fetcher,
    SWR_DISPLAY_CONFIG,
  );

  if (error) {
    console.error("[useWeeklyActivity] SWR error:", error);
  }

  return {
    data: data || [],
    error,
    isLoading,
  };
}
