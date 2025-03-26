import {
  isLinkCache,
  isLinksStartsWithCache,
  LINK_CACHE_KEYS,
} from "../linkCacheKeys";
import { linkCacheService } from "../linkCacheService";

// モック
jest.mock("../linkCacheKeys", () => ({
  LINK_CACHE_KEYS: {
    STATUS_LINKS: jest.fn((userId, status) => ["status-links", userId, status]),
    SWIPEABLE_LINKS: jest.fn((userId) => ["swipeable-links", userId]),
    USER_LINKS: jest.fn((userId, limit = 10) => [
      `user-links-${userId}`,
      limit,
    ]),
    LINKS: jest.fn((limit) => ["links", limit]),
    OG_DATA: jest.fn((urlsKey) => ["og-data", urlsKey]),
  },
  isLinkCache: jest.fn(),
  isLinksStartsWithCache: jest.fn(),
}));

describe("linkCacheService", () => {
  let mockMutate: jest.Mock;

  beforeEach(() => {
    mockMutate = jest.fn();
    (isLinkCache as jest.Mock).mockClear();
    (isLinksStartsWithCache as jest.Mock).mockClear();
    Object.values(LINK_CACHE_KEYS).forEach((fn) => {
      (fn as jest.Mock).mockClear();
    });
  });

  describe("updateAfterLinkAction", () => {
    it("正しいキャッシュキーでmutateを呼び出すこと", () => {
      const userId = "test-user-id";

      linkCacheService.updateAfterLinkAction(userId, mockMutate);

      // 具体的なキャッシュキーの更新
      expect(LINK_CACHE_KEYS.STATUS_LINKS).toHaveBeenCalledWith(
        userId,
        "Today",
      );
      // SWIPEABLE_LINKSのキャッシュは更新しない（SwipeScreen操作時に不要なため）
      expect(LINK_CACHE_KEYS.USER_LINKS).toHaveBeenCalledWith(userId, 10);

      // mutateの呼び出し
      expect(mockMutate).toHaveBeenCalledTimes(3);
      expect(mockMutate).toHaveBeenCalledWith([
        "status-links",
        userId,
        "Today",
      ]);
      expect(mockMutate).toHaveBeenCalledWith([
        "status-links",
        userId,
        "inWeekend",
      ]);
      expect(mockMutate).toHaveBeenCalledWith([`user-links-${userId}`, 10]);
      // 汎用的なキャッシュのクリアは不要（具体的なキーのみを更新する）
    });
  });

  describe("updateAfterLinkAdd", () => {
    it("正しいパターンマッチングでmutateを呼び出すこと", () => {
      const userId = "test-user-id";

      linkCacheService.updateAfterLinkAdd(userId, mockMutate);

      // mutateの呼び出し
      expect(mockMutate).toHaveBeenCalledTimes(2);
      expect(mockMutate).toHaveBeenCalledWith(isLinksStartsWithCache);
      expect(mockMutate).toHaveBeenCalledWith(["swipeable-links", userId]);
    });
  });

  describe("updateOGData", () => {
    it("mutateを呼び出すこと", () => {
      const urlsKey = "url1,url2,url3";

      linkCacheService.updateOGData(urlsKey, mockMutate);

      // mutateの呼び出し
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });
  });
});
