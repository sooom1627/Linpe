// app/_layout.jsx
import { SafeAreaView, Text } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";

import "../assets/styles/global.css";

import { useEffect, useState } from "react";
import { type Session } from "@supabase/supabase-js";

import supabase from "@/lib/supabase";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(protected)";

    if (session && inAuthGroup) {
      // ログイン済みで認証画面にいる場合は、protectedにリダイレクト
      router.replace("/(protected)");
    } else if (!session && inProtectedGroup) {
      // 未ログインでprotected画面にいる場合は、認証画面にリダイレクト
      router.replace("/(auth)/loginScreen");
    }
  }, [session, segments, router]);

  return (
    <SafeAreaView className="items-left justify-top flex-1 p-4">
      <Text>{session ? "ログイン済み" : "未ログイン"}</Text>
      <Slot />
    </SafeAreaView>
  );
}
