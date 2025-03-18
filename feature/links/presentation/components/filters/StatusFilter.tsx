import { TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/text/ThemedText";

interface StatusFilterProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  availableStatuses?: string[];
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
  availableStatuses,
}: StatusFilterProps) {
  const allStatuses = [
    "add",
    "Today",
    "inWeekend",
    "Reading",
    "Read",
    "Re-Read",
    "Bookmark",
    "Skip",
  ];

  const displayStatuses = availableStatuses || allStatuses;

  return (
    <View className="sticky top-0 z-10 mb-4 bg-background">
      <View className="w-full flex-row flex-wrap gap-2">
        <TouchableOpacity
          onPress={() => onStatusChange(null)}
          className={`rounded-full px-3 py-1 ${
            selectedStatus === null
              ? "bg-accent"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <ThemedText
            text="All"
            variant="small"
            weight="medium"
            color={selectedStatus === null ? "white" : "default"}
          />
        </TouchableOpacity>

        {displayStatuses.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() =>
              onStatusChange(status === selectedStatus ? null : status)
            }
            className={`rounded-full px-3 py-1 ${
              status === selectedStatus
                ? "bg-accent"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <ThemedText
              text={status}
              variant="small"
              weight="medium"
              color={status === selectedStatus ? "white" : "default"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
