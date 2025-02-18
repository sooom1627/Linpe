import { TextInput, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

type PasswordInputProps = {
  password: string;
  setPassword: (password: string) => void;
};

export const PasswordInput = ({
  password,
  setPassword,
}: PasswordInputProps) => {
  return (
    <View className="flex flex-col gap-2">
      <ThemedText
        text="Password"
        variant="body"
        weight="normal"
        color="muted"
      />
      <TextInput
        className="rounded-md border border-gray-300 p-2"
        autoCapitalize="none"
        textContentType="password"
        keyboardType="ascii-capable"
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Password"
        accessibilityRole="text"
        secureTextEntry
      />
    </View>
  );
};
