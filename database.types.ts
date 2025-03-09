export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      links: {
        Row: {
          created_at: string | null;
          domain: string;
          full_url: string;
          id: string;
          parameter: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          domain: string;
          full_url: string;
          id?: string;
          parameter?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          domain?: string;
          full_url?: string;
          id?: string;
          parameter?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      user_link_actions: {
        Row: {
          added_at: string;
          id: string;
          link_id: string;
          read_at: string | null;
          read_count: number;
          scheduled_read_at: string | null;
          status: string;
          swipe_count: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          added_at?: string;
          id?: string;
          link_id: string;
          read_at?: string | null;
          read_count?: number;
          scheduled_read_at?: string | null;
          status?: string;
          swipe_count?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          added_at?: string;
          id?: string;
          link_id?: string;
          read_at?: string | null;
          read_count?: number;
          scheduled_read_at?: string | null;
          status?: string;
          swipe_count?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_link_actions_link_id_fkey";
            columns: ["link_id"];
            isOneToOne: false;
            referencedRelation: "links";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_link_actions_link_id_fkey";
            columns: ["link_id"];
            isOneToOne: false;
            referencedRelation: "user_links_with_actions";
            referencedColumns: ["link_id"];
          },
          {
            foreignKeyName: "user_link_actions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_link_actions_log: {
        Row: {
          changed_at: string;
          changed_by: string | null;
          id: string;
          link_id: string;
          new_status: string;
          previous_status: string;
          user_id: string;
          user_link_action_id: string;
        };
        Insert: {
          changed_at?: string;
          changed_by?: string | null;
          id?: string;
          link_id: string;
          new_status: string;
          previous_status: string;
          user_id: string;
          user_link_action_id: string;
        };
        Update: {
          changed_at?: string;
          changed_by?: string | null;
          id?: string;
          link_id?: string;
          new_status?: string;
          previous_status?: string;
          user_id?: string;
          user_link_action_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_link_actions_log_fk";
            columns: ["user_link_action_id"];
            isOneToOne: false;
            referencedRelation: "user_link_actions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_link_actions_log_fk";
            columns: ["user_link_action_id"];
            isOneToOne: false;
            referencedRelation: "user_links_with_actions";
            referencedColumns: ["user_link_action_id"];
          },
          {
            foreignKeyName: "user_link_actions_log_link_fk";
            columns: ["link_id"];
            isOneToOne: false;
            referencedRelation: "links";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_link_actions_log_link_fk";
            columns: ["link_id"];
            isOneToOne: false;
            referencedRelation: "user_links_with_actions";
            referencedColumns: ["link_id"];
          },
          {
            foreignKeyName: "user_link_actions_log_user_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      user_links_with_actions: {
        Row: {
          action_link_id: string | null;
          action_updated_at: string | null;
          added_at: string | null;
          domain: string | null;
          full_url: string | null;
          link_created_at: string | null;
          link_id: string | null;
          link_updated_at: string | null;
          parameter: string | null;
          read_at: string | null;
          read_count: number | null;
          scheduled_read_at: string | null;
          status: string | null;
          swipe_count: number | null;
          user_id: string | null;
          user_link_action_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_link_actions_link_id_fkey";
            columns: ["action_link_id"];
            isOneToOne: false;
            referencedRelation: "links";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_link_actions_link_id_fkey";
            columns: ["action_link_id"];
            isOneToOne: false;
            referencedRelation: "user_links_with_actions";
            referencedColumns: ["link_id"];
          },
          {
            foreignKeyName: "user_link_actions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      add_link_and_user_action: {
        Args: {
          p_domain: string;
          p_full_url: string;
          p_parameter: string;
          p_user_id: string;
          p_status?: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
