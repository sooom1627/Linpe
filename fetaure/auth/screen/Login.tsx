import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { DefaultLink } from "@/components/link/DefaultLink";
import { loginWithEmail } from "../service/authService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View className="flex flex-col gap-4">
      <Text className="text-2xl font-bold">Login</Text>
      <View className="flex flex-col gap-2">
        <Text className="text-lg font-bold">Email</Text>
        <TextInput
          className="rounded-md border border-gray-300 p-2"
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View className="flex flex-col gap-2">
        <Text className="text-lg font-bold">Password</Text>
        <TextInput
          className="rounded-md border border-gray-300 p-2"
          autoCapitalize="none"
          textContentType="password"
          keyboardType="ascii-capable"
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <PrimaryButton
        onPress={() => loginWithEmail(email, password, setLoading)}
        loading={loading}
      >
        <Text className="text-lg font-bold text-white">Login</Text>
      </PrimaryButton>
      <DefaultLink onPress={() => {}}>
        <Text className="text-lg font-bold text-blue-500">Signup</Text>
      </DefaultLink>
    </View>
  );
};
