// app/(protected)/_layout.tsx
import { ActivityIndicator, View } from "react-native";
import { Slot } from "expo-router";

import { useSessionContext } from "@/feature/auth/contexts/SessionContext";
import { useAuthRedirect } from "@/feature/auth/hooks/useAuthRedirect";

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

  return <Slot />;
}
