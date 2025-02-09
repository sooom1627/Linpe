import { Text, TextInput, View } from "react-native";

import { PrimaryButton } from "@/components/button/PrimaryButton";
import { DefaultLink } from "@/components/link/DefaultLink";

export const Signup = () => {
  return (
    <View className="flex flex-col gap-4">
      <Text className="text-2xl font-bold">Signup</Text>
      <View className="flex flex-col gap-2">
        <Text className="text-lg font-bold">Email</Text>
        <TextInput
          className="rounded-md border border-gray-300 p-2"
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address"
          autoComplete="email"
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
        />
      </View>
      <PrimaryButton onPress={() => {}}>
        <Text className="text-lg font-bold text-white">Signup</Text>
      </PrimaryButton>
      <DefaultLink onPress={() => {}}>
        <Text className="text-lg font-bold text-blue-500">Login</Text>
      </DefaultLink>
    </View>
  );
};
