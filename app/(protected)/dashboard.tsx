import { ScrollView, Text, View } from "react-native";

export default function Dashboard() {
  return (
    <ScrollView className="flex-1">
      <View className="flex items-center justify-center gap-10 py-5">
        <Text>Dashboard</Text>
      </View>
    </ScrollView>
  );
}
