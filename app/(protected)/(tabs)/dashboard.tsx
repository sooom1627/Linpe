import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSWRConfig } from "swr";

import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import { ACTION_LOG_CACHE_KEYS } from "@/feature/dashboard/application/cache/actionLogCacheKeys";
import { WEEKLY_ACTIVITY_CACHE_KEYS } from "@/feature/dashboard/application/cache/weeklyActivityCacheKeys";
import { DashboardScreen } from "@/feature/dashboard/presentation/screen/DashboardScreen";

export default function Dashboard() {
  const { mutate } = useSWRConfig();
  const { session } = useSessionContext();
  const [shouldReset, setShouldReset] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // タブがフォーカスされたときにダッシュボード関連のキャッシュを再検証
      if (session?.user?.id) {
        // 週間アクティビティデータを再検証（正しいキャッシュキーを使用）
        mutate(WEEKLY_ACTIVITY_CACHE_KEYS.WEEKLY_ACTIVITY(session.user.id));

        // リンクステータスとスワイプステータスのカウントを再検証
        mutate(ACTION_LOG_CACHE_KEYS.LINK_STATUS_COUNTS(session.user.id));
        mutate(ACTION_LOG_CACHE_KEYS.SWIPE_STATUS_COUNTS(session.user.id));

        // 状態リセットフラグを設定
        setShouldReset(true);
      }

      return () => {
        // クリーンアップ処理
        setShouldReset(false);
      };
    }, [mutate, session?.user?.id]),
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <DashboardScreen
        resetOnFocus={shouldReset}
        onResetComplete={() => setShouldReset(false)}
      />
    </ScrollView>
  );
}
