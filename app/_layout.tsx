// app/_layout.jsx
import { SafeAreaView, Text } from "react-native";
import { Slot } from "expo-router";

import "../assets/styles/global.css";

import { useAuthRedirect } from "@/feature/auth/hooks/useAuthRedirect";
import { useSession } from "@/feature/auth/hooks/useSession";

export default function RootLayout() {
  const { session } = useSession();
  useAuthRedirect(session);

  return (
    <SafeAreaView className="items-left justify-top flex-1 p-4">
      <Text>{session ? "ログイン済み" : "未ログイン"}</Text>
      <Slot />
    </SafeAreaView>
  );
}
