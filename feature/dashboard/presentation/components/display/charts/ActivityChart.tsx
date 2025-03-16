import React, { useEffect } from "react";
import { Animated, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { colors } from "../constants/colors";

// スクリーンタイムチャートのプロパティ
interface ActivityChartProps {
  title: string;
  data: {
    day: string;
    add: number;
    swipe: number;
    read: number;
  }[];
}
export const ActivityChart = ({ data }: ActivityChartProps) => {
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
    </View>
  );
};
