import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";
import {
  LINK_TABS_CONFIG,
  type LinkTabGroup,
} from "@/feature/links/domain/models/types";

// インポートした設定からタブの配列を作成
const LINK_TABS = Object.values(LINK_TABS_CONFIG);

interface LinkFilterTabsProps {
  selectedTab: LinkTabGroup;
  onTabChange: (tab: LinkTabGroup) => void;
  children: React.ReactNode;
}

export function LinkFilterTabs({
  selectedTab,
  onTabChange,
  children,
}: LinkFilterTabsProps) {
  // タブを押したときの処理
  const handleTabPress = useCallback(
    (tabId: LinkTabGroup) => {
      onTabChange(tabId);
    },
    [onTabChange],
  );

  return (
    <View className="flex w-full flex-col pb-10">
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
      {/* タブの下にコンテンツを表示 */}
      {children}
    </View>
  );
}
