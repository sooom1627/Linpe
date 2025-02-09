import { SafeAreaView } from "react-native";
import { Slot } from "expo-router";

export default function AuthLayout() {
  return (
    <SafeAreaView className="items-left justify-top flex-1 p-4">
      <Slot />
    </SafeAreaView>
  );
}
