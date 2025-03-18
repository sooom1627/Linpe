import { ScrollView, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

export type LinkTabGroup = "all" | "unread" | "read";

export interface LinkTabConfig {
  id: LinkTabGroup;
  label: string;
  statuses: string[];
}

export const LINK_TABS: LinkTabConfig[] = [
  {
    id: "all",
    label: "All",
    statuses: [
      "add",
      "Today",
      "inWeekend",
      "Reading",
      "Read",
      "Re-Read",
      "Bookmark",
      "Skip",
    ],
  },
  {
    id: "unread",
    label: "Unread",
    statuses: ["add", "Skip", "Today", "inWeekend", "Reading"],
  },
  {
    id: "read",
    label: "Read",
    statuses: ["Read", "Re-Read", "Bookmark"],
  },
];

interface LinkFilterTabsProps {
  selectedTab: LinkTabGroup;
  onTabChange: (tab: LinkTabGroup) => void;
}

export function LinkFilterTabs({
  selectedTab,
  onTabChange,
}: LinkFilterTabsProps) {
  return (
    <View className="mb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="w-full"
      >
        <View className="flex w-full flex-row justify-around">
          {LINK_TABS.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              className={`flex-1 items-center border-b-2 px-4 pb-2 ${
                selectedTab === tab.id ? "border-accent" : "border-transparent"
              } ${index < LINK_TABS.length - 1 ? "mr-4" : ""}`}
            >
              <ThemedText
                text={tab.label}
                variant="body"
                weight="medium"
                color={selectedTab === tab.id ? "accent" : "default"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
