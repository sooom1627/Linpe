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
  setLoading(false);
  if (error) {
    throw error;
  }
};
