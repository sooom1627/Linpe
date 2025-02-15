import { Alert } from "react-native";
import { type Session } from "@supabase/supabase-js";
import { type KeyedMutator } from "swr";

import supabase from "@/lib/supabase";
import { type User } from "../types/user";

export const getProfile = async (
  userId: string | null,
): Promise<User | null> => {
  if (!userId) return null;

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
  mutate,
}: {
  username: string;
  avatar_url: string;
  session: Session | null;
  setLoading: (loading: boolean) => void;
  mutate: KeyedMutator<User | null>;
}) => {
  try {
    setLoading(true);
    if (!session?.user) throw new Error("No user on the session!");

    const updates = {
      id: session.user.id,
      username,
      avatar_url,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      throw error;
    }

    // プロフィール更新後にキャッシュを更新
    // optimistic updateを使用して即座にUIを更新
    const updatedUser: User = {
      id: updates.id,
      username: updates.username,
      avatar_url: updates.avatar_url,
      updated_at: updates.updated_at,
      full_name: null,
    };

    await mutate(updatedUser, {
      optimisticData: updatedUser,
      rollbackOnError: true,
      revalidate: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  } finally {
    setLoading(false);
  }
};
