import { type ReactNode } from "react";
import { View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

export const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <View className="flex flex-col gap-4">
      <ThemedText text={title} variant="h2" weight="bold" />
      {children}
    </View>
  );
};
