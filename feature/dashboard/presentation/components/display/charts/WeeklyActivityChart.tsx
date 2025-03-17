import React, { useEffect } from "react";
import { Animated, useColorScheme, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { useThemeColors } from "../../../hooks/useThemeColors";

// 週間アクティビティチャートのプロパティ
interface WeeklyActivityChartProps {
  title: string;
  data: {
    day: string;
    add: number;
    swipe: number;
    read: number;
  }[];
}

export const WeeklyActivityChart = ({ data }: WeeklyActivityChartProps) => {
  // テーマカラーの取得
  const { colors, gridLineColor } = useThemeColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // チャートの設定
  const chartHeight = 180; // Reduced maximum chart height
  const barWidth = 28;
  const maxBarHeight = chartHeight * 0.85; // Further limit maximum bar height (85% of chart height)
  const gridLines = 4; // 背景のdashed線の数

  // データの最大値を計算（スケーリング用）
  const maxValue = Math.max(
    ...data.map((item) => item.add + item.swipe + item.read),
    0.1, // 最小値を設定してゼロ除算を防ぐ
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
            borderColor: gridLineColor,
          }}
        />,
      );
    }

    return lines;
  };

  return (
    <View className="w-full rounded-xl dark:bg-gray-900">
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
          const addRatio = totalValue > 0 ? item.add / totalValue : 0;
          const swipeRatio = totalValue > 0 ? item.swipe / totalValue : 0;
          const readRatio = totalValue > 0 ? item.read / totalValue : 0;

          // 各セクションの高さを計算
          const addHeight = totalHeight * addRatio;
          const swipeHeight = totalHeight * swipeRatio;
          const readHeight = totalHeight * readRatio;

          // 安全な高さの計算をシンプルにする
          const safeAddHeight =
            addHeight > 0 ? addHeight : totalHeight > 0 && item.add > 0 ? 1 : 0;
          const safeSwipeHeight =
            swipeHeight > 0
              ? swipeHeight
              : totalHeight > 0 && item.swipe > 0
                ? 1
                : 0;
          const safeReadHeight =
            readHeight > 0
              ? readHeight
              : totalHeight > 0 && item.read > 0
                ? 1
                : 0;

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
                  className="absolute w-full overflow-hidden rounded-t-sm"
                  style={{
                    bottom: safeAddHeight + safeSwipeHeight,
                    height: safeReadHeight,
                    backgroundColor: isDark
                      ? colors.read.dark.light
                      : colors.read.light,
                  }}
                />

                {/* スワイプセクション（中） */}
                <View
                  className="absolute w-full overflow-hidden"
                  style={{
                    bottom: safeAddHeight,
                    height: safeSwipeHeight,
                    backgroundColor: isDark
                      ? colors.swipe.dark.light
                      : colors.swipe.light,
                  }}
                />

                {/* 追加セクション（下） */}
                <View
                  className="absolute bottom-0 w-full overflow-hidden rounded-b-sm"
                  style={{
                    height: safeAddHeight,
                    backgroundColor: isDark
                      ? colors.add.dark.light
                      : colors.add.light,
                  }}
                />
              </Animated.View>

              {/* X軸ラベル */}
              <ThemedText
                text={item.day}
                variant="small"
                color="muted"
                className="mt-2"
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};
