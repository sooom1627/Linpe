import useSWR from "swr";

import { LINK_CACHE_KEYS } from "@/feature/links/application/cache/linkCacheKeys";
import { linkService } from "@/feature/links/application/service/linkServices";
import { type UserLink } from "@/feature/links/domain/models/types";
import { useStatusLinks } from "../useLinks";

// モックの型定義
type MockLinkService = {
  fetchLinksByStatus: jest.Mock;
};

// SWRのモック
jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// linkServiceのモック
jest.mock("@/feature/links/application/service/linkServices", () => ({
  linkService: {
    fetchLinksByStatus: jest.fn(),
  },
}));

// キャッシュキーのモック
jest.mock("@/feature/links/application/cache/linkCacheKeys", () => ({
  LINK_CACHE_KEYS: {
    STATUS_LINKS: jest.fn((userId, status) => ["status-links", userId, status]),
  },
}));

describe("useStatusLinks", () => {
  // モックされたlinkServiceへの参照
  let mockLinkService: MockLinkService;

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

  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
    mockLinkService = linkService as unknown as MockLinkService;
  });

  it("ユーザーIDがnullの場合、SWRは呼び出されないこと", () => {
    // useSWRモックをセットアップ
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
    });

    // フックを呼び出し
    useStatusLinks(null);

    // 検証
    expect(useSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object),
    );
    expect(mockLinkService.fetchLinksByStatus).not.toHaveBeenCalled();
    expect(LINK_CACHE_KEYS.STATUS_LINKS).not.toHaveBeenCalled();
  });

  it("正常系: ユーザーIDとステータスに基づいてリンクを取得すること", () => {
    // 準備
    const userId = "test-user";
    const status = "inWeekend";
    const mockLinks = [createMockLink({ status })];

    // useSWRモックをセットアップ
    (useSWR as jest.Mock).mockReturnValue({
      data: mockLinks,
      error: null,
      isLoading: false,
    });

    // フックを呼び出し
    const result = useStatusLinks(userId, status);

    // 検証
    expect(LINK_CACHE_KEYS.STATUS_LINKS).toHaveBeenCalledWith(userId, status);
    expect(useSWR).toHaveBeenCalledWith(
      ["status-links", userId, status],
      expect.any(Function),
      expect.any(Object),
    );

    // 結果が正しいこと
    expect(result.links).toEqual(mockLinks);
    expect(result.isError).toBeNull();
    expect(result.isLoading).toBe(false);
    expect(result.isEmpty).toBe(false);
  });

  it("デフォルトのステータスは'Today'であること", () => {
    // 準備
    const userId = "test-user";
    const mockLinks = [createMockLink({ status: "Today" })];

    // useSWRモックをセットアップ
    (useSWR as jest.Mock).mockReturnValue({
      data: mockLinks,
      error: null,
      isLoading: false,
    });

    // フックを呼び出し（ステータスを省略）
    useStatusLinks(userId);

    // 検証（デフォルトステータスが"Today"であること）
    expect(LINK_CACHE_KEYS.STATUS_LINKS).toHaveBeenCalledWith(userId, "Today");
  });

  it("異常系: エラーが発生した場合、エラー状態を返すこと", () => {
    // 準備
    const userId = "test-user";
    const status = "inWeekend";
    const mockError = new Error("API error");

    // useSWRモックをセットアップ
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
    });

    // フックを呼び出し
    const result = useStatusLinks(userId, status);

    // 検証
    expect(result.isError).toEqual(mockError);
    expect(result.links).toEqual([]);
    expect(result.isEmpty).toBe(true);
  });
});
