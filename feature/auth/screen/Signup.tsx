import { useState } from "react";
import { Text } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { DefaultLink } from "@/components/link/DefaultLink";
import { AuthLayout } from "../components/AuthLayout";
import { EmailInput } from "../components/EmailInput";
import { PasswordInput } from "../components/PasswordInput";
import { signupWithEmail } from "../service/authService";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout title="Signup">
      <EmailInput email={email} setEmail={setEmail} />
      <PasswordInput password={password} setPassword={setPassword} />
      <PrimaryButton
        onPress={() => signupWithEmail(email, password, setLoading)}
        loading={loading}
      >
        <Text className="font-bold text-lg text-white">Signup</Text>
      </PrimaryButton>
      <DefaultLink href="/loginScreen">
        <Text className="font-bold text-lg text-blue-500">Login</Text>
      </DefaultLink>
    </AuthLayout>
  );
};
