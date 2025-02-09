import { Alert } from "react-native";

import supabase from "@/lib/supabase";

jest.mock("@/lib/supabase");
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

export { Alert, supabase };
