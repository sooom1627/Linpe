import { renderHook, waitFor } from "@testing-library/react-native";
import { SWRConfig } from "swr";

import { linkService } from "@/feature/links/application/service/linkServices";
import { type UserLink } from "@/feature/links/domain/models/types";
import { useUserAllLinks } from "../useUserAllLinks";

// モック
jest.mock("@/feature/links/application/service/linkServices", () => ({
  linkService: {
    fetchUserLinks: jest.fn(),
  },
}));

describe("useUserAllLinks", () => {
  // テスト用のモックデータ
  const createMockLink = (overrides = {}): UserLink => ({
    link_id: "1",
    full_url: "https://example.com",
    domain: "example.com",
    parameter: "",
    link_created_at: "2023-01-01T00:00:00.000Z",
    status: "add",
    added_at: "2023-01-01T00:00:00.000Z",
    scheduled_read_at: null,
    read_at: null,
    read_count: 0,
    swipe_count: 0,
    user_id: "test-user",
    ...overrides,
  });

  const mockLinks = [
    createMockLink({ link_id: "1" }),
    createMockLink({ link_id: "2" }),
  ];

  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // テスト用のラッパーコンポーネント
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  );

  it("ユーザーIDが提供されている場合、データを正しく取得すること", async () => {
    // モックの設定
    (linkService.fetchUserLinks as jest.Mock).mockResolvedValue(mockLinks);

    // フックをレンダリング
    const { result } = renderHook(() => useUserAllLinks("test-user", 50), {
      wrapper,
    });

    // 初期状態の確認
    expect(result.current.isLoading).toBe(true);
    expect(result.current.links).toEqual([]);

    // データ取得後の状態を待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 結果の検証
    expect(linkService.fetchUserLinks).toHaveBeenCalledWith("test-user", 50);
    expect(result.current.links).toEqual(mockLinks);
    expect(result.current.isError).toBeFalsy();
    expect(result.current.isEmpty).toBe(false);
  });

  it("ユーザーIDがnullの場合、データ取得を行わないこと", async () => {
    // フックをレンダリング
    const { result } = renderHook(() => useUserAllLinks(null), { wrapper });

    // データ取得がスキップされることを確認
    expect(linkService.fetchUserLinks).not.toHaveBeenCalled();
    expect(result.current.links).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("データ取得に失敗した場合、エラー状態が設定されること", async () => {
    // エラーをモック
    const mockError = new Error("データ取得エラー");
    (linkService.fetchUserLinks as jest.Mock).mockRejectedValue(mockError);

    // フックをレンダリング
    const { result } = renderHook(() => useUserAllLinks("test-user", 50), {
      wrapper,
    });

    // 初期状態の確認
    expect(result.current.isLoading).toBe(true);

    // エラー状態を待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 結果の検証
    expect(result.current.isError).toBeTruthy();
    expect(result.current.links).toEqual([]);
  });

  it("空のデータが返された場合、空の配列を設定すること", async () => {
    // 空の配列を返すようにモック
    (linkService.fetchUserLinks as jest.Mock).mockResolvedValue([]);

    // フックをレンダリング
    const { result } = renderHook(() => useUserAllLinks("test-user", 50), {
      wrapper,
    });

    // データ取得後の状態を待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 結果の検証
    expect(result.current.links).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });

  it("デフォルトのlimit値が正しく設定されること", async () => {
    // モックの設定
    (linkService.fetchUserLinks as jest.Mock).mockResolvedValue(mockLinks);

    // limitを指定せずにフックをレンダリング
    const { result } = renderHook(() => useUserAllLinks("test-user"), {
      wrapper,
    });

    // データ取得後の状態を待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // デフォルト値で呼び出されることを確認
    expect(linkService.fetchUserLinks).toHaveBeenCalledWith("test-user", 50);
  });
});
