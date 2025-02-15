import { useState } from "react";
import { View } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { DefaultLink } from "@/components/link/DefaultLink";
import { ThemedText } from "@/components/text/ThemedText";
import { AuthLayout, EmailInput, PasswordInput } from "../components";
import { signupWithEmail } from "../service/authService";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout title="Signup">
      <EmailInput email={email} setEmail={setEmail} />
      <PasswordInput password={password} setPassword={setPassword} />
      <View className="flex-col items-center gap-2">
        <PrimaryButton
          onPress={() => signupWithEmail(email, password, setLoading)}
          loading={loading}
        >
          <ThemedText variant="h4" weight="semibold" color="white">
            {["Signup"]}
          </ThemedText>
        </PrimaryButton>
        <DefaultLink href="/loginScreen">
          <ThemedText variant="h4" weight="semibold" color="accent">
            {["Login"]}
          </ThemedText>
        </DefaultLink>
      </View>
    </AuthLayout>
  );
};
