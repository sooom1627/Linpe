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
