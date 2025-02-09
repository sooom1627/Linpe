import { ScrollView, Text, View } from "react-native";

import { SignoutButton } from "@/feature/auth/components/SignoutButton";

export default function Index() {
  return (
    <ScrollView className="flex-1">
      <View className="items-left flex justify-center p-4">
        <Text className="font-bold text-2xl">Hello World, Linpe</Text>
        <SignoutButton />
      </View>
    </ScrollView>
  );
}
