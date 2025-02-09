import { Text } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { signout } from "../service/authService";

export const SignoutButton = () => {
  return (
    <PrimaryButton onPress={() => signout()}>
      <Text>Signout</Text>
    </PrimaryButton>
  );
};
