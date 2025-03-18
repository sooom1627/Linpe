# リンクステータスと遷移条件

このドキュメントでは、Linpe アプリケーションにおけるリンクのステータスと、それらの間の遷移条件について説明します。

## リンクステータスの概要

リンクは以下の8つのステータスを持ちます：

| ステータス  | 説明                                                                 |
| ----------- | -------------------------------------------------------------------- |
| `add`       | 新しく追加されたリンク。初期状態。                                   |
| `Today`     | 今日読む予定のリンク。                                               |
| `inWeekend` | 週末に読む予定のリンク。次の日曜日がスケジュールされる。             |
| `Reading`   | 現在読んでいるリンク。読了時間は記録されない。                       |
| `Read`      | 読了したリンク。読了時間が記録される。                               |
| `Re-Read`   | 再読するリンク。読了時間が記録される。                               |
| `Bookmark`  | ブックマークされたリンク。いつでも参照できるよう保存されている。     |
| `Skip`      | スキップされたリンク。あまり重要でないか、後で改めて検討するリンク。 |

## ステータス遷移図

以下の図は、リンクステータス間の可能な遷移を示しています：

```mermaid
stateDiagram-v2
    [*] --> add: リンク追加

    add --> Today: 左スワイプ
    add --> inWeekend: 右スワイプ
    add --> Skip: 下スワイプ

    Today --> Reading: タップして閲覧開始
    Today --> inWeekend: 手動更新/再スケジュール
    Today --> Skip: 下スワイプ

    inWeekend --> Today: 左スワイプ
    inWeekend --> Skip: 下スワイプ
    inWeekend --> Reading: タップして閲覧開始

    Reading --> Read: 閲覧完了
    Reading --> Bookmark: 重要なコンテンツ

    Read --> Re-Read: 再読決定
    Read --> Bookmark: 保存決定

    Re-Read --> Read: 再読完了
    Re-Read --> Today: 今日読む予定に変更
    Re-Read --> inWeekend: 週末に再度読む

    Bookmark --> Read: 既読に変更
    Bookmark --> Today: 今日読む予定に変更

    Skip --> Today: 今日読む予定に変更
    Skip --> inWeekend: 週末に読む予定に変更

    %% どのステータスからも削除可能
    add --> [*]: 削除
    Today --> [*]: 削除
    inWeekend --> [*]: 削除
    Reading --> [*]: 削除
    Read --> [*]: 削除
    Re-Read --> [*]: 削除
    Bookmark --> [*]: 削除
    Skip --> [*]: 削除
```

## スワイプ操作によるステータス遷移

Linpeアプリケーションでは、スワイプ操作によるリンクステータスの変更が主要な機能です。現在の実装では以下のスワイプ操作が定義されています：

| スワイプ方向 | 遷移先ステータス | 適用可能な元ステータス      |
| ------------ | ---------------- | --------------------------- |
| 左スワイプ   | `Today`          | `add`, `inWeekend`, `Skip`  |
| 右スワイプ   | `inWeekend`      | `add`, `Today`, `Skip`      |
| 下スワイプ   | `Skip`           | `add`, `Today`, `inWeekend` |

**注意**: 上スワイプのアクションは現在明示的に定義されていません。また、`Read`,
`Reading`, `Re-Read`, `Bookmark`
ステータスに対するスワイプ操作は実装されていません。

## 読書状態に基づくステータス遷移

読書状態に基づくステータス遷移は、主にユーザーのタップ操作によって行われます：

| 操作         | 遷移先ステータス | メタデータの変更                                      |
| ------------ | ---------------- | ----------------------------------------------------- |
| 読了マーク   | `Read`           | `read_at` = 現在時刻, `scheduled_read_at` = undefined |
| 読書開始     | `Reading`        | `read_at` = null, `scheduled_read_at` = null          |
| 再読マーク   | `Re-Read`        | `read_at` = 現在時刻, `scheduled_read_at` = 計算値    |
| ブックマーク | `Bookmark`       | `read_at` = 現在時刻, `scheduled_read_at` = 計算値    |

## スケジュール日時の計算

ステータスに応じて、`scheduled_read_at` は以下のように設定されます：

- `Today`: 当日の0時0分0秒
- `inWeekend`: 次の日曜日の0時0分0秒（現在が土曜日または日曜日の場合は翌週の日曜日）
- `Skip`: null
- `Read`: undefined（更新されない）
- その他のステータス: 当日の0時0分0秒

## 現在の実装での制限と課題

現在の実装では、以下の制限や課題があります：

1. **スワイプ操作の範囲制限**:

   - スワイプ操作は `add`, `Today`, `inWeekend`, `Skip`
     ステータスに限定されている
   - 上スワイプのアクションが明示的に定義されていない

2. **ステータス遷移の不完全な定義**:

   - `Reading` から自動的に `Read` へ遷移するメカニズムがない
   - `Bookmark` から他のステータスへの明示的な遷移パスが不足

3. **メタデータの限定的な活用**:

   - `swipe_count` や `read_count`
     は記録されているが、これらを活用した機能が限定的

4. **ステータス間の遷移の一貫性**:
   - 同じスワイプ操作でも、元のステータスによって異なる結果になることがある

## 改善提案

1. **スワイプ操作の拡張**:

   - 上スワイプに明示的なアクションを割り当てる（例：`Bookmark`へ変更）
   - すべてのステータスに対してスワイプ操作を一貫して定義する

2. **ステータス遷移の完全なカバレッジ**:

   - すべてのステータス間の合理的な遷移パスを定義する
   - 特に `Reading` → `Read` の自動遷移を検討する

3. **メタデータの活用**:

   - `swipe_count` や `read_count` を利用した推奨機能の追加
   - 読書パターンの分析と可視化

4. **遷移の一貫性向上**:
   - スワイプ方向とステータス変更の関連付けを一貫させる
   - 直感的でわかりやすいユーザーインターフェースの確保

## 参照

- [Domain Models](../domain/models/types/links.ts)
- [Link Action Service](../application/service/linkActionService.ts)
- [Use Link Action Hook](../application/hooks/link/useLinkAction.ts)
- [Scheduled Date Utils](../infrastructure/utils/scheduledDateUtils.ts)
