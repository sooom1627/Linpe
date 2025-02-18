import { View } from "react-native";

import { AlertButton } from "@/components/button/AlertButton";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { ThemedText } from "@/components/text/ThemedText";
import { signout } from "@/feature/auth/application/service/authService";

type Props = {
  onSignout?: () => void;
};

export const SignOutButton = ({ onSignout }: Props) => {
  const handleSignout = async () => {
    await signout();
    onSignout?.();
  };

  return (
    <AlertButton onPress={handleSignout} accessibilityLabel="Log out">
      <View className="flex-row items-center justify-center gap-2">
        <ThemedText
          text="Log out"
          variant="body"
          weight="normal"
          color="white"
        />
        <LogoutIcon />
      </View>
    </AlertButton>
  );
};
