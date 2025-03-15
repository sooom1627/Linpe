import { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

export const DashboardScreen = () => {
  // ダミーデータの生成（126日分の活動データ = 18週分）
  const activityData = useMemo(() => {
    // 0: 活動なし, 1: 低活動, 2: 中活動, 3: 高活動
    return Array(126)
      .fill(0)
      .map(() => Math.floor(Math.random() * 4));
  }, []);

  return (
    <View className="flex items-center justify-center gap-10 py-5">
      {/* 活動量トラッカー */}
      <View className="w-full px-4">
        <ActivityCard title="Your Activity" data={activityData} />
      </View>
    </View>
  );
};

// 活動量カードコンポーネント
interface ActivityCardProps {
  title: string;
  data: number[];
}

const ActivityCard = ({ title, data }: ActivityCardProps) => {
  return (
    <View className="bg-white dark:bg-black">
      <View className="mb-4 flex-row justify-between">
        <ThemedText
          text={title}
          variant="body"
          weight="semibold"
          color="default"
        />
        <View className="flex-row items-center gap-1">
          <Text className="text-xs text-gray-400 dark:text-gray-500">
            latest
          </Text>
          <Text className="text-gray-400 dark:text-gray-500">→</Text>
        </View>
      </View>
      <ActivityDots data={data} />
    </View>
  );
};

// 活動ドット表示コンポーネント
interface ActivityDotsProps {
  data: number[];
}

const ActivityDots = ({ data }: ActivityDotsProps) => {
  const { width } = useWindowDimensions();

  // 曜日ラベル（月曜日スタート）
  const weekdayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];

  // レイアウト計算を関数に抽象化
  const calculateLayout = (screenWidth: number) => {
    const labelWidth = 30; // ラベル用の幅
    const sidePadding = 16; // 両側のパディング
    const availableWidth = screenWidth - labelWidth - sidePadding * 2;

    const daysInWeek = 7;
    const weeksToShow = 18;
    const dotSpacing = 6;

    const totalSpacing = dotSpacing * (weeksToShow - 1);
    const dotSize = Math.max(
      Math.floor((availableWidth - totalSpacing) / weeksToShow),
      6,
    );

    const actualWidth = dotSize * weeksToShow + totalSpacing;
    const horizontalMargin = Math.max(0, (availableWidth - actualWidth) / 2);

    return {
      dotSize,
      dotSpacing,
      horizontalMargin,
      daysInWeek,
      weeksToShow,
    };
  };

  const { dotSize, dotSpacing, horizontalMargin, daysInWeek, weeksToShow } =
    calculateLayout(width);

  // スタイルを定義
  const styles = StyleSheet.create({
    dot: {
      borderRadius: dotSize / 2,
      height: dotSize,
      width: dotSize,
    },
    gridContainer: {
      paddingHorizontal: horizontalMargin,
    },
    rowGap: {
      gap: dotSpacing,
    },
  });

  const renderDot = (value: number, index: number) => {
    // 活動レベルに応じたスタイルを適用
    let dotStyle = "";

    switch (value) {
      case 0: // 活動なし
        dotStyle = "bg-gray-200 dark:bg-gray-800";
        break;
      case 1: // 低活動
        dotStyle = "bg-accent-100 dark:bg-accent-900";
        break;
      case 2: // 中活動
        dotStyle = "bg-accent-400 dark:bg-accent-700";
        break;
      case 3: // 高活動
        dotStyle = "bg-accent dark:bg-accent-500";
        break;
    }

    return (
      <View
        key={index}
        style={styles.dot}
        className={`rounded-sm ${dotStyle}`}
      />
    );
  };

  const renderGrid = () => {
    const grid = [];

    // 曜日ラベルと活動ドットのグリッドを生成
    for (let i = 0; i < daysInWeek; i++) {
      const rowItems = [];

      // 曜日ラベル
      const weekdayLabel = weekdayLabels[i] || "";

      // 各週のドットを生成
      for (let j = 0; j < weeksToShow; j++) {
        const index = j * daysInWeek + i;
        rowItems.push(renderDot(data[index], index));
      }

      grid.push(
        <View key={i} className="mb-1 flex-row items-center">
          {/* 曜日ラベル */}
          <Text className="mr-2 w-8 text-right text-xs text-gray-500 dark:text-gray-400">
            {weekdayLabel}
          </Text>

          {/* 活動ドット */}
          <View style={styles.rowGap} className="flex-row">
            {rowItems}
          </View>
        </View>,
      );
    }

    return grid;
  };

  return (
    <View className="w-full">
      <View style={styles.gridContainer}>{renderGrid()}</View>
    </View>
  );
};
