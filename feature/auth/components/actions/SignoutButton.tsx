import { View } from "react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { ThemedText } from "@/components/text/ThemedText";
import { signout } from "../../service/authService";

export const SignoutButton = () => {
  return (
    <AlertButton onPress={() => signout()}>
      <View className="flex-row items-center justify-center gap-2">
        <ThemedText variant="body" weight="normal" color="white">
          {["Log out"]}
        </ThemedText>
        <LogoutIcon />
      </View>
    </AlertButton>
  );
};
