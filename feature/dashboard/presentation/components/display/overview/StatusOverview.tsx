import { View } from "react-native";

import { ProgressBar, type ProgressItem } from "../charts/ProgressBar";
import { DataFetchState } from "../DataFetchState";

interface StatusOverviewProps {
  title: string;
  items: ProgressItem[];
  total: number;
  isLoading: boolean;
  error: Error | null;
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
}: StatusOverviewProps) => {
  return (
    <View className="w-full">
      <DataFetchState isLoading={isLoading} error={error}>
        <View className="flex-col items-start justify-between gap-3">
          <ProgressBar
            title={title}
            items={items}
            total={total}
            showLegend={true}
          />
        </View>
      </DataFetchState>
    </View>
  );
};
