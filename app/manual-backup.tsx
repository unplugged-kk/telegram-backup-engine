/**
 * Manual Backup Screen
 * Select and upload photos, videos, and files
 */

import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { TelegramClient } from "@/lib/telegram-client";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

interface MediaItem {
  id: string;
  name: string;
  uri: string;
  type: "photo" | "video" | "document";
  size: number;
  selected: boolean;
}

export default function ManualBackupScreen() {
  const router = useRouter();
  const { state, addBackupHistory, setLastBackupTime, setTotalFilesUploaded } = useAppContext();
  const colors = useColors();
  const [tab, setTab] = useState<"photos" | "videos" | "folders">("photos");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const selectedCount = media.filter((m) => m.selected).length;
  const selectedSize = media
    .filter((m) => m.selected)
    .reduce((sum, m) => sum + m.size, 0);

  const handleSelectAll = () => {
    setMedia(media.map((m) => ({ ...m, selected: !media.every((x) => x.selected) })));
  };

  const handleToggleSelect = (id: string) => {
    setMedia(media.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m)));
  };

  const handleUpload = async () => {
    if (selectedCount === 0) {
      setError("Please select at least one file");
      return;
    }

    if (!state.credentials) {
      setError("Telegram credentials not configured");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const client = new TelegramClient(state.credentials.botToken, state.credentials.chatId);
      const selectedMedia = media.filter((m) => m.selected);
      let successCount = 0;
      const failedFiles: string[] = [];

      for (let i = 0; i < selectedMedia.length; i++) {
        const file = selectedMedia[i];
        try {
          const progress = Math.round(((i + 1) / selectedMedia.length) * 100);
          setUploadProgress(progress);

          // Simulate upload (in real app, would call client.uploadPhoto/Video/Document)
          await new Promise((resolve) => setTimeout(resolve, 500));

          successCount++;
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (err) {
          failedFiles.push(file.name);
        }
      }

      // Update stats
      const newTotal = state.totalFilesUploaded + successCount;
      await setTotalFilesUploaded(newTotal);
      await setLastBackupTime(Date.now());

      // Add to history
      await addBackupHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        status: failedFiles.length === 0 ? "success" : "partial",
        filesCount: successCount,
        files: selectedMedia.map((m) => ({
          id: m.id,
          name: m.name,
          path: m.uri,
          size: m.size,
          type: m.type,
          hash: "",
          uploadedAt: Date.now(),
        })),
        errorMessage: failedFiles.length > 0 ? `Failed: ${failedFiles.join(", ")}` : undefined,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-2xl font-bold text-foreground">Manual Backup</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2 bg-surface rounded-lg p-1">
          {(["photos", "videos", "folders"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-2 px-3 rounded-md ${tab === t ? "bg-primary" : ""}`}
            >
              <Text
                className={`text-sm font-semibold text-center ${
                  tab === t ? "text-white" : "text-muted"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selection Info */}
        <View className="bg-surface rounded-lg p-3 flex-row items-center justify-between">
          <Text className="text-sm text-muted">
            {selectedCount} selected • {formatFileSize(selectedSize)}
          </Text>
          <TouchableOpacity onPress={handleSelectAll}>
            <Text className="text-sm font-semibold text-primary">
              {media.every((m) => m.selected) ? "Deselect All" : "Select All"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Media List */}
        <FlatList
          data={media}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleToggleSelect(item.id)}
              className="flex-row items-center gap-3 py-3 px-3 border-b border-border"
            >
              <View
                className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  item.selected ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {item.selected && <MaterialIcons name="check" size={14} color="#ffffff" />}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground">{item.name}</Text>
                <Text className="text-xs text-muted">{formatFileSize(item.size)}</Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />

        {/* Error Message */}
        {error && (
          <View className="bg-error/10 border border-error rounded-lg p-3">
            <Text className="text-sm text-error">{error}</Text>
          </View>
        )}

        {/* Progress Bar */}
        {uploading && (
          <View className="gap-2">
            <View className="bg-surface rounded-full h-2 overflow-hidden">
              <View
                className="bg-primary h-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </View>
            <Text className="text-xs text-center text-muted">{uploadProgress}% uploaded</Text>
          </View>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          onPress={handleUpload}
          disabled={uploading || selectedCount === 0}
          className={`py-4 rounded-lg items-center justify-center ${
            uploading || selectedCount === 0 ? "bg-primary/50" : "bg-primary"
          }`}
        >
          {uploading && <ActivityIndicator color="#ffffff" size="small" />}
          <Text className="text-base font-semibold text-white">
            {uploading ? "Uploading..." : `Upload ${selectedCount} File${selectedCount !== 1 ? "s" : ""}`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
