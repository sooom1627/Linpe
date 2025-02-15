import { type ReactNode } from "react";
import { View } from "react-native";

import { ThemedText } from "../../text/ThemedText";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

export const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <View className="flex flex-col gap-4">
      <ThemedText variant="h2" weight="bold">
        {title}
      </ThemedText>
      {children}
    </View>
  );
};
