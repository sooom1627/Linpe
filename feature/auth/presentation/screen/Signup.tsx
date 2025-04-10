import { useState } from "react";
import { View } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { DefaultLink } from "@/components/link/DefaultLink";
import { ThemedText } from "@/components/text/ThemedText";
import { signupWithEmail } from "@/feature/auth/application/service/authService";
import { AuthLayout, EmailInput, PasswordInput } from "../components";

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
          <ThemedText
            text="Signup"
            variant="h4"
            weight="semibold"
            color="white"
          />
        </PrimaryButton>
        <DefaultLink href="/loginScreen">
          <ThemedText
            text="Login"
            variant="h4"
            weight="semibold"
            color="accent"
          />
        </DefaultLink>
      </View>
    </AuthLayout>
  );
};
