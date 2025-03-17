import React from "react";
import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

interface DataFetchStateProps {
  isLoading: boolean;
  error: Error | null | unknown;
  children: React.ReactNode;
  loadingText?: string;
  errorText?: string;
}

/**
 * データフェッチの状態に応じたコンポーネントを表示するラッパー
 */
export const DataFetchState: React.FC<DataFetchStateProps> = ({
  isLoading,
  error,
  children,
  loadingText = "読み込み中...",
  errorText = "データの取得に失敗しました",
}) => {
  if (isLoading) {
    return (
      <View className="w-full py-4">
        <ThemedText
          text={loadingText}
          variant="body"
          weight="medium"
          color="muted"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-full py-4">
        <ThemedText
          text={errorText}
          variant="body"
          weight="medium"
          color="error"
        />
      </View>
    );
  }

  return <>{children}</>;
};
