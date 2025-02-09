import { type Database } from "@/supabase/schema";

export type User = Database["public"]["Tables"]["profiles"]["Row"];
