// その後にインポートを行う
import { Alert } from "react-native";

import supabase from "@/lib/supabase";

/* eslint-disable import/first */

// モック設定を最上部に記述
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock("@/lib/supabase");

beforeEach(() => {
  jest.clearAllMocks();
});

export { Alert, supabase };
