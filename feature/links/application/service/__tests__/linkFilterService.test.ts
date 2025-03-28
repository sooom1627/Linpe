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
    re_read: false,
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
      status: "Read",
      read_at: "2023-01-04T00:00:00.000Z",
      re_read: true,
    }),
    createMockLink({ link_id: "7", status: "Skip", read_at: null }),
    createMockLink({
      link_id: "8",
      status: "Today",
      read_at: null,
      re_read: true,
    }),
    createMockLink({
      link_id: "9",
      status: "inMonth",
      read_at: null,
      re_read: true,
    }),
  ];

  describe("filterByTab", () => {
    it("存在しないタブIDの場合はすべてのリンクを返すこと", () => {
      // @ts-expect-error - 意図的に存在しないタブIDをテスト
      const result = linkFilterService.filterByTab(mockLinks, "nonexistent");
      expect(result).toHaveLength(mockLinks.length);
      expect(result).toEqual(mockLinks);
    });

    it("toReadタブではread_atがnullまたはre_readがtrueの適切なステータスのリンクを返すこと", () => {
      const result = linkFilterService.filterByTab(mockLinks, "toRead");

      // 結果の検証
      expect(result).toHaveLength(7); // 未読4件 + re_read=true 3件（link_id: 6, 8, 9）

      // 未読のリンクが含まれている
      const unreadLinks = result.filter((link) => link.read_at === null);
      expect(unreadLinks.length).toBeGreaterThan(0);

      // re_read=trueのリンクが含まれている
      const reReadLinks = result.filter((link) => link.re_read === true);
      expect(reReadLinks.length).toBeGreaterThan(0);

      // 全てのリンクがフィルター条件を満たしている
      expect(
        result.every(
          (link) =>
            link.read_at === null ||
            (link.re_read === true &&
              ["Skip", "Today", "inMonth", "Read"].includes(link.status)),
        ),
      ).toBe(true);
    });

    it("readタブではread_atが値を持つリンクまたはre_readがtrueのリンクを返すこと", () => {
      const result = linkFilterService.filterByTab(mockLinks, "read");

      // 結果の検証
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (link) =>
            link.read_at !== null ||
            (link.re_read === true &&
              ["Skip", "Today", "inMonth", "Read"].includes(link.status)),
        ),
      ).toBe(true);
    });
  });

  describe("filterByStatus", () => {
    it("statusがnullの場合、すべてのリンクを返すこと", () => {
      const result = linkFilterService.filterByStatus(mockLinks, null);
      expect(result).toEqual(mockLinks);
    });

    it("Re-Readステータスの場合、有効なステータスかつre_read=trueのリンクを返すこと", () => {
      const result = linkFilterService.filterByStatus(mockLinks, "Re-Read");

      // Re-Readリンクのみが返される
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (link) =>
            link.re_read === true &&
            ["Skip", "Today", "inMonth", "Read"].includes(link.status),
        ),
      ).toBe(true);
    });

    it("指定したステータスに一致するリンクのみを返すこと", () => {
      const result = linkFilterService.filterByStatus(mockLinks, "Today");

      // 結果の検証
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((link) => link.status === "Today")).toBe(true);
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
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((link) => link.status === "Today")).toBe(true);
    });

    it("Re-Readでフィルタリングした場合、正しいリンクを返すこと", () => {
      const result = linkFilterService.filterLinks(
        mockLinks,
        "toRead",
        "Re-Read",
      );

      // 結果の検証
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (link) =>
            link.re_read === true &&
            ["Skip", "Today", "inMonth", "Read"].includes(link.status),
        ),
      ).toBe(true);
    });

    it("タブでフィルタリングした後にステータスフィルタリングで一致するものがない場合、空の配列を返すこと", () => {
      // readタブ + 存在しないステータス
      const result = linkFilterService.filterLinks(
        mockLinks,
        "read",
        "存在しないステータス",
      );
      expect(result).toHaveLength(0);
    });

    it("ステータスがnullの場合、タブのフィルタリング結果のみを返すこと", () => {
      const result = linkFilterService.filterLinks(mockLinks, "read", null);

      // 結果の検証
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (link) =>
            link.read_at !== null ||
            (link.re_read === true &&
              ["Skip", "Today", "inMonth", "Read"].includes(link.status)),
        ),
      ).toBe(true);
    });
  });
});
