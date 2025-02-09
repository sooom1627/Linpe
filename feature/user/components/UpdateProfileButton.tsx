import { useState } from "react";
import { Text } from "react-native";
import Toast from "react-native-toast-message";
import { type Session } from "@supabase/supabase-js";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { updateProfile } from "../service/userService";

interface UpdateProfileButtonProps {
  username: string;
  avatarUrl: string;
  session: Session | null;
  refetch: () => Promise<void>;
}

export const UpdateProfileButton = ({
  username,
  avatarUrl,
  session,
  refetch,
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
      refetch,
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
      <Text className="font-bold text-white">Update</Text>
    </PrimaryButton>
  );
};
