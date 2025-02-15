import { useState } from "react";
import { View } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { DefaultLink } from "@/components/link/DefaultLink";
import { ThemedText } from "@/components/text/ThemedText";
import { AuthLayout, EmailInput, PasswordInput } from "../components";
import { loginWithEmail } from "../service/authService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout title="Login">
      <EmailInput email={email} setEmail={setEmail} />
      <PasswordInput password={password} setPassword={setPassword} />
      <View className="flex-col items-center gap-2">
        <PrimaryButton
          onPress={() => loginWithEmail(email, password, setLoading)}
          loading={loading}
          testID="login-button"
        >
          <ThemedText variant="h4" weight="semibold" color="white">
            {["Login"]}
          </ThemedText>
        </PrimaryButton>
        <DefaultLink href="/signupScreen">
          <ThemedText variant="h4" weight="semibold" color="accent">
            {["Signup"]}
          </ThemedText>
        </DefaultLink>
      </View>
    </AuthLayout>
  );
};
