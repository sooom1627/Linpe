import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useUserContext } from "@/feature/user/contexts/UserContext";
import { useProfileEditModal } from "../contexts/ProfileEditModalContext";
import { updateProfile } from "../service/userService";

export default function ProfileEditScreen() {
  const { user, refetch } = useUserContext();
  const { session } = useSessionContext();
  const { closeModal } = useProfileEditModal();
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url ?? "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpdateProfile = () => {
    updateProfile({
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
    <View className="flex-1 bg-white p-4">
      <View className="space-y-4">
        <View>
          <Text className="mb-1 text-sm text-gray-700">Username</Text>
          <TextInput
            className="rounded-lg border border-gray-300 p-3"
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
            }}
          />
        </View>

        <View>
          <Text className="mb-1 text-sm text-gray-700">Avatar URL</Text>
          <TextInput
            className="rounded-lg border border-gray-300 p-3"
            placeholder="Avatar URL"
            value={avatarUrl}
            onChangeText={(text) => {
              setAvatarUrl(text);
            }}
          />
        </View>

        <View className="mt-8 flex flex-col items-center justify-between gap-2">
          <PrimaryButton loading={isLoading} onPress={handleUpdateProfile}>
            <Text className="font-bold text-white">Update</Text>
          </PrimaryButton>
          <TouchableOpacity
            onPress={() => {
              closeModal();
            }}
          >
            <Text className="underline">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
