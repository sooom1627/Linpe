import {
  ArrowUpFromLine,
  BookCheck,
  BookHeart,
  BookMarked,
  IterationCw,
  ListEnd,
  ListPlus,
  type LucideIcon,
} from "lucide-react-native";

import { type LinkActionStatus } from "@/feature/links/domain/models/types";

// Mark Actions
// LinkActionStatusと一致する値のみを使用
export type MarkType = Extract<
  LinkActionStatus,
  "Skip" | "Read" | "Re-Read" | "Bookmark"
>;

export interface MarkAction {
  type: MarkType;
  icon: LucideIcon;
  label: string;
}

export interface MarkActionsProps {
  selectedMark: MarkType | null;
  onSelect: (type: MarkType) => void;
}

export const MARK_ACTIONS: MarkAction[] = [
  { type: "Skip", icon: ListEnd, label: "in Box" },
  { type: "Read", icon: BookCheck, label: "Read" },
  { type: "Re-Read", icon: BookHeart, label: "Re-Read" },
  { type: "Bookmark", icon: BookMarked, label: "Bookmark" },
] as const;

// Link Input Actions
export interface LinkInputActionsProps {
  onCancel: () => void;
  onAdd: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  isSubmitting: boolean;
  hasUrl: boolean;
}

// Swipe Actions
export type SwipeType = "skip" | "today" | "weekend";

export interface SwipeAction {
  type: SwipeType;
  icon: LucideIcon;
  label: string;
  accessibilityLabel: string;
  accessibilityHint: string;
}

export interface SwipeActionsProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeTop?: () => void;
}

export const SWIPE_ACTIONS: SwipeAction[] = [
  {
    type: "skip",
    icon: IterationCw,
    label: "Skip",
    accessibilityLabel: "Skip",
    accessibilityHint: "Skip this card",
  },
  {
    type: "today",
    icon: ArrowUpFromLine,
    label: "Today",
    accessibilityLabel: "Star",
    accessibilityHint: "Star this card",
  },
  {
    type: "weekend",
    icon: ListPlus,
    label: "In weekend",
    accessibilityLabel: "Like",
    accessibilityHint: "Like this card",
  },
] as const;
