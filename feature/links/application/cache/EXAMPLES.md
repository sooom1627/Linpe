# キャッシュ中央管理システム - 実装例

このドキュメントでは、Linpeアプリケーションのキャッシュ中央管理システムの具体的な実装例を紹介します。

## 目次

1. [フックでの実装例](#フックでの実装例)
2. [サービスでの実装例](#サービスでの実装例)
3. [コンポーネントでの実装例](#コンポーネントでの実装例)
4. [テストでの実装例](#テストでの実装例)

## フックでの実装例

### useLinkAction フック

```typescript
import { useSWRConfig } from "swr";

import { notificationService } from "@/feature/common/application/service";
import { linkCacheService } from "@/feature/links/application/cache";
import { linkActionService } from "@/feature/links/application/service";
import { type LinkActionStatus } from "@/feature/links/domain/model";

/**
 * リンクアクションを管理するフック
 */
export const useLinkAction = () => {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * リンクアクションを更新する
   * @param userId ユーザーID
   * @param linkId リンクID
   * @param status ステータス
   * @param swipeCount スワイプ回数
   */
  const updateLinkAction = async (
    userId: string,
    linkId: string,
    status: LinkActionStatus,
    swipeCount: number = 0,
  ) => {
    setIsLoading(true);
    try {
      const result = await linkActionService.updateLinkAction(
        userId,
        linkId,
        status,
        swipeCount,
      );

      if (result.success) {
        // キャッシュ更新
        linkCacheService.updateAfterLinkAction(userId, mutate);

        // 成功通知
        notificationService.success(
          "リンクが更新されました",
          `ステータス: ${status}`,
          {
            duration: 2000,
          },
        );
        return { success: true, data: result.data };
      } else {
        // エラー通知
        notificationService.error(
          "リンクの更新に失敗しました",
          result.error?.message,
          {
            duration: 3000,
          },
        );
        return { success: false, error: result.error };
      }
    } catch (error) {
      // エラー通知
      notificationService.error("リンクの更新に失敗しました", error.message, {
        duration: 3000,
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * リンクを削除する
   * @param userId ユーザーID
   * @param linkId リンクID
   */
  const deleteLinkAction = async (userId: string, linkId: string) => {
    setIsLoading(true);
    try {
      const result = await linkActionService.deleteLinkAction(userId, linkId);

      if (result.success) {
        // キャッシュ更新
        linkCacheService.updateAfterLinkAction(userId, mutate);

        // 成功通知
        notificationService.success("リンクが削除されました", undefined, {
          duration: 2000,
        });
        return { success: true };
      } else {
        // エラー通知
        notificationService.error(
          "リンクの削除に失敗しました",
          result.error?.message,
          {
            duration: 3000,
          },
        );
        return { success: false, error: result.error };
      }
    } catch (error) {
      // エラー通知
      notificationService.error("リンクの削除に失敗しました", error.message, {
        duration: 3000,
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateLinkAction,
    deleteLinkAction,
    isLoading,
  };
};
```

### useLinkInput フック

```typescript
import { useState } from "react";
import { useSWRConfig } from "swr";

import { notificationService } from "@/feature/common/application/service";
import { linkCacheService } from "@/feature/links/application/cache";
import { linkService } from "@/feature/links/application/service";

/**
 * リンク入力を管理するフック
 */
export const useLinkInput = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  /**
   * リンクを追加する
   * @param userId ユーザーID
   */
  const handleAddLink = async (userId: string) => {
    if (!url) {
      notificationService.error("URLを入力してください", undefined, {
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await linkService.addLinkAndUser(url, userId);

      // キャッシュ更新
      linkCacheService.updateAfterLinkAdd(userId, mutate);

      // 通知表示
      if (data.status === "registered") {
        notificationService.success("リンクが追加されました", undefined, {
          duration: 2000,
        });
      } else {
        notificationService.info("既に登録されているリンクです", undefined, {
          duration: 2000,
        });
      }

      // 入力フィールドをクリア
      setUrl("");
      return data;
    } catch (error) {
      notificationService.error("リンクの追加に失敗しました", error.message, {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    url,
    setUrl,
    handleAddLink,
    isLoading,
  };
};
```

## サービスでの実装例

### linkActionService

```typescript
import { type KeyedMutator } from "swr";

import { linkCacheService } from "@/feature/links/application/cache";
import { type LinkActionStatus } from "@/feature/links/domain/model";
import { linkActionsApi } from "@/feature/links/infrastructure/api";

/**
 * リンクアクションを管理するサービス
 */
export const linkActionService = {
  /**
   * リンクアクションを更新する
   * @param userId ユーザーID
   * @param linkId リンクID
   * @param status ステータス
   * @param swipeCount スワイプ回数
   */
  updateLinkAction: async (
    userId: string,
    linkId: string,
    status: LinkActionStatus,
    swipeCount: number = 0,
  ) => {
    try {
      // リンクアクションの更新
      const data = await linkActionsApi.updateLinkAction(
        userId,
        linkId,
        status,
        swipeCount,
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  },

  /**
   * リンクを削除する
   * @param userId ユーザーID
   * @param linkId リンクID
   */
  deleteLinkAction: async (userId: string, linkId: string) => {
    try {
      // リンクの削除
      await linkActionsApi.deleteLinkAction(userId, linkId);

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  },

  /**
   * 削除後のキャッシュ更新（レガシーメソッド - 非推奨）
   * @param userId ユーザーID
   * @param mutate SWRのmutate関数
   */
  updateCacheAfterDelete: (userId: string, mutate: KeyedMutator<any>): void => {
    // 代わりにlinkCacheServiceを使用することを推奨
    linkCacheService.updateAfterLinkAction(userId, mutate);
  },
};
```

## コンポーネントでの実装例

### LinkActionView コンポーネント

```tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { LoadingButton } from "@/feature/common/presentation/components/buttons";
import { useLinkAction } from "@/feature/links/application/hooks/link";
import { HorizontalCard } from "@/feature/links/presentation/components/cards";

type LinkActionViewProps = {
  onClose: () => void;
};

/**
 * リンクアクションビュー
 */
export const LinkActionView: React.FC<LinkActionViewProps> = ({ onClose }) => {
  // URLパラメータからリンク情報を取得
  const params = useLocalSearchParams<{
    linkId: string;
    userId: string;
    title: string;
    domain: string;
    full_url: string;
  }>();

  // リンクアクションフックを使用
  const { deleteLinkAction, isLoading } = useLinkAction();

  /**
   * リンク削除ハンドラー
   */
  const handleDelete = async () => {
    if (!params.linkId || !params.userId) return;

    const result = await deleteLinkAction(params.userId, params.linkId);

    if (result.success) {
      // 成功時にモーダルを閉じる
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>リンク詳細</Text>

      {/* リンク情報カード */}
      {params.title && params.domain && params.full_url && (
        <HorizontalCard
          title={params.title}
          domain={params.domain}
          url={params.full_url}
        />
      )}

      <View style={styles.buttonContainer}>
        {/* 削除ボタン */}
        <LoadingButton
          title="リンクを削除"
          onPress={handleDelete}
          isLoading={isLoading}
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
        />

        {/* キャンセルボタン */}
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 24,
  },
  deleteButton: {
    backgroundColor: "#ff4d4f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontWeight: "bold",
  },
});
```

## テストでの実装例

### linkCacheKeys のテスト

```typescript
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
    it("デフォルトの制限値で正しいキャッシュキーを返すこと", () => {
      const userId = "test-user-id";
      const result = LINK_CACHE_KEYS.USER_LINKS(userId);
      expect(result).toEqual([`user-links-${userId}`, 10]);
    });

    it("カスタムの制限値で正しいキャッシュキーを返すこと", () => {
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
      const urlsKey = "test-url-key";
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
    expect(isLinkCache(["users", 5])).toBe(false);
    expect(isLinkCache(["og-data", "url-key"])).toBe(false);
  });

  it("配列でない場合はfalseを返すこと", () => {
    expect(isLinkCache("links")).toBe(false);
    expect(isLinkCache(123)).toBe(false);
    expect(isLinkCache(null)).toBe(false);
    expect(isLinkCache(undefined)).toBe(false);
  });

  it("空の配列の場合はfalseを返すこと", () => {
    expect(isLinkCache([])).toBe(false);
  });

  it("配列の最初の要素が文字列でない場合はfalseを返すこと", () => {
    expect(isLinkCache([123, "links"])).toBe(false);
    expect(isLinkCache([null, "links"])).toBe(false);
  });
});

describe("isLinksStartsWithCache", () => {
  it("文字列がlinks-で始まる場合はtrueを返すこと", () => {
    expect(isLinksStartsWithCache("links-123")).toBe(true);
    expect(isLinksStartsWithCache("links-user-id")).toBe(true);
  });

  it("文字列がlinks-で始まらない場合はfalseを返すこと", () => {
    expect(isLinksStartsWithCache("user-links-123")).toBe(false);
    expect(isLinksStartsWithCache("today-links")).toBe(false);
  });

  it("配列の最初の要素が文字列でlinks-で始まる場合はtrueを返すこと", () => {
    expect(isLinksStartsWithCache(["links-123", 5])).toBe(true);
    expect(isLinksStartsWithCache(["links-user-id", "data"])).toBe(true);
  });

  it("配列の最初の要素が文字列でlinks-で始まらない場合はfalseを返すこと", () => {
    expect(isLinksStartsWithCache(["user-links-123", 10])).toBe(false);
    expect(isLinksStartsWithCache(["today-links", "user-id"])).toBe(false);
  });

  it("配列でも文字列でもない場合はfalseを返すこと", () => {
    expect(isLinksStartsWithCache(123)).toBe(false);
    expect(isLinksStartsWithCache(null)).toBe(false);
    expect(isLinksStartsWithCache(undefined)).toBe(false);
  });

  it("空の配列の場合はfalseを返すこと", () => {
    expect(isLinksStartsWithCache([])).toBe(false);
  });

  it("配列の最初の要素が文字列でない場合はfalseを返すこと", () => {
    expect(isLinksStartsWithCache([123, "links-123"])).toBe(false);
    expect(isLinksStartsWithCache([null, "links-123"])).toBe(false);
  });
});
```

### linkCacheService のテスト

```typescript
import {
  isLinkCache,
  isLinksStartsWithCache,
  LINK_CACHE_KEYS,
} from "../linkCacheKeys";
import { linkCacheService } from "../linkCacheService";

// モックの設定
jest.mock("../linkCacheKeys", () => ({
  LINK_CACHE_KEYS: {
    TODAY_LINKS: jest.fn().mockReturnValue(["today-links", "test-user-id"]),
    SWIPEABLE_LINKS: jest
      .fn()
      .mockReturnValue(["swipeable-links", "test-user-id"]),
    USER_LINKS: jest.fn().mockReturnValue(["user-links-test-user-id", 10]),
    OG_DATA: jest.fn().mockReturnValue(["og-data", "test-url-key"]),
  },
  isLinkCache: jest.fn(),
  isLinksStartsWithCache: jest.fn(),
}));

describe("linkCacheService", () => {
  let mockMutate: jest.Mock;

  beforeEach(() => {
    mockMutate = jest.fn();
    jest.clearAllMocks();
  });

  describe("updateAfterLinkAction", () => {
    it("正しいキャッシュキーでmutateを呼び出すこと", () => {
      const userId = "test-user-id";

      linkCacheService.updateAfterLinkAction(userId, mockMutate);

      // 具体的なキャッシュキーの更新
      expect(LINK_CACHE_KEYS.TODAY_LINKS).toHaveBeenCalledWith(userId);
      expect(LINK_CACHE_KEYS.SWIPEABLE_LINKS).toHaveBeenCalledWith(userId);
      expect(LINK_CACHE_KEYS.USER_LINKS).toHaveBeenCalledWith(userId, 10);

      // mutateの呼び出し
      expect(mockMutate).toHaveBeenCalledTimes(4);
      expect(mockMutate).toHaveBeenCalledWith(["today-links", "test-user-id"]);
      expect(mockMutate).toHaveBeenCalledWith([
        "swipeable-links",
        "test-user-id",
      ]);
      expect(mockMutate).toHaveBeenCalledWith(["user-links-test-user-id", 10]);
      expect(mockMutate).toHaveBeenCalledWith(isLinkCache);
    });
  });

  describe("updateAfterLinkAdd", () => {
    it("isLinksStartsWithCacheでmutateを呼び出すこと", () => {
      const userId = "test-user-id";

      linkCacheService.updateAfterLinkAdd(userId, mockMutate);

      // mutateの呼び出し
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith(isLinksStartsWithCache);
    });
  });

  describe("updateOGData", () => {
    it("mutateを呼び出すこと", () => {
      const urlsKey = "test-url-key";

      linkCacheService.updateOGData(urlsKey, mockMutate);

      // mutateの呼び出し
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith();
    });
  });
});
```

### useLinkAction フックのテスト

```typescript
import { act, renderHook } from "@testing-library/react-hooks";

import { notificationService } from "@/feature/common/application/service";
import { linkCacheService } from "@/feature/links/application/cache";
import { linkActionService } from "@/feature/links/application/service";
import { useLinkAction } from "../useLinkAction";

// モックの設定
jest.mock("@/feature/links/application/service", () => ({
  linkActionService: {
    updateLinkAction: jest.fn(),
    deleteLinkAction: jest.fn(),
  },
}));

jest.mock("@/feature/common/application/service", () => ({
  notificationService: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/feature/links/application/cache", () => ({
  linkCacheService: {
    updateAfterLinkAction: jest.fn(),
  },
}));

// SWRのmutateをモック
const mockMutate = jest.fn();
jest.mock("swr", () => ({
  useSWRConfig: () => ({ mutate: mockMutate }),
}));

describe("useLinkAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateLinkAction", () => {
    it("成功時に通知とキャッシュ更新が行われること", async () => {
      // 成功レスポンスのモック
      (linkActionService.updateLinkAction as jest.Mock).mockResolvedValue({
        success: true,
        data: { status: "Read" },
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // パラメータ
      const userId = "test-user-id";
      const linkId = "test-link-id";
      const status = "Read" as LinkActionStatus;
      const swipeCount = 1;

      // 関数を実行
      await act(async () => {
        await result.current.updateLinkAction(
          userId,
          linkId,
          status,
          swipeCount,
        );
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.updateLinkAction).toHaveBeenCalledWith(
        userId,
        linkId,
        status,
        swipeCount,
      );

      // キャッシュサービスが呼ばれたことを確認
      expect(linkCacheService.updateAfterLinkAction).toHaveBeenCalledWith(
        userId,
        mockMutate,
      );

      // 通知が表示されたことを確認
      expect(notificationService.success).toHaveBeenCalledWith(
        "リンクが更新されました",
        `ステータス: ${status}`,
        expect.any(Object),
      );
    });

    it("失敗時にエラー通知が表示されること", async () => {
      // 失敗レスポンスのモック
      (linkActionService.updateLinkAction as jest.Mock).mockResolvedValue({
        success: false,
        error: new Error("更新エラー"),
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // パラメータ
      const userId = "test-user-id";
      const linkId = "test-link-id";
      const status = "Read" as LinkActionStatus;

      // 関数を実行
      await act(async () => {
        await result.current.updateLinkAction(userId, linkId, status);
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.updateLinkAction).toHaveBeenCalledWith(
        userId,
        linkId,
        status,
        0,
      );

      // キャッシュサービスが呼ばれていないことを確認
      expect(linkCacheService.updateAfterLinkAction).not.toHaveBeenCalled();

      // エラー通知が表示されたことを確認
      expect(notificationService.error).toHaveBeenCalledWith(
        "リンクの更新に失敗しました",
        "更新エラー",
        expect.any(Object),
      );
    });
  });

  describe("deleteLinkAction", () => {
    it("成功時に通知とキャッシュ更新が行われること", async () => {
      // 成功レスポンスのモック
      (linkActionService.deleteLinkAction as jest.Mock).mockResolvedValue({
        success: true,
        error: null,
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // パラメータ
      const userId = "test-user-id";
      const linkId = "test-link-id";

      // 関数を実行
      await act(async () => {
        await result.current.deleteLinkAction(userId, linkId);
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.deleteLinkAction).toHaveBeenCalledWith(
        userId,
        linkId,
      );

      // キャッシュサービスが呼ばれたことを確認
      expect(linkCacheService.updateAfterLinkAction).toHaveBeenCalledWith(
        userId,
        mockMutate,
      );

      // 通知が表示されたことを確認
      expect(notificationService.success).toHaveBeenCalledWith(
        "リンクが削除されました",
        undefined,
        expect.any(Object),
      );
    });

    it("失敗時にエラー通知が表示されること", async () => {
      // 失敗レスポンスのモック
      (linkActionService.deleteLinkAction as jest.Mock).mockResolvedValue({
        success: false,
        error: new Error("削除エラー"),
      });

      // フックをレンダリング
      const { result } = renderHook(() => useLinkAction());

      // パラメータ
      const userId = "test-user-id";
      const linkId = "test-link-id";

      // 関数を実行
      await act(async () => {
        await result.current.deleteLinkAction(userId, linkId);
      });

      // サービスが呼ばれたことを確認
      expect(linkActionService.deleteLinkAction).toHaveBeenCalledWith(
        userId,
        linkId,
      );

      // キャッシュサービスが呼ばれていないことを確認
      expect(linkCacheService.updateAfterLinkAction).not.toHaveBeenCalled();

      // エラー通知が表示されたことを確認
      expect(notificationService.error).toHaveBeenCalledWith(
        "リンクの削除に失敗しました",
        "削除エラー",
        expect.any(Object),
      );
    });
  });
});
```

```

```
