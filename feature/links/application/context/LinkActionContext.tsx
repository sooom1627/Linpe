import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { type Card } from "@/feature/links/domain/models/types";

// コンテキストの型定義
type LinkActionContextType = {
  selectedCard: Card | null;
  userId: string | null;
  setSelectedCard: (card: Card | null) => void;
  setUserId: (userId: string | null) => void;
};

// デフォルト値
const defaultContextValue: LinkActionContextType = {
  selectedCard: null,
  userId: null,
  setSelectedCard: () => {},
  setUserId: () => {},
};

// コンテキストの作成
const LinkActionContext =
  createContext<LinkActionContextType>(defaultContextValue);

// コンテキストプロバイダーコンポーネント
export const LinkActionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const value = {
    selectedCard,
    userId,
    setSelectedCard,
    setUserId,
  };

  return (
    <LinkActionContext.Provider value={value}>
      {children}
    </LinkActionContext.Provider>
  );
};

// カスタムフック
export const useLinkActionContext = () => {
  const context = useContext(LinkActionContext);
  if (context === undefined) {
    throw new Error(
      "useLinkActionContext must be used within a LinkActionProvider",
    );
  }
  return context;
};
