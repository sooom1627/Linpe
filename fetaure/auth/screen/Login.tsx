import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

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
      <TouchableOpacity
        className={`items-center rounded-md p-2 ${
          loading ? "bg-gray-500" : "bg-blue-500"
        }`}
        disabled={loading}
        onPress={() => loginWithEmail(email, password, setLoading)}
      >
        <Text className="text-lg font-bold text-white">Login</Text>
      </TouchableOpacity>
    </View>
  );
};
