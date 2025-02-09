import { type ReactNode } from "react";
import { Text, View } from "react-native";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

export const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <View className="flex flex-col gap-4">
      <Text className="text-2xl font-bold">{title}</Text>
      {children}
    </View>
  );
};
