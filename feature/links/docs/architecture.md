# Links Feature Architecture

This document describes the architecture of the Links feature using Mermaid
diagrams.

## Component Architecture

```mermaid
graph TD
    %% Layers
    subgraph Presentation
        LinkInputView
        SwipeScreen
        LinksTopView
        LinksFlatList
        FeaturedList
        LinkPreview
    end

    subgraph Application
        LinkInputModalContext
        useLinkInput
        useLinks
        useWebBrowser
        useLinkAction
    end

    subgraph Domain
        Card
        Link
        LinkInsert
        LinkRow
        IWebBrowserService
    end

    subgraph Infrastructure
        WebBrowserService
        LinkActionsApi
        LinkApi
        OGApi
    end

    %% Relationships
    LinkInputView --> useLinkInput
    LinkInputView --> LinkPreview
    SwipeScreen --> useLinkAction
    LinksTopView --> useLinks
    LinksFlatList --> Card
    FeaturedList --> Card

    useLinkInput --> LinkApi
    useLinkInput --> OGApi
    useLinks --> LinkApi
    useLinkAction --> LinkActionsApi
    useWebBrowser --> WebBrowserService

    WebBrowserService -.implements.-> IWebBrowserService
    Link -.extends.-> LinkRow
    Card -.uses.-> Link

    %% Services
    LinkApi --> LinkInsert
    LinkActionsApi --> LinkRow
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as Presentation Layer
    participant Hook as Application Hooks
    participant Service as Application Services
    participant API as Infrastructure API
    participant DB as Database

    User->>UI: リンクを入力
    UI->>Hook: useLinkInput
    Hook->>Service: LinkService
    Service->>API: LinkApi
    API->>DB: リンク保存

    User->>UI: スワイプアクション
    UI->>Hook: useLinkAction
    Hook->>Service: LinkActionService
    Service->>API: LinkActionsApi
    API->>DB: アクション更新

    User->>UI: ブラウザで開く
    UI->>Hook: useWebBrowser
    Hook->>Service: WebBrowserService
    Service-->>User: ブラウザ表示
```

## Architecture Overview

1. **レイヤー構造**:

   - Presentation: UIコンポーネント（View, Screen, Components）
   - Application: ビジネスロジック（Hooks, Services）
   - Domain: ドメインモデルと型定義
   - Infrastructure: 外部サービスとの連携（API）

2. **主要な機能フロー**:

   - リンク入力と保存
   - リンクのスワイプアクション
   - ブラウザでのリンク表示
   - OGデータの取得と表示

3. **データの流れ**:
   - ユーザーアクション → Hooks → Services → API → データベース
   - データベース → API → Services → Hooks → UI表示
