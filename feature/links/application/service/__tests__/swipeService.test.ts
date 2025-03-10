import { swipeService } from "../swipeService";

describe("swipeService", () => {
  describe("calculateSwipeDirection", () => {
    it("右スワイプを検出", () => {
      const direction = swipeService.calculateSwipeDirection(20, 5);
      expect(direction).toBe("right");
    });

    it("左スワイプを検出", () => {
      const direction = swipeService.calculateSwipeDirection(-20, 5);
      expect(direction).toBe("left");
    });

    it("上スワイプを検出", () => {
      const direction = swipeService.calculateSwipeDirection(5, -20);
      expect(direction).toBe("top");
    });

    it("しきい値以下の移動は検出しない", () => {
      const direction = swipeService.calculateSwipeDirection(10, 10);
      expect(direction).toBeNull();
    });
  });

  describe("getStatusFromDirection", () => {
    it("各方向に対して正しいステータスを返す", () => {
      expect(swipeService.getStatusFromDirection("left")).toBe("Skip");
      expect(swipeService.getStatusFromDirection("right")).toBe("inWeekend");
      expect(swipeService.getStatusFromDirection("top")).toBe("Today");
      expect(swipeService.getStatusFromDirection(null)).toBe("add");
    });
  });

  describe("handleCardIndexChange", () => {
    it("正しいインデックスと終了状態を返す", () => {
      const result = swipeService.handleCardIndexChange(2, 4);
      expect(result).toEqual({
        activeIndex: 3,
        isFinished: false,
      });
    });

    it("最後のカードで終了状態を返す", () => {
      const result = swipeService.handleCardIndexChange(3, 4);
      expect(result).toEqual({
        activeIndex: 4,
        isFinished: true,
      });
    });
  });

  describe("getInitialState", () => {
    it("正しい初期状態を返す", () => {
      const initialState = swipeService.getInitialState();
      expect(initialState).toEqual({
        direction: null,
        activeIndex: 0,
        isFinished: false,
      });
    });
  });
});
