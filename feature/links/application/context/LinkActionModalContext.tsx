import { createContext, useContext, useState } from "react";

import { type Card } from "@/feature/links/domain/models/types";

type LinkActionModalContextType = {
  isOpen: boolean;
  selectedCard: Card | null;
  openModal: (card: Card) => void;
  closeModal: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
};

const LinkActionModalContext = createContext<
  LinkActionModalContextType | undefined
>(undefined);

export const LinkActionModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const openModal = (card: Card) => {
    setSelectedCard(card);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCard(null);
  };

  const handleMarkAsRead = () => {
    if (selectedCard) {
      console.log("Mark as read:", selectedCard.full_url);
      closeModal();
    }
  };

  const handleDelete = () => {
    if (selectedCard) {
      console.log("Delete:", selectedCard.full_url);
      closeModal();
    }
  };

  return (
    <LinkActionModalContext.Provider
      value={{
        isOpen,
        selectedCard,
        openModal,
        closeModal,
        onMarkAsRead: handleMarkAsRead,
        onDelete: handleDelete,
      }}
    >
      {children}
    </LinkActionModalContext.Provider>
  );
};

export const useLinkActionModal = () => {
  const context = useContext(LinkActionModalContext);
  if (!context) {
    throw new Error(
      "useLinkActionModal must be used within a LinkActionModalProvider",
    );
  }
  return context;
};
