import { useCallback } from "react";
import useSWR from "swr";

import { useSession } from "@/feature/auth/application/hooks/useSession";
import { type ActivityViewModel } from "../../domain/models/activity";
import { WeeklyActivityRepository } from "../../infrastructure/api/weeklyActivityApi";
import { WeeklyActivityService } from "../services/weeklyActivityService";

// サービスとリポジトリのインスタンスを作成
const weeklyActivityRepository = new WeeklyActivityRepository();
const weeklyActivityService = new WeeklyActivityService(
  weeklyActivityRepository,
);

export function useWeeklyActivity() {
  const { session } = useSession();
  const userId = session?.user?.id;

  const fetcher = useCallback(async () => {
    if (!userId) return null;
    const data = await weeklyActivityService.getWeeklyActivity(userId);
    return weeklyActivityService.toViewModel(data);
  }, [userId]);

  const { data, error, isLoading } = useSWR<ActivityViewModel[] | null>(
    userId ? ["weeklyActivity", userId] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    data: data || [],
    error,
    isLoading,
  };
}
