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

- [SwipeScreen データ取得フロー](feature/links/docs/data-fetching.md) - SwipeScreenでのデータ取得の仕組みについて

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
npm test          # Run tests
npm run lint      # Run linting
npm run typecheck # Run type checking
```

## License

Private