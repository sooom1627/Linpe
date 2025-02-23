import { createContext, useContext, useRef } from "react";
import { type BottomSheetModal } from "@gorhom/bottom-sheet";

type LinkInputModalContextType = {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
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
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openModal = () => {
    bottomSheetRef.current?.present();
  };

  const closeModal = () => {
    bottomSheetRef.current?.dismiss();
  };

  return (
    <LinkInputModalContext.Provider
      value={{ bottomSheetRef, openModal, closeModal }}
    >
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
