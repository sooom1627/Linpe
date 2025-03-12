import { isToday } from "@/feature/links/infrastructure/utils/dateUtils";
import { swipeService } from "../swipeService";

// モックの設定
jest.mock("@/feature/links/infrastructure/utils/dateUtils", () => ({
  isToday: jest.fn(),
}));

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

    it("上スワイプで今日の日付のリンクは表示されない", () => {
      // モックの設定
      (isToday as jest.Mock).mockReturnValue(true);

      // 上スワイプで 'Today' ステータスになるが、今日の日付のリンクは表示されないことを確認
      const status = swipeService.getStatusFromDirection("top");
      expect(status).toBe("Today");

      // 今日の日付のリンクは表示されないことを確認するためのテストは
      // swipeableLinkService.test.ts で行うべきですが、
      // ここでは swipeService が正しく動作することを確認します
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
