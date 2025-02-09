import { Alert } from "react-native";

import supabase from "@/lib/supabase";

export const loginWithEmail = async (
  email: string,
  password: string,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) Alert.alert(error.message);

  setLoading(false);
};

export const signupWithEmail = async (
  email: string,
  password: string,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) Alert.alert(error.message);
  if (!session) Alert.alert("Please check your inbox for email verification!");
  setLoading(false);
};
