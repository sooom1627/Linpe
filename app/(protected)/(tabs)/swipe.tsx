import { useCallback, useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSWRConfig } from "swr";

import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import SwipeScreen from "@/feature/links/presentation/screens/SwipeScreen";

export default function Swipe() {
  const { mutate } = useSWRConfig();
  const { session } = useSessionContext();
  const [shouldReset, setShouldReset] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // タブがフォーカスされたときにSWRキャッシュを無効化して再取得
      if (session?.user?.id) {
        mutate(["swipeable-links", session.user.id]);
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
    <View className="flex-1 bg-white">
      <SwipeScreen
        resetOnFocus={shouldReset}
        onResetComplete={() => setShouldReset(false)}
      />
    </View>
  );
}
