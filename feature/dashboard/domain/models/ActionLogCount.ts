/**
 * アクションログカウントのドメインモデル
 */
export interface ActionLogCount {
  add: number;
  swipe: number;
  read: number;
}

/**
 * アクションステータスの種類
 */
export const ActionStatus = {
  // Addに関連するステータス
  ADD: "add",

  // Swipeに関連するステータス
  TODAY: "Today",
  IN_WEEKEND: "inWeekend",
  SKIP: "Skip",

  // Readに関連するステータス
  READ: "Read",
  BOOKMARK: "Bookmark",
} as const;

/**
 * アクションタイプの種類
 */
export enum ActionType {
  ADD = "add",
  SWIPE = "swipe",
  READ = "read",
}

/**
 * アクションステータスをタイプにマッピング
 */
export const statusToTypeMap: Record<string, ActionType> = {
  [ActionStatus.ADD]: ActionType.ADD,

  [ActionStatus.TODAY]: ActionType.SWIPE,
  [ActionStatus.IN_WEEKEND]: ActionType.SWIPE,
  [ActionStatus.SKIP]: ActionType.SWIPE,

  [ActionStatus.READ]: ActionType.READ,
  [ActionStatus.BOOKMARK]: ActionType.READ,
};
