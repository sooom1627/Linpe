import React, { useEffect } from "react";
import { Animated, View } from "react-native";
import { TrendingUpIcon } from "lucide-react-native";

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

export const ScreenTimeChart = ({ data }: ScreenTimeChartProps) => {
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
    grid: {
      line: "rgba(161, 161, 170, 0.2)", // 薄いグレー（ダークモードでも見やすい）
    },
  };

  // チャートの設定
  const chartHeight = 180; // Reduced maximum chart height
  const barWidth = 28;
  const maxBarHeight = chartHeight * 0.85; // Further limit maximum bar height (85% of chart height)
  const gridLines = 4; // 背景のdashed線の数

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

  // 背景のdashed線を生成する関数
  const renderGridLines = () => {
    const lines = [];
    const lineSpacing = chartHeight / gridLines;

    for (let i = 1; i <= gridLines; i++) {
      const linePosition = chartHeight - i * lineSpacing;
      lines.push(
        <View
          key={`grid-line-${i}`}
          className="absolute w-full border border-dashed"
          style={{
            top: linePosition,
            borderColor: colors.grid.line,
          }}
        />,
      );
    }

    return lines;
  };

  return (
    <View className="w-full rounded-xl dark:bg-gray-900">
      {/* Title section */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <TrendingUpIcon size={16} color="#FA4714" strokeWidth={1.5} />
          <ThemedText
            text={"Weekly Activity"}
            variant="body"
            weight="semibold"
            color="default"
          />
        </View>
        <ThemedText
          text={"2025/03/16~2025/03/22"}
          variant="caption"
          weight="normal"
          color="muted"
        />
      </View>
      {/* Chart section - custom implementation */}
      <View
        style={{ height: chartHeight }}
        className="relative flex-row items-end justify-between"
      >
        {/* 背景のdashed線 */}
        {renderGridLines()}

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
              className="mx-3 items-center"
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
      <View className="mt-2 flex-row justify-end gap-4 px-2">
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

      {/* カテゴリ別合計時間 - 表形式 */}
      <View className="mt-2 border-t border-zinc-300 px-2 pt-4 dark:border-zinc-700">
        {/* ヘッダー行 */}
        <View className="mb-4 flex-row">
          <View className="flex-1">
            <ThemedText
              text="Actions"
              variant="small"
              weight="semibold"
              color="muted"
              className="text-xs"
            />
          </View>
          <View className="w-20">
            <ThemedText
              text="Average"
              variant="small"
              weight="semibold"
              color="muted"
              className="text-right text-xs"
            />
          </View>
          <View className="w-20">
            <ThemedText
              text="Total"
              variant="small"
              weight="semibold"
              color="muted"
              className="text-right text-xs"
            />
          </View>
        </View>

        {/* add行 */}
        <View className="mb-4 flex-row items-center">
          <View className="flex-1 flex-row items-center">
            <View
              className="mr-2 h-3 w-3 rounded-sm"
              style={{ backgroundColor: colors.add.main }}
            />
            <ThemedText
              text="add"
              variant="body"
              weight="medium"
              color="default"
            />
          </View>
          <View className="w-20">
            <ThemedText
              text={`15`}
              variant="body"
              weight="medium"
              color="muted"
              className="text-right"
            />
          </View>
          <View className="w-20">
            <ThemedText
              text={`30`}
              variant="body"
              weight="medium"
              color="muted"
              className="text-right"
            />
          </View>
        </View>

        {/* swipe行 */}
        <View className="mb-4 flex-row items-center">
          <View className="flex-1 flex-row items-center">
            <View
              className="mr-2 h-3 w-3 rounded-sm"
              style={{ backgroundColor: colors.swipe.main }}
            />
            <ThemedText
              text="swipe"
              variant="body"
              weight="medium"
              color="default"
            />
          </View>
          <View className="w-20">
            <ThemedText
              text={`12`}
              variant="body"
              weight="medium"
              color="muted"
              className="text-right"
            />
          </View>
          <View className="w-20">
            <ThemedText
              text={`30`}
              variant="body"
              weight="medium"
              color="muted"
              className="text-right"
            />
          </View>
        </View>

        {/* read行 */}
        <View className="flex-row items-center">
          <View className="flex-1 flex-row items-center">
            <View
              className="mr-2 h-3 w-3 rounded-sm"
              style={{ backgroundColor: colors.read.main }}
            />
            <ThemedText
              text="read"
              variant="body"
              weight="medium"
              color="default"
            />
          </View>
          <View className="w-20">
            <ThemedText
              text={`18`}
              variant="body"
              weight="medium"
              color="muted"
              className="text-right"
            />
          </View>
          <View className="w-20">
            <ThemedText
              text={`30`}
              variant="body"
              weight="medium"
              color="muted"
              className="text-right"
            />
          </View>
        </View>
      </View>
    </View>
  );
};
