import {
  isLinkCache,
  isLinksStartsWithCache,
  LINK_CACHE_KEYS,
} from "../linkCacheKeys";

describe("LINK_CACHE_KEYS", () => {
  describe("TODAY_LINKS", () => {
    it("正しいキャッシュキーを返すこと", () => {
      const userId = "test-user-id";
      const result = LINK_CACHE_KEYS.TODAY_LINKS(userId);
      expect(result).toEqual(["today-links", userId]);
    });
  });

  describe("SWIPEABLE_LINKS", () => {
    it("正しいキャッシュキーを返すこと", () => {
      const userId = "test-user-id";
      const result = LINK_CACHE_KEYS.SWIPEABLE_LINKS(userId);
      expect(result).toEqual(["swipeable-links", userId]);
    });
  });

  describe("USER_LINKS", () => {
    it("デフォルトのlimit値で正しいキャッシュキーを返すこと", () => {
      const userId = "test-user-id";
      const result = LINK_CACHE_KEYS.USER_LINKS(userId);
      expect(result).toEqual([`user-links-${userId}`, 10]);
    });

    it("指定したlimit値で正しいキャッシュキーを返すこと", () => {
      const userId = "test-user-id";
      const limit = 20;
      const result = LINK_CACHE_KEYS.USER_LINKS(userId, limit);
      expect(result).toEqual([`user-links-${userId}`, limit]);
    });
  });

  describe("LINKS", () => {
    it("正しいキャッシュキーを返すこと", () => {
      const limit = 5;
      const result = LINK_CACHE_KEYS.LINKS(limit);
      expect(result).toEqual(["links", limit]);
    });
  });

  describe("OG_DATA", () => {
    it("正しいキャッシュキーを返すこと", () => {
      const urlsKey = "url1,url2,url3";
      const result = LINK_CACHE_KEYS.OG_DATA(urlsKey);
      expect(result).toEqual(["og-data", urlsKey]);
    });
  });
});

describe("isLinkCache", () => {
  it("配列の最初の要素が文字列でlinksを含む場合はtrueを返すこと", () => {
    expect(isLinkCache(["links", 5])).toBe(true);
    expect(isLinkCache(["today-links", "user-id"])).toBe(true);
    expect(isLinkCache(["user-links-123", 10])).toBe(true);
  });

  it("配列の最初の要素が文字列でlinksを含まない場合はfalseを返すこと", () => {
    expect(isLinkCache(["og-data", "url-key"])).toBe(false);
    expect(isLinkCache(["users", "user-id"])).toBe(false);
  });

  it("配列でない場合はfalseを返すこと", () => {
    expect(isLinkCache("links")).toBe(false);
    expect(isLinkCache(123)).toBe(false);
    expect(isLinkCache(null)).toBe(false);
    expect(isLinkCache(undefined)).toBe(false);
    expect(isLinkCache({})).toBe(false);
  });

  it("空の配列の場合はfalseを返すこと", () => {
    expect(isLinkCache([])).toBe(false);
  });
});

describe("isLinksStartsWithCache", () => {
  it("文字列がlinks-で始まる場合はtrueを返すこと", () => {
    expect(isLinksStartsWithCache("links-123")).toBe(true);
    expect(isLinksStartsWithCache("links-user-id")).toBe(true);
  });

  it("文字列がlinks-で始まらない場合はfalseを返すこと", () => {
    expect(isLinksStartsWithCache("today-links")).toBe(false);
    expect(isLinksStartsWithCache("user-links")).toBe(false);
  });

  it("配列の最初の要素が文字列でlinks-で始まる場合はtrueを返すこと", () => {
    expect(isLinksStartsWithCache(["links-123", 5])).toBe(true);
    expect(isLinksStartsWithCache(["links-user-id", "data"])).toBe(true);
  });

  it("配列の最初の要素が文字列でlinks-で始まらない場合はfalseを返すこと", () => {
    expect(isLinksStartsWithCache(["today-links", "user-id"])).toBe(false);
    expect(isLinksStartsWithCache(["user-links-123", 10])).toBe(false);
  });

  it("配列でも文字列でもない場合はfalseを返すこと", () => {
    expect(isLinksStartsWithCache(123)).toBe(false);
    expect(isLinksStartsWithCache(null)).toBe(false);
    expect(isLinksStartsWithCache(undefined)).toBe(false);
    expect(isLinksStartsWithCache({})).toBe(false);
  });

  it("空の配列の場合はfalseを返すこと", () => {
    expect(isLinksStartsWithCache([])).toBe(false);
  });
});
