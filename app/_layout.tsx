// app/_layout.jsx
import { SafeAreaView, Text } from "react-native";
import { Slot } from "expo-router";

import "../assets/styles/global.css";

import { useEffect, useState } from "react";
import { type Session } from "@supabase/supabase-js";

import supabase from "@/lib/supabase";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaView className="items-left justify-top flex-1 p-4">
      <Text>{session ? "ログイン済み" : "未ログイン"}</Text>
      <Slot />
    </SafeAreaView>
  );
}
