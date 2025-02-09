import { Text, View } from "react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { signout } from "../service/authService";

export const SignoutButton = () => {
  return (
    <AlertButton onPress={() => signout()}>
      <View className="flex-row items-center justify-center gap-2">
        <Text className="text-base text-white">Log out</Text>
        <LogoutIcon />
      </View>
    </AlertButton>
  );
};
