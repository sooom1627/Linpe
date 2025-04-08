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
  loadingText = "Loading...",
  errorText = "Failed to fetch data",
}) => {
  if (isLoading) {
    return (
      <View className="flex w-full items-center justify-center rounded-xl bg-zinc-50 py-4 dark:bg-zinc-800">
        <ThemedText
          text={loadingText}
          variant="body"
          weight="medium"
          color="muted"
          className="text-center"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex w-full items-center justify-center rounded-xl bg-zinc-50 py-4 dark:bg-zinc-800">
        <ThemedText
          text={errorText}
          variant="body"
          weight="medium"
          color="error"
          className="text-center"
        />
      </View>
    );
  }

  return <>{children}</>;
};
