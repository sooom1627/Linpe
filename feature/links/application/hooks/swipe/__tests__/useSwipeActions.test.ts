import { renderHook } from "@testing-library/react-native";

import { type Card } from "@/feature/links/domain/models/types";
import { useLinkAction } from "../../link/useLinkAction";
import { useSwipeActions } from "../useSwipeActions";

// モックの設定
jest.mock("../../link/useLinkAction", () => ({
  useLinkAction: jest.fn(),
}));

describe("useSwipeActions", () => {
  const mockUpdateLinkActionBySwipe = jest.fn();
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
      updateLinkActionBySwipe: mockUpdateLinkActionBySwipe,
    });
    mockUpdateLinkActionBySwipe.mockResolvedValue({ success: true });
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

  it("スワイプが中断された場合、方向をnullにリセットする", () => {
    const { result } = renderHook(() =>
      useSwipeActions({
        userId: mockUserId,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    result.current.handleSwipeAborted();
    expect(mockOnDirectionChange).toHaveBeenCalledWith(null);
  });

  it("スワイプが完了した場合、方向に基づいてリンクアクションを更新する（Today, inWeekend, Skip）", async () => {
    const { result } = renderHook(() =>
      useSwipeActions({
        userId: mockUserId,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    // 右スワイプ（inWeekend）
    await result.current.handleSwipeComplete("right", mockCard);
    expect(mockUpdateLinkActionBySwipe).toHaveBeenCalledWith(
      mockUserId,
      mockCard.link_id,
      "inWeekend",
      mockCard.swipe_count,
    );
    expect(mockOnDirectionChange).toHaveBeenCalledWith(null);

    // 左スワイプ（Skip）
    await result.current.handleSwipeComplete("left", mockCard);
    expect(mockUpdateLinkActionBySwipe).toHaveBeenCalledWith(
      mockUserId,
      mockCard.link_id,
      "Skip",
      mockCard.swipe_count,
    );

    // 上スワイプ（Today）
    await result.current.handleSwipeComplete("top", mockCard);
    expect(mockUpdateLinkActionBySwipe).toHaveBeenCalledWith(
      mockUserId,
      mockCard.link_id,
      "Today",
      mockCard.swipe_count,
    );
  });

  it("ユーザーIDがnullの場合、何も実行しない", async () => {
    const { result } = renderHook(() =>
      useSwipeActions({
        userId: null,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    await result.current.handleSwipeComplete("right", mockCard);
    expect(mockUpdateLinkActionBySwipe).not.toHaveBeenCalled();
  });

  it("カードがnullの場合、何も実行しない", async () => {
    const { result } = renderHook(() =>
      useSwipeActions({
        userId: mockUserId,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    await result.current.handleSwipeComplete("right", null as unknown as Card);
    expect(mockUpdateLinkActionBySwipe).not.toHaveBeenCalled();
  });

  it("エラーが発生した場合、コンソールにエラーを出力する", async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    mockUpdateLinkActionBySwipe.mockRejectedValue(new Error("テストエラー"));

    const { result } = renderHook(() =>
      useSwipeActions({
        userId: mockUserId,
        onDirectionChange: mockOnDirectionChange,
      }),
    );

    await result.current.handleSwipeComplete("right", mockCard);
    expect(console.error).toHaveBeenCalled();
    expect(mockOnDirectionChange).toHaveBeenCalledWith(null);

    console.error = originalConsoleError;
  });
});
