import { Text, View } from "react-native";

import { Login } from "@/fetaure/auth/screen/Login";
import { Signup } from "@/fetaure/auth/screen/Signup";

export default function Index() {
  return (
    <View className="items-left flex justify-center p-4">
      <Text className="text-2xl font-bold">Hello World, Linpe</Text>
      <Login />
      <Signup />
    </View>
  );
}
