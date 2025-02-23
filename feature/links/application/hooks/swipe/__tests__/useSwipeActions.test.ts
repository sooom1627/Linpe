import { renderHook } from "@testing-library/react-native";

import { useLinkAction } from "@/feature/links/application/hooks";
import { type Card } from "@/feature/links/domain/models/types";
import { useSwipeActions } from "../useSwipeActions";

// モックの設定
jest.mock("@/feature/links/application/hooks", () => ({
  useLinkAction: jest.fn(),
}));

describe("useSwipeActions", () => {
  const mockUpdateLinkAction = jest.fn();
  const mockOnDirectionChange = jest.fn();
  const mockUserId = "test-user";
  const mockCard: Card = {
    id: 1,
    link_id: "test-link",
    full_url: "https://test.com",
    swipe_count: 0,
    imageUrl: "test-image",
    title: "test-title",
    description: "test-description",
    domain: "test-domain",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLinkAction as jest.Mock).mockReturnValue({
      updateLinkAction: mockUpdateLinkAction,
    });
    mockUpdateLinkAction.mockResolvedValue({ success: true });
  });

  it("スワイプ中の方向を計算して通知する", () => {
    const { result } = renderHook(() =>
      useSwipeActions({
        userId: mockUserId,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    result.current.handleSwiping(20, 5);
    expect(mockOnDirectionChange).toHaveBeenCalledWith("right");

    result.current.handleSwiping(-20, 5);
    expect(mockOnDirectionChange).toHaveBeenCalledWith("left");

    result.current.handleSwiping(5, -20);
    expect(mockOnDirectionChange).toHaveBeenCalledWith("top");
  });

  it("スワイプ中断時に方向をリセットする", () => {
    const { result } = renderHook(() =>
      useSwipeActions({
        userId: mockUserId,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    result.current.handleSwipeAborted();
    expect(mockOnDirectionChange).toHaveBeenCalledWith(null);
  });

  it("スワイプ完了時にアクションを更新する", async () => {
    const { result } = renderHook(() =>
      useSwipeActions({
        userId: mockUserId,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    await result.current.handleSwipeComplete("right", mockCard);

    expect(mockUpdateLinkAction).toHaveBeenCalledWith(
      mockUserId,
      mockCard.link_id,
      "inWeekend",
      mockCard.swipe_count,
    );
    expect(mockOnDirectionChange).toHaveBeenCalledWith(null);
  });

  it("ユーザーIDがない場合はアクションを更新しない", async () => {
    const { result } = renderHook(() =>
      useSwipeActions({
        userId: null,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    await result.current.handleSwipeComplete("right", mockCard);

    expect(mockUpdateLinkAction).not.toHaveBeenCalled();
  });

  it("エラー時にコンソールにエラーを出力する", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    mockUpdateLinkAction.mockRejectedValue(new Error("Test error"));

    const { result } = renderHook(() =>
      useSwipeActions({
        userId: mockUserId,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    await result.current.handleSwipeComplete("right", mockCard);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error in handleSwipeComplete:",
      expect.any(Error),
    );
    expect(mockOnDirectionChange).toHaveBeenCalledWith(null);

    consoleErrorSpy.mockRestore();
  });
});
