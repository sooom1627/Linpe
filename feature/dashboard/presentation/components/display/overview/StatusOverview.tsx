import { View } from "react-native";

import { ProgressBar, type ProgressItem } from "../charts/ProgressBar";
import { DataFetchState } from "../status/DataFetchState";

interface StatusOverviewProps {
  title: string;
  items: ProgressItem[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  showLegend?: boolean;
  showPercentage?: boolean;
  equalSegments?: boolean;
}

/**
 * ステータスの概要を表示するコンポーネント
 */
export const StatusOverview = ({
  title,
  items,
  total,
  isLoading,
  error,
  showLegend = true,
  showPercentage = true,
  equalSegments = false,
}: StatusOverviewProps) => {
  return (
    <View className="w-full">
      <DataFetchState isLoading={isLoading} error={error}>
        <View className="flex-col items-start justify-between gap-3">
          <ProgressBar
            title={title}
            items={items}
            total={total}
            showLegend={showLegend}
            showPercentage={showPercentage}
            equalSegments={equalSegments}
          />
        </View>
      </DataFetchState>
    </View>
  );
};
