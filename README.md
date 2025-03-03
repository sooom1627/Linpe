# Linpe

A Modern Mobile Application Platform

## Tech Stack

- **Framework**:

  - [Expo](https://expo.dev) (v52)
  - [React Native](https://reactnative.dev) (v0.76)
  - [Expo Router](https://docs.expo.dev/router/introduction/) (v4)

- **Styling**:

  - [NativeWind](https://www.nativewind.dev/) (v4)
  - [TailwindCSS](https://tailwindcss.com) (v3)

- **Backend**:

  - [Supabase](https://supabase.com)

- **Testing**:
  - [Jest](https://jestjs.io)
  - [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/)

## Project Structure

```
├── app/                   # Main application code
├── assets/               # Static files (images, fonts)
├── components/           # Shared components
├── docs/                # Project documentation
├── feature/             # Feature modules
│   ├── auth/           # Authentication related
│   ├── links/          # Links management
│   │   ├── docs/       # Feature documentation
│   └── user/           # User management
├── lib/                 # Utility functions
└── supabase/           # Supabase configuration
```

## Documentation

プロジェクトのドキュメントは各機能ディレクトリの`docs`フォルダに配置されています。

主要なドキュメント：

- [SwipeScreen データ取得フロー](feature/links/docs/data-fetching.md) -
  SwipeScreenでのデータ取得の仕組みについて
- [テスト戦略](docs/testing.md) - プロジェクトのテスト戦略と実装方法について

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the application
   ```bash
   npx expo start
   ```

## Development Environment

You can run the application using any of the following methods:

- iOS Simulator
- Android Emulator
- Physical device (using Expo Go app)

## Testing

```bash
npm test                  # Run all tests in watch mode
npx jest path/to/test     # Run specific test file
npm test -- --coverage    # Generate coverage report
```

テストファイルは対象のコードと同じディレクトリ内の`__tests__`フォルダに配置されています。詳細なテスト戦略については[テスト戦略ドキュメント](docs/testing.md)を参照してください。

### テスト実装例

```typescript
// APIのテスト例
describe("linkApi", () => {
  it("正常にデータを取得できること", async () => {
    // テストコード
  });
});

// サービスのテスト例
describe("linkService", () => {
  it("正しいパラメータでAPIを呼び出すこと", async () => {
    // テストコード
  });
});
```

## License

Private
