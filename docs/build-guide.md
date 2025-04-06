# Linpeアプリのビルドガイド

このガイドでは、Expoのmanaged
workflowを使用してLinpeアプリをビルドする手順を説明します。

## 前提条件

- Expo CLIがインストールされていること
- EAS CLIがインストールされていること
- npmがインストールされていること
- Expo/EASアカウントを持っていること

## ビルド前の準備

### 1. パッケージの更新

最新のパッケージをインストールするには、以下のコマンドを実行します：

```bash
npx expo install --check
```

### 2. 非推奨パッケージの削除

`expo-permissions`は非推奨のため、削除しました。代わりに各モジュールの権限APIを直接使用します：

```bash
npm uninstall expo-permissions
```

例：

- `MediaLibrary.requestPermissionsAsync()` を使用
- `Camera.requestPermissionsAsync()` を使用

### 3. app.config.jsの設定

`app.config.js`には以下の設定があります：

- 環境変数の読み込み（.env.developmentまたは.env.production）
- iOS用のbundleIdentifier: "com.linpe.app"
- Android用のpackage: "com.linpe.app"
- Supabase接続情報

## ビルド手順

### 1. ネイティブコードの生成

ビルド前にネイティブコードを生成します：

```bash
npx expo prebuild --clean
```

### 2. EAS設定の確認

EASの設定を確認し、必要に応じて構成します：

```bash
npx eas-cli diagnostics        # 診断を実行
npx eas-cli build:configure    # iOSとAndroid向けに設定
```

### 3. ビルドの実行

#### 開発用ビルド（内部配布用）

```bash
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```

#### プレビュービルド（内部テスト用）

```bash
npx eas build --profile preview --platform ios
npx eas build --profile preview --platform android
```

#### 本番用ビルド

```bash
npx eas build --profile production --platform ios
npx eas build --profile production --platform android
```

## Apple Developer Programへの加入と設定

### 1. Apple Developer Programへの加入

iOS向けのビルドやApp Storeへの配信には、Apple Developer
Program（年間$99）への加入が必要です。

1. [Apple Developer Program](https://developer.apple.com/programs/)にアクセス
2. 「Enroll」をクリックして登録プロセスを開始
3. 必要な情報を入力し、支払いを完了

### 2. 各種証明書とプロファイルの設定

Apple Developer Programに加入後、以下の手続きが必要です：

#### 2.1. App ID（Bundle Identifier）の登録

1. [Apple Developer Portal](https://developer.apple.com/account/)にアクセス
2. 「Certificates, IDs & Profiles」セクションに移動
3. 「Identifiers」を選択し、「+」ボタンをクリック
4. 「App IDs」を選択し、アプリ情報を入力
5. Bundle Identifier（例: com.linpe.app）を指定

#### 2.2. デバイスの登録（開発用）

1. 「Devices」セクションに移動
2. 「+」ボタンをクリックし、UDIDを登録

#### 2.3. プロビジョニングプロファイルの作成

1. 「Profiles」セクションに移動
2. 「+」ボタンをクリック
3. 用途に応じたプロファイルを選択
   - Development: 開発用
   - Ad Hoc: 内部テスト用
   - App Store: 配布用

### 3. EASでのAppleアカウント連携

EASを使用してビルドする場合、Appleアカウントと連携すると証明書やプロファイルの管理が自動化されます：

```bash
# EASにログイン
npx eas-cli login

# ビルド時にAppleアカウント連携
npx eas build --profile development --platform ios
# プロンプトでApple IDとパスワードを入力
```

### 4. TestFlightでの内部テスト配布

ビルド完了後、TestFlightを通じてアプリを内部テスターに配布できます：

1. App Store Connectにログイン
2. TestFlightセクションに移動
3. ビルドがアップロードされたら「内部テスト」を設定
4. テスターを招待

### 5. App Storeへの公開準備

本番用ビルドをApp Storeに公開するための手順：

1. App Store Connectでアプリ情報を入力
   - アプリ名、説明、スクリーンショット、プライバシーポリシーなど
2. 審査に必要な情報を準備
3. EASを使用してビルドをアップロード

```bash
# 本番用ビルドの作成とアップロード
npx eas build --profile production --platform ios

# または、ビルド後に明示的にアップロード
npx eas submit --platform ios
```

## 環境変数の管理

プロジェクトでは以下の環境変数ファイルを使用しています：

- `.env.development` - 開発環境用の環境変数
- `.env.production` - 本番環境用の環境変数

これらのファイルは`.gitignore`で管理されており、リポジトリにはコミットされません。

必要な環境変数：

- `SUPABASE_URL` - SupabaseのURL
- `SUPABASE_ANON_KEY` - Supabaseの匿名キー

## EAS設定（eas.json）

`eas.json`ファイルには以下のビルドプロファイルが定義されています：

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "production"
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

## トラブルシューティング

### ビルドエラーが発生した場合

1. `npx eas-cli diagnostics`を実行して環境に問題がないか確認
2. `npx expo doctor`を実行して依存関係に問題がないか確認
3. パッケージの更新が必要であれば`npx expo install --check`を実行

### 環境変数の問題

環境変数が正しく読み込まれない場合は、以下を確認してください：

1. `.env.development`または`.env.production`ファイルが存在するか
2. ファイル内の環境変数が正しく設定されているか
3. `app.config.js`の環境変数読み込み部分に問題がないか

## Apple Developer Programなしで実機テストを行う方法

Apple Developer Programに加入せずに限定的な実機テストを行う方法もあります：

### Xcodeを使用したローカルビルド

```bash
# ネイティブコードを生成
npx expo prebuild --platform ios

# Xcodeで開く
open ios/Linpe.xcworkspace
```

Xcodeで個人のApple
ID（無料）を使用して署名し、自分のデバイスにインストールできます。ただし、7日間の有効期限があり、自分のデバイスにのみインストール可能です。

## 参考リンク

- [Expo公式ドキュメント](https://docs.expo.dev/)
- [EASビルドドキュメント](https://docs.expo.dev/build/introduction/)
- [Expo Router ドキュメント](https://docs.expo.dev/router/introduction/)
- [Apple Developer Program](https://developer.apple.com/programs/)
