import { useColorScheme } from "react-native";

import { colors } from "./colors";

// アクティビティの種類を表す型
export type ActivityTypeValue = "add" | "swipe" | "read" | "other"; // 将来の拡張を考慮

// 凡例に表示するアクティビティの種類を定義
export interface ActivityType {
  type: ActivityTypeValue;
  label?: string;
  color?: string;
}

/**
 * デフォルトのアクティビティを取得する関数
 * カラーモードに応じて適切な色を返す
 */
export const useDefaultActivities = (): ActivityType[] => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return [
    {
      type: "add",
      label: "add",
      color: isDark ? colors.add.dark.main : colors.add.main,
    },
    {
      type: "swipe",
      label: "swipe",
      color: isDark ? colors.swipe.dark.main : colors.swipe.main,
    },
    {
      type: "read",
      label: "read",
      color: isDark ? colors.read.dark.main : colors.read.main,
    },
  ];
};

// 後方互換性のために静的なアクティビティ配列も保持
export const defaultActivities: ActivityType[] = [
  { type: "add", label: "add", color: colors.add.main },
  { type: "swipe", label: "swipe", color: colors.swipe.main },
  { type: "read", label: "read", color: colors.read.main },
];
