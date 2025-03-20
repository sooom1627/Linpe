import {
  LINK_TABS_CONFIG,
  type UserLink,
} from "@/feature/links/domain/models/types";
import { linkFilterService } from "../linkFilterService";

describe("linkFilterService", () => {
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

  // テスト用のモックリンク
  const mockLinks: UserLink[] = [
    createMockLink({ link_id: "1", status: "add", read_at: null }),
    createMockLink({ link_id: "2", status: "Today", read_at: null }),
    createMockLink({ link_id: "3", status: "inWeekend", read_at: null }),
    createMockLink({
      link_id: "4",
      status: "Read",
      read_at: "2023-01-02T00:00:00.000Z",
    }),
    createMockLink({
      link_id: "5",
      status: "Bookmark",
      read_at: "2023-01-03T00:00:00.000Z",
    }),
    createMockLink({
      link_id: "6",
      status: "Re-Read",
      read_at: "2023-01-04T00:00:00.000Z",
    }),
    createMockLink({ link_id: "7", status: "Skip", read_at: null }),
  ];

  describe("filterByTab", () => {
    it("allタブではすべてのリンクを返すこと", () => {
      const result = linkFilterService.filterByTab(mockLinks, "all");
      expect(result).toHaveLength(mockLinks.length);
      expect(result).toEqual(mockLinks);
    });

    it("toReadタブではread_atがnullまたはステータスがRe-Readのリンクを返すこと", () => {
      const result = linkFilterService.filterByTab(mockLinks, "toRead");

      // 結果の検証
      expect(result).toHaveLength(5); // 未読4件 + Re-Read 1件
      expect(
        result.every(
          (link) => link.read_at === null || link.status === "Re-Read",
        ),
      ).toBe(true);
      expect(result.find((link) => link.link_id === "6")).toBeTruthy(); // Re-Readステータスのリンクを含む
    });

    it("readタブではread_atが値を持つリンクを返すこと", () => {
      const result = linkFilterService.filterByTab(mockLinks, "read");

      // 結果の検証
      expect(result).toHaveLength(3); // 既読3件
      expect(result.every((link) => link.read_at !== null)).toBe(true);
    });
  });

  describe("filterByStatus", () => {
    it("statusがnullの場合、すべてのリンクを返すこと", () => {
      const result = linkFilterService.filterByStatus(mockLinks, null);
      expect(result).toEqual(mockLinks);
    });

    it("指定したステータスに一致するリンクのみを返すこと", () => {
      const result = linkFilterService.filterByStatus(mockLinks, "Today");

      // 結果の検証
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("Today");
    });

    it("条件に一致するリンクがない場合、空の配列を返すこと", () => {
      const result = linkFilterService.filterByStatus(
        mockLinks,
        "不存在のステータス",
      );
      expect(result).toHaveLength(0);
    });
  });

  describe("getAvailableStatuses", () => {
    it("各タブの利用可能なステータスを正しく返すこと", () => {
      // allタブ
      const allStatuses = linkFilterService.getAvailableStatuses("all");
      expect(allStatuses).toEqual(LINK_TABS_CONFIG.all.statuses);

      // toReadタブ
      const toReadStatuses = linkFilterService.getAvailableStatuses("toRead");
      expect(toReadStatuses).toEqual(LINK_TABS_CONFIG.toRead.statuses);

      // readタブ
      const readStatuses = linkFilterService.getAvailableStatuses("read");
      expect(readStatuses).toEqual(LINK_TABS_CONFIG.read.statuses);
    });
  });

  describe("filterLinks", () => {
    it("タブとステータスの両方でフィルタリングすること", () => {
      // toReadタブ + Todayステータス
      const result = linkFilterService.filterLinks(
        mockLinks,
        "toRead",
        "Today",
      );

      // 結果の検証
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("Today");
      expect(result[0].read_at).toBeNull();
    });

    it("タブでフィルタリングした後にステータスフィルタリングで一致するものがない場合、空の配列を返すこと", () => {
      // readタブ + Todayステータス (存在しない組み合わせ)
      const result = linkFilterService.filterLinks(mockLinks, "read", "Today");
      expect(result).toHaveLength(0);
    });

    it("ステータスがnullの場合、タブのフィルタリング結果のみを返すこと", () => {
      const result = linkFilterService.filterLinks(mockLinks, "read", null);

      // 結果の検証
      expect(result).toHaveLength(3); // 既読3件
      expect(result.every((link) => link.read_at !== null)).toBe(true);
    });
  });
});
