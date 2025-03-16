import { renderHook } from "@testing-library/react-native";
import useSWR from "swr";

import { useSession } from "@/feature/auth/application/hooks/useSession";
import type {
  ActivityViewModel,
  WeeklyActivityData,
} from "../../../domain/models/activity";
import {
  WeeklyActivityService,
  type IWeeklyActivityRepository,
} from "../../services/weeklyActivityService";
import { useWeeklyActivity } from "../useWeeklyActivity";

// モックの設定
jest.mock("@/feature/auth/application/hooks/useSession");
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
  })),
}));

describe("useWeeklyActivity", () => {
  // モックサービスの作成
  const mockService = new WeeklyActivityService({
    fetchActivityLogs: jest.fn(),
  } as jest.Mocked<IWeeklyActivityRepository>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("SWRの設定", () => {
    it("セッションがない場合、useSWRがnullキーで呼ばれること", () => {
      // useSessionモックの設定
      (useSession as jest.Mock).mockReturnValue({
        session: null,
      });

      // フックを実行
      renderHook(() => useWeeklyActivity(mockService));

      // useSWRの呼び出しを検証
      expect(useSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function),
        expect.objectContaining({
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }),
      );
    });

    it("セッションがある場合、正しいキーでuseSWRが呼ばれること", () => {
      const userId = "test-user";
      // useSessionモックの設定
      (useSession as jest.Mock).mockReturnValue({
        session: { user: { id: userId } },
      });

      // フックを実行
      renderHook(() => useWeeklyActivity(mockService));

      // useSWRの呼び出しを検証
      expect(useSWR).toHaveBeenCalledWith(
        ["weeklyActivity", userId],
        expect.any(Function),
        expect.objectContaining({
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }),
      );
    });
  });

  describe("データ取得と変換", () => {
    it("セッションがある場合、データを正しく取得して変換すること", async () => {
      const userId = "test-user";
      // useSessionモックの設定
      (useSession as jest.Mock).mockReturnValue({
        session: { user: { id: userId } },
      });

      // サービスのモックデータを設定
      const mockWeeklyData: WeeklyActivityData = {
        activities: [
          {
            date: new Date("2024-01-05"),
            activities: { add: 1, swipe: 1, read: 1 },
          },
        ],
      };
      const mockViewModel: ActivityViewModel[] = [
        { day: "Fri", add: 1, swipe: 1, read: 1 },
      ];

      jest
        .spyOn(mockService, "getWeeklyActivity")
        .mockResolvedValue(mockWeeklyData);
      jest.spyOn(mockService, "toViewModel").mockReturnValue(mockViewModel);

      // フックを実行
      renderHook(() => useWeeklyActivity(mockService));
      const fetcher = (useSWR as jest.Mock).mock.calls[0][1];

      // fetcherを実行して結果を検証
      const data = await fetcher();
      expect(mockService.getWeeklyActivity).toHaveBeenCalledWith(userId);
      expect(mockService.toViewModel).toHaveBeenCalledWith(mockWeeklyData);
      expect(data).toEqual(mockViewModel);
    });

    it("セッションがない場合、nullを返すこと", async () => {
      // useSessionモックの設定
      (useSession as jest.Mock).mockReturnValue({
        session: null,
      });

      // フックを実行
      renderHook(() => useWeeklyActivity(mockService));
      const fetcher = (useSWR as jest.Mock).mock.calls[0][1];

      // fetcherを実行して結果を検証
      const data = await fetcher();
      expect(data).toBeNull();
      expect(mockService.getWeeklyActivity).not.toHaveBeenCalled();
      expect(mockService.toViewModel).not.toHaveBeenCalled();
    });
  });
});
