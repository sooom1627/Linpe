import { act, renderHook } from "@testing-library/react-native";

import { useSwipeState } from "../useSwipeState";

describe("useSwipeState", () => {
  it("初期状態が正しい", () => {
    const { result } = renderHook(() => useSwipeState());
    expect(result.current).toEqual(
      expect.objectContaining({
        direction: null,
        activeIndex: 0,
        isFinished: false,
      }),
    );
  });

  it("方向を設定できる", () => {
    const { result } = renderHook(() => useSwipeState());
    act(() => {
      result.current.setDirection("right");
    });
    expect(result.current.direction).toBe("right");
  });

  it("カードインデックスを更新できる", () => {
    const { result } = renderHook(() => useSwipeState());
    act(() => {
      result.current.handleCardIndexChange(0, 3);
    });
    expect(result.current.activeIndex).toBe(1);
    expect(result.current.isFinished).toBe(false);
  });

  it("最後のカードで終了状態になる", () => {
    const { result } = renderHook(() => useSwipeState());
    act(() => {
      result.current.handleCardIndexChange(2, 3);
    });
    expect(result.current.activeIndex).toBe(3);
    expect(result.current.isFinished).toBe(true);
  });

  it("状態をリセットできる", () => {
    const { result } = renderHook(() => useSwipeState());

    act(() => {
      result.current.setDirection("right");
      result.current.handleCardIndexChange(1, 3);
    });

    act(() => {
      result.current.resetState();
    });

    expect(result.current).toEqual(
      expect.objectContaining({
        direction: null,
        activeIndex: 0,
        isFinished: false,
      }),
    );
  });
});
