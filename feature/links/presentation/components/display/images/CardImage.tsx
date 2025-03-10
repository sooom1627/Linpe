import { memo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

interface CardImageProps {
  uri: string;
  title: string;
}

// 色の定数
const COLORS = {
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate500: "#64748B",
};

export const CardImage = memo(function CardImage({
  uri,
  title,
}: CardImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <View style={styles.container}>
      {!hasError ? (
        <Image
          source={{ uri }}
          cachePolicy="memory-disk"
          contentFit="cover"
          transition={200}
          accessible={true}
          accessibilityLabel={`${title} image`}
          accessibilityRole="image"
          style={styles.image}
          onError={(e) => {
            setHasError(true);
            console.error("Image loading error:", e);
          }}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: "auto",
    width: "100%",
  },
  errorContainer: {
    alignItems: "center",
    aspectRatio: 1.91,
    backgroundColor: COLORS.slate100,
    borderRadius: 8,
    justifyContent: "center",
    width: "100%",
  },
  errorText: {
    color: COLORS.slate500,
    fontSize: 14,
    textAlign: "center",
  },
  image: {
    aspectRatio: 1.91,
    backgroundColor: COLORS.slate50,
    borderRadius: 8,
    width: "100%",
  },
});
