import { Text, View } from "react-native";

import { Login } from "@/fetaure/auth/screen/Login";

export default function Index() {
  return (
    <View className="items-left flex justify-center p-4">
      <Text className="text-2xl font-bold">Hello World, Linpe</Text>
      <Login />
    </View>
  );
}
