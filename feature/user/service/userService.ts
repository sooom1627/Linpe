import { Alert } from "react-native";
import { type Session } from "@supabase/supabase-js";

import supabase from "@/lib/supabase";
import { type User } from "../types/user";

export const getProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    return data as User;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateProfile = async ({
  username,
  avatar_url,
  session,
  setLoading,
  refetch,
}: {
  username: string;
  avatar_url: string;
  session: Session | null;
  setLoading: (loading: boolean) => void;
  refetch: () => Promise<void>;
}) => {
  try {
    setLoading(true);
    if (!session?.user) throw new Error("No user on the session!");

    const updates = {
      id: session?.user.id,
      username,
      avatar_url,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      throw error;
    }

    // プロフィール更新後にUserContextを更新
    await refetch();
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  } finally {
    setLoading(false);
  }
};
