import { createContext, useContext, useState } from "react";

type ProfileEditModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const ProfileEditModalContext =
  createContext<ProfileEditModalContextType | null>(null);

export const useProfileEditModal = () => {
  const context = useContext(ProfileEditModalContext);
  if (!context) {
    throw new Error(
      "useProfileEditModal must be used within a ProfileEditModalProvider",
    );
  }
  return context;
};

export const ProfileEditModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ProfileEditModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ProfileEditModalContext.Provider>
  );
};
