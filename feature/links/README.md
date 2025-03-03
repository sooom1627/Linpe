# Links 機能

## 概要

Links機能は、ユーザーがウェブリンクを保存、整理、閲覧するための機能です。ユーザーはリンクをスワイプして分類したり、後で読むためにスケジュールしたりすることができます。

## 主要な機能

- リンクの保存と管理
- スワイプによるリンクの分類
- リンクの閲覧とステータス管理
- リンクのスケジュール設定

## ディレクトリ構造

```
feature/links/
├── application/         # アプリケーションロジック
│   ├── contexts/        # Reactコンテキスト
│   ├── hooks/           # カスタムフック
│   └── service/         # サービス層
├── domain/              # ドメインモデル
│   └── models/          # データモデル
├── docs/                # ドキュメント
│   └── data-fetching.md # データ取得フロー
├── infrastructure/      # インフラストラクチャ
│   ├── api/             # API通信
│   └── utils/           # ユーティリティ
└── presentation/        # プレゼンテーション
    ├── components/      # コンポーネント
    ├── interactions/    # インタラクション
    ├── screens/         # 画面
    └── views/           # ビュー
```

## ドキュメント

- [SwipeScreen データ取得フロー](docs/data-fetching.md) - SwipeScreenでのデータ取得の仕組みについて 