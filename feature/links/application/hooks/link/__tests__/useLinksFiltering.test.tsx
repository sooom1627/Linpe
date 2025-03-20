import { renderHook } from "@testing-library/react-native";

import { linkFilterService } from "@/feature/links/application/service/linkFilterService";
import {
  type LinkTabGroup,
  type UserLink,
} from "@/feature/links/domain/models/types";
import { useLinksFiltering } from "../useLinksFiltering";

// モック
jest.mock("@/feature/links/application/service/linkFilterService", () => ({
  linkFilterService: {
    filterLinks: jest.fn(),
    getAvailableStatuses: jest.fn(),
  },
}));

describe("useLinksFiltering", () => {
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
    createMockLink({ link_id: "1", status: "add", read_at: null }),
    createMockLink({ link_id: "2", status: "Today", read_at: null }),
  ];

  const mockFilteredLinks = [mockLinks[0]];
  const mockAvailableStatuses = ["add", "Today", "inWeekend"];

  // 各テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
    (linkFilterService.filterLinks as jest.Mock).mockReturnValue(
      mockFilteredLinks,
    );
    (linkFilterService.getAvailableStatuses as jest.Mock).mockReturnValue(
      mockAvailableStatuses,
    );
  });

  it("linkFilterServiceを正しいパラメータで呼び出すこと", () => {
    // フックをレンダリング
    renderHook(() => useLinksFiltering(mockLinks, "toRead", "Today"));

    // サービスの呼び出しを検証
    expect(linkFilterService.filterLinks).toHaveBeenCalledWith(
      mockLinks,
      "toRead",
      "Today",
    );
    expect(linkFilterService.getAvailableStatuses).toHaveBeenCalledWith(
      "toRead",
    );
  });

  it("フィルタリング結果と利用可能なステータスを返すこと", () => {
    // フックをレンダリング
    const { result } = renderHook(() =>
      useLinksFiltering(mockLinks, "toRead", "Today"),
    );

    // 結果の検証
    expect(result.current.filteredLinks).toEqual(mockFilteredLinks);
    expect(result.current.availableStatuses).toEqual(mockAvailableStatuses);
  });

  it("パラメータが変更されたときにのみサービスを再呼び出しすること", () => {
    // 初回レンダリング
    const { rerender } = renderHook(
      ({
        links,
        tab,
        status,
      }: {
        links: UserLink[];
        tab: LinkTabGroup;
        status: string | null;
      }) => useLinksFiltering(links, tab, status),
      {
        initialProps: {
          links: mockLinks,
          tab: "toRead",
          status: "Today",
        },
      },
    );

    // サービスの呼び出しをリセット
    jest.clearAllMocks();

    // 同じパラメータで再レンダリング
    rerender({
      links: mockLinks,
      tab: "toRead",
      status: "Today",
    });

    // メモ化により呼び出されないことを確認
    expect(linkFilterService.filterLinks).not.toHaveBeenCalled();
    expect(linkFilterService.getAvailableStatuses).not.toHaveBeenCalled();

    // リンクを変更して再レンダリング
    const newMockLinks = [...mockLinks, createMockLink({ link_id: "3" })];
    rerender({
      links: newMockLinks,
      tab: "toRead",
      status: "Today",
    });

    // filterLinksが再度呼び出されることを確認
    expect(linkFilterService.filterLinks).toHaveBeenCalledWith(
      newMockLinks,
      "toRead",
      "Today",
    );
    // getAvailableStatusesはタブが変わっていないので呼び出されない
    expect(linkFilterService.getAvailableStatuses).not.toHaveBeenCalled();

    // タブを変更して再レンダリング
    rerender({
      links: newMockLinks,
      tab: "read",
      status: "Today",
    });

    // 両方のメソッドが再度呼び出されることを確認
    expect(linkFilterService.filterLinks).toHaveBeenCalledWith(
      newMockLinks,
      "read",
      "Today",
    );
    expect(linkFilterService.getAvailableStatuses).toHaveBeenCalledWith("read");
  });
});
