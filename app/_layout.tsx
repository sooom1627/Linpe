// app/_layout.jsx
import { SafeAreaView } from "react-native";
import { Slot } from "expo-router";

import "../assets/styles/global.css";

import { AuthRedirectGuard } from "@/feature/auth/components/AuthRedirectGuard";
import { SessionProvider } from "@/feature/auth/contexts/SessionContext";

export default function RootLayout() {
  return (
    <SessionProvider>
      <AuthRedirectGuard>
        <SafeAreaView className="items-left justify-top flex-1 p-4">
          <Slot />
        </SafeAreaView>
      </AuthRedirectGuard>
    </SessionProvider>
  );
}
