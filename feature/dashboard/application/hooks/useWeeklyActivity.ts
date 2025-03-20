import { useCallback } from "react";
import useSWR from "swr";

import { useSession } from "@/feature/auth/application/hooks/useSession";
import { SWR_DISPLAY_CONFIG, WEEKLY_ACTIVITY_CACHE_KEYS } from "../cache";
import { weeklyActivityService } from "../services/weeklyActivityService";

export function useWeeklyActivity() {
  const { session } = useSession();
  const userId = session?.user?.id;

  const fetcher = useCallback(async () => {
    if (!userId) {
      return null;
    }

    try {
      // 更新されたサービスを使用
      const data = await weeklyActivityService.getWeeklyActivity(userId);
      return weeklyActivityService.toViewModel(data);
    } catch (error) {
      console.error("[useWeeklyActivity] Error fetching data:", error);
      throw error;
    }
  }, [userId]);

  const { data, error, isLoading, mutate } = useSWR(
    userId ? WEEKLY_ACTIVITY_CACHE_KEYS.WEEKLY_ACTIVITY(userId) : null,
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
    mutate,
  };
}
