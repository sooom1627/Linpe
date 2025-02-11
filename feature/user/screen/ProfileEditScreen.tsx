import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useUserContext } from "@/feature/user/contexts/UserContext";
import { AvatarPicker } from "../components/AvatarPicker";
import { UpdateProfileButton } from "../components/UpdateProfileButton";
import { useProfileEditModal } from "../contexts/ProfileEditModalContext";

export default function ProfileEditScreen() {
  const { user, refetch } = useUserContext();
  const { session } = useSessionContext();
  const { closeModal } = useProfileEditModal();
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url ?? "");

  return (
    <View className="flex-1 bg-white p-4">
      <View className="space-y-4">
        <View className="flex flex-row items-center justify-center">
          <AvatarPicker
            url={avatarUrl}
            username={username}
            session={session}
            refetch={refetch}
            onUpload={(url: string) => {
              setAvatarUrl(url);
            }}
          />
        </View>
        <View>
          <ThemedText variant="caption" weight="semibold" color="muted">
            {["Username"]}
          </ThemedText>
          <TextInput
            className="rounded-lg border border-gray-300 p-3"
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
            }}
          />
        </View>
        <View className="mt-8 flex flex-col items-center justify-between gap-2">
          <UpdateProfileButton
            username={username}
            avatarUrl={avatarUrl}
            session={session}
            refetch={refetch}
          />
          <TouchableOpacity
            onPress={() => {
              closeModal();
            }}
          >
            <ThemedText
              variant="body"
              weight="semibold"
              color="muted"
              underline
            >
              {["Cancel"]}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
