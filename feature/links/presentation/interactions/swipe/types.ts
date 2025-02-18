export type SwipeDirection = "left" | "right" | "top" | null;

export interface SwipeState {
  direction: SwipeDirection;
  activeIndex: number;
  isFinished: boolean;
}
