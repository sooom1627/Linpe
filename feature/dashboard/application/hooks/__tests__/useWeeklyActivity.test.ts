import { renderHook, waitFor } from "@testing-library/react-native";
import useSWR from "swr";

import { useSession } from "@/feature/auth/application/hooks/useSession";
import { weeklyActivityRepository } from "../../../infrastructure/api/weeklyActivityApi";
import { weeklyActivityService } from "../../services/weeklyActivityService";
import { useWeeklyActivity } from "../useWeeklyActivity";

// モック
jest.mock("@/feature/auth/application/hooks/useSession");
jest.mock("../../services/weeklyActivityService");
jest.mock("../../../infrastructure/api/weeklyActivityApi");
jest.mock("swr");

describe("useWeeklyActivity", () => {
  const mockSession = {
    user: { id: "test-user" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({ session: mockSession });
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
    });
  });

  it("正常系: アクティビティデータを取得できる", async () => {
    const mockWeeklyData = {
      activities: [
        {
          date: new Date("2024-01-01"),
          activities: { add: 1, swipe: 2, read: 3 },
        },
      ],
    };

    const mockViewModel = [{ day: "Mon", add: 1, swipe: 2, read: 3 }];

    // サービスのモック
    (
      weeklyActivityService.getWeeklyActivity as jest.Mock
    ).mockResolvedValueOnce(mockWeeklyData);
    (weeklyActivityService.toViewModel as jest.Mock).mockReturnValueOnce(
      mockViewModel,
    );
    (useSWR as jest.Mock).mockReturnValue({
      data: mockViewModel,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useWeeklyActivity());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockViewModel);
      expect(result.current.error).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    expect(useSWR).toHaveBeenCalledWith(
      ["weeklyActivity", "test-user"],
      expect.any(Function),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
    );
  });

  it("異常系: エラーが発生した場合、エラー状態を返す", async () => {
    const mockError = new Error("Failed to fetch activity");
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
    });

    const { result } = renderHook(() => useWeeklyActivity());

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("正常系: セッションがない場合、空のデータを返す", () => {
    (useSession as jest.Mock).mockReturnValueOnce({ session: null });
    (useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useWeeklyActivity());

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
