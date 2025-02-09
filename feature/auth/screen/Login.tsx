import { useState } from "react";
import { Text } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { DefaultLink } from "@/components/link/DefaultLink";
import { AuthLayout } from "../components/AuthLayout";
import { EmailInput } from "../components/EmailInput";
import { PasswordInput } from "../components/PasswordInput";
import { loginWithEmail } from "../service/authService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout title="Login">
      <EmailInput email={email} setEmail={setEmail} />
      <PasswordInput password={password} setPassword={setPassword} />
      <PrimaryButton
        onPress={() => loginWithEmail(email, password, setLoading)}
        loading={loading}
        testID="login-button"
      >
        <Text className="font-bold text-lg text-white">Login</Text>
      </PrimaryButton>
      <DefaultLink href="/signupScreen">
        <Text className="font-bold text-lg text-blue-500">Signup</Text>
      </DefaultLink>
    </AuthLayout>
  );
};
