import { colors } from "./colors";

// アクティビティの種類を表す型
export type ActivityTypeValue = "add" | "swipe" | "read" | "other"; // 将来の拡張を考慮

// 凡例に表示するアクティビティの種類を定義
export interface ActivityType {
  type: ActivityTypeValue;
  label?: string;
  color?: string;
}

// デフォルトのアクティビティ
export const defaultActivities: ActivityType[] = [
  { type: "add", label: "add", color: colors.add.main },
  { type: "swipe", label: "swipe", color: colors.swipe.main },
  { type: "read", label: "read", color: colors.read.main },
];
