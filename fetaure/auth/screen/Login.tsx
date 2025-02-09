import { Text, TextInput, TouchableOpacity, View } from "react-native";

export const Login = () => {
  return (
    <View className="flex flex-col gap-4">
      <Text className="text-2xl font-bold">Login</Text>
      <View className="flex flex-col gap-2">
        <Text className="text-lg font-bold">Email</Text>
        <TextInput className="rounded-md border border-gray-300 p-2" />
      </View>
      <View className="flex flex-col gap-2">
        <Text className="text-lg font-bold">Password</Text>
        <TextInput className="rounded-md border border-gray-300 p-2" />
      </View>
      <TouchableOpacity className="items-center rounded-md bg-blue-500 p-2">
        <Text className="text-lg font-bold text-white">Login</Text>
      </TouchableOpacity>
    </View>
  );
};
