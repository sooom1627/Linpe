import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useUserContext } from "@/feature/user/contexts/UserContext";
import { updateProfile } from "../service/userService";

export default function ProfileEditScreen() {
  const { user, refetch } = useUserContext();
  const { session } = useSessionContext();
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url ?? "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

        <View className="mt-8 flex flex-col justify-between gap-2">
          <PrimaryButton
            loading={isLoading}
            onPress={() => {
              updateProfile({
                username: username,
                avatar_url: avatarUrl,
                session: session ?? null,
                setLoading: (loading: boolean) => {
                  setIsLoading(loading);
                },
                refetch,
              });
            }}
          >
            <Text className="text-white">Update</Text>
          </PrimaryButton>
          <PrimaryButton onPress={() => {}}>
            <Text>Cancel</Text>
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}
