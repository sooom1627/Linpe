import { SlideModal } from "@/components/layout/SlideModal";
import { useProfileEditModal } from "../contexts/ProfileEditModalContext";
import ProfileEditScreen from "./ProfileEditScreen";

export const ProfileEditModal = () => {
  const { isOpen, closeModal } = useProfileEditModal();

  return (
    <SlideModal isOpen={isOpen} onClose={closeModal} title="Profile edit">
      <ProfileEditScreen />
    </SlideModal>
  );
};
