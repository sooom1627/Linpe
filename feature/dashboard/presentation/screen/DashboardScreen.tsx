import { useEffect } from "react";
import { View } from "react-native";

import { useSession } from "@/feature/auth/application/hooks/useSession";
import { Overview } from "../views/Overview";
import { TodaysOverview } from "../views/TodaysOverview";
import { WeeklyActivityChartView } from "../views/WeeklyActivityChartView";

interface DashboardScreenProps {
  resetOnFocus?: boolean;
  onResetComplete?: () => void;
}

export const DashboardScreen = ({
  resetOnFocus = false,
  onResetComplete,
}: DashboardScreenProps) => {
  const { session } = useSession();
  const userId = session?.user?.id || "";

  // タブ切り替え時に状態をリセット
  useEffect(() => {
    if (resetOnFocus) {
      // ここでリセットが必要な処理を行う
      // 現時点では特別なリセット処理は必要ないが、
      // 将来的にダッシュボードの状態が複雑になった場合のために実装

      // リセット完了を通知
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [resetOnFocus, onResetComplete]);

  return (
    <View className="flex items-center justify-center gap-4 px-3 py-5">
      {/* 今日のアクティビティ概要 */}
      <TodaysOverview />

      {/* 週間アクティビティチャート */}
      <WeeklyActivityChartView />

      {/* ステータス概要 */}
      <Overview userId={userId} />
    </View>
  );
};
