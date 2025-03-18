import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

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
  // タブを押したときの処理
  const handleTabPress = useCallback(
    (tabId: LinkTabGroup) => {
      onTabChange(tabId);
    },
    [onTabChange],
  );

  return (
    <View className="h-10 w-full">
      <View className="flex h-full w-full flex-row border-b border-gray-200">
        {LINK_TABS.map((tab) => {
          const isActive = tab.id === selectedTab;
          return (
            <TouchableOpacity
              key={tab.id}
              className="relative flex h-full flex-1 items-center justify-center"
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <ThemedText
                text={tab.label}
                variant="body"
                weight="medium"
                color={isActive ? "accent" : "default"}
              />
              {isActive && (
                <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
