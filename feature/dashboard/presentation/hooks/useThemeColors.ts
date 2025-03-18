import { useColorScheme } from "react-native";

import {
  darkProgressItems,
  defaultProgressItems,
  type ProgressItem,
} from "../components/display/charts/ProgressBar";
import { colors } from "../components/display/constants/colors";
import { useDefaultActivities } from "../components/display/constants/defaultActivities";

// アクティビティの色を持つタイプ
type ActivityColorType = "add" | "swipe" | "read";

/**
 * ダッシュボードのテーマカラーを提供するフック
 */
export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // アクティビティタイプの色を取得
  const getActivityColor = (
    type: ActivityColorType,
    variant: "main" | "light" = "main",
  ) => {
    const colorSet = isDark ? colors[type].dark : colors[type];
    return colorSet[variant];
  };

  // グリッド線の色
  const gridLineColor = isDark ? colors.grid.dark.line : colors.grid.line;

  // 現在のテーマのアクティビティ
  const activities = useDefaultActivities();

  // 現在のテーマに適したProgressItemを取得
  const getProgressItems = (values: Record<string, number>): ProgressItem[] => {
    const baseItems = isDark ? darkProgressItems : defaultProgressItems;
    return baseItems.map((item) => ({
      ...item,
      value: values[item.id] || 0,
    }));
  };

  return {
    isDark,
    colors,
    getActivityColor,
    gridLineColor,
    activities,
    getProgressItems,
  };
};
