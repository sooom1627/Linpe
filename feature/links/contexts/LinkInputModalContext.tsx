import { createContext, useContext, useState } from "react";

type LinkInputModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const LinkInputModalContext = createContext<
  LinkInputModalContextType | undefined
>(undefined);

export const LinkInputModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <LinkInputModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </LinkInputModalContext.Provider>
  );
};

export const useLinkInputModal = () => {
  const context = useContext(LinkInputModalContext);
  if (!context) {
    throw new Error(
      "useLinkInputModal must be used within a LinkInputModalProvider",
    );
  }
  return context;
};
