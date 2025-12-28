/**
 * History Screen
 * View past backup attempts
 */

import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export default function HistoryScreen() {
  const router = useRouter();
  const { state } = useAppContext();
  const colors = useColors();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return colors.success;
      case "failed":
        return colors.error;
      case "partial":
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "check-circle";
      case "failed":
        return "error";
      case "partial":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-2xl font-bold text-foreground">Backup History</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* History List */}
        {state.backupHistory.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <MaterialIcons name="history" size={48} color={colors.muted} />
            <Text className="text-lg font-semibold text-foreground">No Backups Yet</Text>
            <Text className="text-sm text-muted text-center">
              Start backing up your files to see history here
            </Text>
          </View>
        ) : (
          <FlatList
            data={state.backupHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleToggleExpand(item.id)}
                className="bg-surface rounded-lg p-4 mb-3 border border-border"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-3 flex-1">
                    <MaterialIcons
                      name={getStatusIcon(item.status)}
                      size={20}
                      color={getStatusColor(item.status)}
                    />
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {formatDate(item.timestamp)}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {item.filesCount} file{item.filesCount !== 1 ? "s" : ""} uploaded
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name={expandedId === item.id ? "expand-less" : "expand-more"}
                    size={20}
                    color={colors.muted}
                  />
                </View>

                {/* Expanded Details */}
                {expandedId === item.id && (
                  <View className="mt-3 pt-3 border-t border-border gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Status</Text>
                      <Text className="text-xs font-semibold text-foreground capitalize">
                        {item.status}
                      </Text>
                    </View>

                    {item.errorMessage && (
                      <View className="bg-error/10 rounded p-2 mt-2">
                        <Text className="text-xs text-error">{item.errorMessage}</Text>
                      </View>
                    )}

                    {item.files.length > 0 && (
                      <View className="mt-2">
                        <Text className="text-xs font-semibold text-foreground mb-2">
                          Files Uploaded:
                        </Text>
                        {item.files.slice(0, 3).map((file) => (
                          <Text key={file.id} className="text-xs text-muted">
                            • {file.name}
                          </Text>
                        ))}
                        {item.files.length > 3 && (
                          <Text className="text-xs text-muted mt-1">
                            +{item.files.length - 3} more
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
