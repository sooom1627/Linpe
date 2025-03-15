import React, { useEffect } from "react";
import { Animated, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

// スクリーンタイムチャートのプロパティ
interface ScreenTimeChartProps {
  title: string;
  data: {
    day: string;
    add: number;
    swipe: number;
    read: number;
  }[];
}

export const ScreenTimeChart = ({ title, data }: ScreenTimeChartProps) => {
  // カラーパレット（zincベースのモノトーン - 濃淡順に配置）
  const colors = {
    add: {
      main: "#3F3F46", // zinc-700 - 最も暗い
      light: "rgba(63, 63, 70, 0.85)",
    },
    swipe: {
      main: "#71717A", // zinc-500 - 中間
      light: "rgba(113, 113, 122, 0.85)",
    },
    read: {
      main: "#A1A1AA", // zinc-400 - 最も明るい
      light: "rgba(161, 161, 170, 0.85)",
    },
  };

  // チャートの設定
  const chartHeight = 180; // Reduced maximum chart height
  const barWidth = 36;
  const maxBarHeight = chartHeight * 0.85; // Further limit maximum bar height (85% of chart height)

  // データの最大値を計算（スケーリング用）
  const maxValue = Math.max(
    ...data.map((item) => item.add + item.swipe + item.read),
  );

  // アニメーション用のAnimated値（useMemoで作成）
  const barHeights = React.useMemo(
    () => data.map(() => new Animated.Value(0)),
    [data],
  );

  // アニメーションの実行
  useEffect(() => {
    Animated.parallel(
      barHeights.map((height) =>
        Animated.timing(height, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ),
    ).start();

    return () => {
      // クリーンアップ（必要に応じて）
    };
  }, [barHeights]); // barHeightsを依存配列に含める

  return (
    <View className="w-full rounded-xl bg-white dark:bg-gray-900">
      {/* Title section */}
      <View className="mb-2">
        <ThemedText
          text={title}
          variant="body"
          weight="semibold"
          color="default"
        />
      </View>

      {/* Chart section - custom implementation */}
      <View
        style={{ height: chartHeight }}
        className="flex-row items-end justify-between"
      >
        {data.map((item, index) => {
          // 各カテゴリの高さを計算（スケーリング）
          const totalValue = item.add + item.swipe + item.read;

          // 最大高さを制限
          const totalHeight = Math.min(
            (totalValue / maxValue) * chartHeight,
            maxBarHeight,
          );

          // 各セクションの比率を計算
          const addRatio = item.add / totalValue;
          const swipeRatio = item.swipe / totalValue;
          const readRatio = item.read / totalValue;

          // 各セクションの高さを計算
          const addHeight = totalHeight * addRatio;
          const swipeHeight = totalHeight * swipeRatio;
          const readHeight = totalHeight * readRatio;

          // 高さが0の場合は最小値を設定（表示上の問題を防ぐ）
          const safeAddHeight =
            addHeight > 0 ? addHeight : totalHeight > 0 ? 1 : 0;
          const safeSwipeHeight =
            swipeHeight > 0 ? swipeHeight : totalHeight > 0 ? 1 : 0;
          const safeReadHeight =
            readHeight > 0 ? readHeight : totalHeight > 0 ? 1 : 0;

          return (
            <View
              key={index}
              className="items-center"
              style={{ width: barWidth }}
            >
              {/* スタックバー */}
              <Animated.View
                className="overflow-hidden rounded-sm"
                style={{
                  width: barWidth,
                  height: barHeights[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, totalHeight],
                  }),
                }}
              >
                {/* 読書セクション（上） */}
                <View
                  className="absolute w-full rounded-t-sm"
                  style={{
                    bottom: safeAddHeight + safeSwipeHeight,
                    height: safeReadHeight,
                    backgroundColor: colors.read.light,
                  }}
                />

                {/* スワイプセクション（中） */}
                <View
                  className="absolute w-full"
                  style={{
                    bottom: safeAddHeight,
                    height: safeSwipeHeight,
                    backgroundColor: colors.swipe.light,
                  }}
                />

                {/* 追加セクション（下） */}
                <View
                  className="absolute bottom-0 w-full rounded-b-sm"
                  style={{
                    height: safeAddHeight,
                    backgroundColor: colors.add.light,
                  }}
                />
              </Animated.View>

              {/* X軸ラベル */}
              <ThemedText
                text={item.day}
                variant="small"
                color="muted"
                className="mt-2 text-[11px] font-medium text-[#8E8E93]"
              />
            </View>
          );
        })}
      </View>

      {/* 凡例 - iOSスタイル */}
      <View className="mt-4 flex-row justify-end gap-4 px-2">
        <View className="flex-row items-center">
          <View
            className="mr-2 h-3 w-3 rounded-sm"
            style={{ backgroundColor: colors.add.main }}
          />
          <ThemedText
            text={`add`}
            variant="small"
            color="muted"
            className="text-xs"
          />
        </View>

        <View className="flex-row items-center">
          <View
            className="mr-2 h-3 w-3 rounded-sm"
            style={{ backgroundColor: colors.swipe.main }}
          />
          <ThemedText
            text={`swipe`}
            variant="small"
            color="muted"
            className="text-xs"
          />
        </View>

        <View className="flex-row items-center">
          <View
            className="mr-2 h-3 w-3 rounded-sm"
            style={{ backgroundColor: colors.read.main }}
          />
          <ThemedText
            text={`read`}
            variant="small"
            color="muted"
            className="text-xs"
          />
        </View>
      </View>

      {/* カテゴリ別合計時間 */}
      <View className="mt-4 border-t border-gray-100 px-2 pt-6 dark:border-gray-800">
        <View className="mb-4 flex-row justify-between">
          <ThemedText
            text="add"
            variant="body"
            weight="medium"
            color="default"
          />
          <ThemedText
            text={`30`}
            variant="body"
            weight="medium"
            color="muted"
          />
        </View>

        <View className="mb-4 flex-row justify-between">
          <ThemedText
            text="swipe"
            variant="body"
            weight="medium"
            color="default"
          />
          <ThemedText
            text={`30`}
            variant="body"
            weight="medium"
            color="muted"
          />
        </View>

        <View className="flex-row justify-between">
          <ThemedText
            text="read"
            variant="body"
            weight="medium"
            color="default"
          />
          <ThemedText
            text={`30`}
            variant="body"
            weight="medium"
            color="muted"
          />
        </View>
      </View>
    </View>
  );
};
