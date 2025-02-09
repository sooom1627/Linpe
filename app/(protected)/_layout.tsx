// app/(protected)/_layout.tsx
import { ActivityIndicator, View } from "react-native";
import { Slot } from "expo-router";

import { Header } from "@/components/layout/Header";
import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useAuthRedirect } from "@/feature/auth/hooks/useAuthRedirect";
import { UserProvider } from "@/feature/user/contexts/UserContext";

export default function ProtectedLayout() {
  const { session } = useSessionContext();
  useAuthRedirect(session);

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserProvider>
      <View className="flex-1">
        <Header />
        <Slot />
      </View>
    </UserProvider>
  );
}
