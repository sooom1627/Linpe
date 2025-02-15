import { useState } from "react";
import Toast from "react-native-toast-message";
import { type Session } from "@supabase/supabase-js";
import { type KeyedMutator } from "swr";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { ThemedText } from "@/components/text/ThemedText";
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
    await updateProfile({
      username: username,
      avatar_url: avatarUrl,
      session: session ?? null,
      setLoading: (loading: boolean) => {
        setIsLoading(loading);
      },
      mutate,
    });
    Toast.show({
      type: "success",
      text1: "プロフィールを更新しました",
      position: "top",
      topOffset: 20,
      visibilityTime: 3000,
    });
  };

  return (
    <PrimaryButton loading={isLoading} onPress={handleUpdateProfile}>
      <ThemedText variant="body" weight="normal" color="white">
        {["Update"]}
      </ThemedText>
    </PrimaryButton>
  );
};
