import { useCallback } from "react";
import useSWR from "swr";

import { useSession } from "@/feature/auth/application/hooks/useSession";
import { type ActivityViewModel } from "../../domain/models/activity";
import { WeeklyActivityRepository } from "../../infrastructure/api/weeklyActivityApi";
import { WeeklyActivityService } from "../services/weeklyActivityService";

// ファクトリ関数の作成
export function createWeeklyActivityService() {
  const repository = new WeeklyActivityRepository();
  return new WeeklyActivityService(repository);
}

export function useWeeklyActivity(service = createWeeklyActivityService()) {
  const { session } = useSession();
  const userId = session?.user?.id;

  const fetcher = useCallback(async () => {
    if (!userId) return null;
    const data = await service.getWeeklyActivity(userId);
    return service.toViewModel(data);
  }, [userId, service]);

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
