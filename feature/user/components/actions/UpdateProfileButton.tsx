import { useState } from "react";
import { type Session } from "@supabase/supabase-js";
import { type KeyedMutator } from "swr";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { ThemedText } from "@/components/text/ThemedText";
import { notificationService } from "@/lib/notification";
import { updateProfile } from "../../service/userService";
import { type User } from "../../types/user";

interface UpdateProfileButtonProps {
  username: string;
  avatarUrl: string;
  session: Session | null;
  mutate: KeyedMutator<User | null>;
}

export const UpdateProfileButton = ({
  username,
  avatarUrl,
  session,
  mutate,
}: UpdateProfileButtonProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!session) {
      notificationService.error("ログインが必要です");
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile({
        username,
        avatar_url: avatarUrl,
        session,
        setLoading: setIsLoading,
        mutate,
      });
      notificationService.success("プロフィールを更新しました");
    } catch (error) {
      notificationService.error(
        "プロフィールの更新に失敗しました",
        notificationService.getErrorMessage(error),
      );
    }
  };

  return (
    <PrimaryButton loading={isLoading} onPress={handleUpdateProfile}>
      <ThemedText text="Update" variant="body" weight="normal" color="white" />
    </PrimaryButton>
  );
};
