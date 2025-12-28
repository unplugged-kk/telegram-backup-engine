/**
 * Schedules Screen
 * Manage backup schedules
 */

import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export default function SchedulesScreen() {
  const router = useRouter();
  const { state, updateSchedule, deleteSchedule } = useAppContext();
  const colors = useColors();

  const handleAddSchedule = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("../add-schedule");
  };

  const handleToggleSchedule = async (id: string, enabled: boolean) => {
    const schedule = state.schedules.find((s) => s.id === id);
    if (schedule) {
      await updateSchedule({ ...schedule, enabled: !enabled });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleDeleteSchedule = (id: string) => {
    Alert.alert("Delete Schedule", "Are you sure you want to delete this schedule?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          await deleteSchedule(id);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditSchedule = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`../add-schedule?id=${id}`);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-2xl font-bold text-foreground">Schedules</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Schedules List */}
        {state.schedules.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <MaterialIcons name="schedule" size={48} color={colors.muted} />
            <Text className="text-lg font-semibold text-foreground">No Schedules</Text>
            <Text className="text-sm text-muted text-center">
              Create your first backup schedule to automate backups
            </Text>
          </View>
        ) : (
          <FlatList
            data={state.schedules}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">{item.name}</Text>
                    <Text className="text-sm text-muted mt-1">
                      {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)} at{" "}
                      {formatTime(item.time)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleToggleSchedule(item.id, item.enabled)}
                    className={`w-12 h-7 rounded-full items-center justify-center ${
                      item.enabled ? "bg-success" : "bg-border"
                    }`}
                  >
                    <View
                      className={`w-5 h-5 rounded-full bg-white transform ${
                        item.enabled ? "translate-x-2" : "-translate-x-2"
                      }`}
                    />
                  </TouchableOpacity>
                </View>

                <Text className="text-xs text-muted mb-3">
                  {item.folders.length} folder{item.folders.length !== 1 ? "s" : ""} •{" "}
                  {item.backupNewOnly ? "New files only" : "All files"}
                </Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleEditSchedule(item.id)}
                    className="flex-1 py-2 px-3 bg-primary/10 rounded-lg items-center"
                  >
                    <MaterialIcons name="edit" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteSchedule(item.id)}
                    className="flex-1 py-2 px-3 bg-error/10 rounded-lg items-center"
                  >
                    <MaterialIcons name="delete" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        )}

        {/* Add Schedule Button */}
        <TouchableOpacity
          onPress={handleAddSchedule}
          className="bg-primary rounded-lg py-4 flex-row items-center justify-center gap-2 mt-auto"
        >
          <MaterialIcons name="add" size={20} color="#ffffff" />
          <Text className="text-base font-semibold text-white">Add Schedule</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
