# テストヘルパー

このディレクトリには、テスト実行に必要な共通のヘルパー関数とモック定義が含まれています。

## ファイル構造

```
app/__tests__/helpers/
└── setup.ts  # 共通のモック設定とヘルパー関数
```

## setup.ts

`setup.ts`
ファイルは、テスト全体で使用される共通のモックとヘルパー関数を提供します。

### 主な機能

#### ルーターモック

Expo
Routerの主要なフックをモックし、テスト内でのナビゲーション操作をシミュレートします。

```typescript
// ルーターモックの例
const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
  canGoBack: () => true,
};
```

#### セグメントモック

`useSegments` フックの戻り値をモックし、現在のルートパスをシミュレートします。

```typescript
// セグメントモックの例
const mockSegments = {
  segments: [],
  isReady: true,
  getSegments: function () {
    return this.segments;
  },
  getPathname: function () {
    return this.segments.join("/");
  },
  [Symbol.iterator]: function* () {
    yield* this.segments;
  },
};
```

#### セッションモック

認証セッションをモックし、認証状態のテストを可能にします。

```typescript
// セッションモックの例
export const createMockSession = (): Session => ({
  user: {
    id: "test-user",
    // その他のユーザー情報
  },
  access_token: "test-token",
  refresh_token: "test-refresh-token",
  // その他のセッション情報
});
```

### 使用方法

テストファイル内で以下のようにインポートして使用します：

```typescript
import {
  createMockRouter,
  createMockSession,
  getMockSegments,
} from "../helpers/setup";

// モックの取得
const mockRouter = createMockRouter();
const mockSession = createMockSession();
const mockSegments = getMockSegments();

// テスト内でのモックの使用例
beforeEach(() => {
  // セグメントの設定
  mockSegments.segments = ["(protected)", "index"];

  // モックのリセット
  jest.clearAllMocks();
});
```

## ベストプラクティス

1. **モックの再利用**

   - 共通のモックは `setup.ts` に定義し、テスト間で再利用する
   - テスト固有のモックは、テストファイル内で定義する

2. **モックのリセット**

   - 各テストの前に `jest.clearAllMocks()`
     を呼び出し、モックの状態をリセットする
   - テスト間の干渉を防ぐため、`beforeEach` 内でモックの状態を初期化する

3. **型安全性の確保**

   - モックオブジェクトには適切な型定義を提供し、型エラーを防ぐ
   - 実際のオブジェクトと互換性のある型を使用する

4. **モックの拡張**
   - 新しいモックが必要な場合は、`setup.ts`
     に追加し、他のテストでも再利用できるようにする
   - 複雑なモックは、ファクトリ関数として実装し、カスタマイズ可能にする
