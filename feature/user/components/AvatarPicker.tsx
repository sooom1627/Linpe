import { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { AddCircleIcon } from "@/components/icons/AddCircleIcon";
import supabase from "@/lib/supabase";

interface AvatarPickerProps {
  url: string;
  onUpload: (filePath: string, setLoading: (loading: boolean) => void) => void;
}

export const AvatarPicker = ({ url, onUpload }: AvatarPickerProps) => {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = async (path: string) => {
    try {
      setDownloading(true);
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
        setDownloading(false);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
      setDownloading(false);
    }
  };
  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer(),
      );

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      console.log("Supabase upload result:", { data, error: uploadError });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(data.path, setUploading);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View className="relative flex flex-row items-center justify-center">
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          className="h-32 w-32 rounded-full"
        />
      ) : (
        <View className="h-32 w-32 rounded-full bg-gray-300"></View>
      )}
      <View className="absolute bottom-0 right-0">
        <TouchableOpacity
          className="rounded-full bg-white"
          disabled={uploading}
          onPress={uploadAvatar}
        >
          <AddCircleIcon size={32} />
        </TouchableOpacity>
      </View>
      {(uploading || downloading) && (
        <View className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-full bg-black/30">
          <Text className="font-medium text-white">
            {uploading ? "アップロード中..." : "読み込み中..."}
          </Text>
        </View>
      )}
    </View>
  );
};
