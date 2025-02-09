import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { AddCircleIcon } from "@/components/icons/AddCircleIcon";
import { uploadAvatar } from "../service/avatarService";
import { AvatarDisplay } from "./AvatarDisplay";

interface AvatarPickerProps {
  url: string;
  onUpload: (filePath: string, setLoading: (loading: boolean) => void) => void;
}

export const AvatarPicker = ({ url, onUpload }: AvatarPickerProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    try {
      await uploadAvatar(onUpload, setUploading);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <View className="relative flex flex-row items-center justify-center">
      {url ? (
        <AvatarDisplay imagePath={url} size={128} />
      ) : (
        <View className="h-32 w-32 rounded-full bg-gray-300"></View>
      )}
      <View className="absolute bottom-0 right-0">
        <TouchableOpacity
          className="rounded-full bg-white"
          disabled={uploading}
          onPress={handleUpload}
        >
          <AddCircleIcon size={32} />
        </TouchableOpacity>
      </View>
      {uploading && (
        <View className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-full bg-black/30">
          <Text className="font-medium text-white">アップロード中...</Text>
        </View>
      )}
    </View>
  );
};
