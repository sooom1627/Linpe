# Linpeプロジェクト状況

このドキュメントは、プロジェクトの現在の状態と設定に関する情報を提供します。

## 最終更新日

2023年4月6日

## 現在のバージョン

- プロジェクトバージョン: 1.0.0
- アプリバージョン: 0.0.1

## 依存関係のステータス

| パッケージ                                | バージョン | 状態 |
| ----------------------------------------- | ---------- | ---- |
| expo                                      | ~52.0.42   | 最新 |
| react-native                              | 0.76.9     | 最新 |
| expo-router                               | ~4.0.20    | 最新 |
| @react-native-async-storage/async-storage | 1.23.1     | 最新 |

## 設定の変更履歴

### 2025年4月6日

- 非推奨パッケージ（expo-permissions）を削除
- app.config.jsにAndroidのpackage名を追加
- パッケージを最新バージョンに更新
- ビルドドキュメント作成

## 環境構成

### 開発環境

- 環境変数: `.env.development`
- ビルドプロファイル: `development`（eas.json）

### 本番環境

- 環境変数: `.env.production`
- ビルドプロファイル: `production`（eas.json）

## 次のステップ

- [ ] iOS App Storeへの申請準備
- [ ] Google Play Storeへの申請準備
- [ ] CI/CDパイプラインの設定
- [ ] 自動テストの拡充

## 既知の問題

1. lint-stagedスクリプトの競合警告（npm run lint-staged）
2. 一部のパッケージがReact Native Directoryのメタデータと照合できない：
   - aes-js
   - link-preview-js
   - swr
   - tailwindcss
3. lucide-react-nativeパッケージが新アーキテクチャでテストされていない

## 対処済みの問題

- ✅ 非推奨パッケージ（expo-permissions）の削除
- ✅ パッケージバージョンの更新
- ✅ Androidパッケージ名の設定
