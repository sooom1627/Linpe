import { Text, TextInput, View } from "react-native";

type EmailInputProps = {
  email: string;
  setEmail: (email: string) => void;
};

export const EmailInput = ({ email, setEmail }: EmailInputProps) => {
  return (
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
        accessibilityLabel="Email"
        accessibilityRole="text"
      />
    </View>
  );
};
