/**
 * Home Screen - Dashboard
 * Main hub showing backup status and quick actions
 */

import { ScrollView, Text, View, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const router = useRouter();
  const { state, setConnected } = useAppContext();
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  const lastBackupDate = state.lastBackupTime
    ? new Date(state.lastBackupTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate checking connection status
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setConnected(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setConnected(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBackupNow = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("../manual-backup");
  };

  const handleSchedules = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("../schedules");
  };

  const handleHistory = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("../history");
  };

  const handleSettings = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("../settings");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-foreground">Backup Engine</Text>
              <View className="flex-row items-center gap-2 mt-1">
                <View
                  className={`w-2 h-2 rounded-full ${state.isConnected ? "bg-success" : "bg-error"}`}
                />
                <Text className="text-sm text-muted">
                  {state.isConnected ? "Connected" : "Disconnected"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleSettings}
              className="p-3 bg-surface rounded-lg"
            >
              <MaterialIcons name="settings" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Status Cards */}
          <View className="gap-3">
            {/* Last Backup */}
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs font-semibold text-muted uppercase tracking-wide">
                Last Backup
              </Text>
              <Text className="text-lg font-semibold text-foreground mt-1">{lastBackupDate}</Text>
            </View>

            {/* Files Uploaded */}
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs font-semibold text-muted uppercase tracking-wide">
                Total Files Uploaded
              </Text>
              <Text className="text-lg font-semibold text-foreground mt-1">
                {state.totalFilesUploaded}
              </Text>
            </View>
          </View>

          {/* Primary Action */}
          <TouchableOpacity
            onPress={handleBackupNow}
            className="bg-primary rounded-lg py-4 items-center justify-center"
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="cloud-upload" size={20} color="#ffffff" />
              <Text className="text-base font-semibold text-white">Backup Now</Text>
            </View>
          </TouchableOpacity>

          {/* Secondary Actions */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleSchedules}
              className="bg-surface border border-border rounded-lg py-4 px-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center">
                  <MaterialIcons name="schedule" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    Scheduled Backups
                  </Text>
                  <Text className="text-xs text-muted">
                    {state.schedules.filter((s) => s.enabled).length} active
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleHistory}
              className="bg-surface border border-border rounded-lg py-4 px-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center">
                  <MaterialIcons name="history" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text className="text-base font-semibold text-foreground">Backup History</Text>
                  <Text className="text-xs text-muted">
                    {state.backupHistory.length} backups
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
