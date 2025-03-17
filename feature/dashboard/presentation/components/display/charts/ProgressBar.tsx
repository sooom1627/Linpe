import React, { useEffect } from "react";
import { Animated, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

// 進捗データの型定義
export interface ProgressItem {
  id: string;
  title: string;
  value: number;
  color: string;
}

// 進捗バーのプロパティ
interface ProgressBarProps {
  title?: string;
  items: ProgressItem[];
  total: number;
  showLegend?: boolean;
}

export const ProgressBar = ({
  title,
  items,
  total,
  showLegend = true,
}: ProgressBarProps) => {
  // 合計値の計算
  const currentTotal = items.reduce((sum, item) => sum + item.value, 0);

  // 全体の進捗率（0〜100の範囲）
  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.round((currentTotal / total) * 100)),
  );

  // アニメーション用のAnimated値
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  // アニメーションの実行
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true, // ネイティブドライバーを使用
    }).start();
  }, [opacityAnim]);

  return (
    <View className="flex w-full flex-col items-start justify-between gap-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
      {/* タイトルと現在値の表示 */}
      <View className="w-full flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {title && (
            <ThemedText
              text={title}
              variant="body"
              weight="semibold"
              color="default"
            />
          )}
          <ThemedText
            text={`${currentTotal}`}
            variant="body"
            weight="semibold"
            color="default"
          />
          <ThemedText
            text={`/ ${total}`}
            variant="caption"
            weight="medium"
            color="muted"
          />
        </View>
        <ThemedText
          text={`${progressPercentage}%`}
          variant="caption"
          weight="medium"
          color="muted"
        />
      </View>

      {/* プログレスバー */}
      <View className="w-full flex-col gap-2">
        {/* バーのベース（背景） */}
        <View className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          {/* プログレスバー */}
          <View className="h-full w-full">
            {/* 進捗バー（固定幅） */}
            <View
              className="absolute h-full rounded-full"
              style={{
                width: `${progressPercentage}%`,
              }}
            >
              {/* 各セグメントを横に並べるコンテナ */}
              <Animated.View
                className="h-full w-full flex-row"
                style={{ opacity: opacityAnim }}
              >
                {items.map((item, index) => {
                  // 各アイテムの全体に対する比率（%）
                  const itemPercentage =
                    currentTotal > 0 ? (item.value / currentTotal) * 100 : 0;

                  // 最初のアイテムには左の角丸を適用
                  const isFirstItem = index === 0;
                  // 最後のアイテムには右の角丸を適用
                  const isLastItem = index === items.length - 1;

                  return (
                    <View
                      key={item.id}
                      className={`h-full ${isFirstItem ? "rounded-l-full" : ""} ${isLastItem ? "rounded-r-full" : ""}`}
                      style={{
                        width: `${itemPercentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  );
                })}
              </Animated.View>
            </View>
          </View>
        </View>
      </View>

      {/* 凡例 */}
      {showLegend && (
        <View className="mt-2 flex-row flex-wrap justify-start gap-4">
          {items.map((item) => (
            <View key={item.id} className="flex-row items-center">
              <View
                className="mr-2 h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <ThemedText
                text={`${item.title} (${item.value})`}
                variant="small"
                color="muted"
                className="text-xs"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
