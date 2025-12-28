/**
 * Add/Edit Schedule Screen
 * Configure backup schedules
 */

import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { BackupSchedule } from "@/lib/types";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export default function AddScheduleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { state, addSchedule, updateSchedule } = useAppContext();
  const colors = useColors();

  const existingSchedule = id ? state.schedules.find((s) => s.id === id as string) : null;

  const [name, setName] = useState(existingSchedule?.name || "");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">(
    (existingSchedule?.frequency as "daily" | "weekly" | "custom") || "daily"
  );
  const [time, setTime] = useState(existingSchedule?.time || "02:00");
  const [backupNewOnly, setBackupNewOnly] = useState<boolean>(existingSchedule?.backupNewOnly ?? true);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a schedule name");
      return;
    }

    const schedule: BackupSchedule = {
      id: existingSchedule?.id || Date.now().toString(),
      name,
      frequency,
      time,
      folders: existingSchedule?.folders || [],
      backupNewOnly,
      enabled: existingSchedule?.enabled ?? true,
      createdAt: existingSchedule?.createdAt || Date.now(),
      lastRun: existingSchedule?.lastRun,
    };

    try {
      if (existingSchedule) {
        await updateSchedule(schedule);
      } else {
        await addSchedule(schedule);
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save schedule";
      setError(message);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleTimeChange = (text: string) => {
    // Format as HH:mm
    const cleaned = text.replace(/[^0-9:]/g, "");
    if (cleaned.length <= 5) {
      setTime(cleaned);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">
              {existingSchedule ? "Edit Schedule" : "New Schedule"}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Schedule Name */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Schedule Name</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="e.g., Daily Night Backup"
              placeholderTextColor="#687076"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Frequency */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Frequency</Text>
            <View className="flex-row gap-2">
              {(["daily", "weekly", "custom"] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFrequency(f)}
                  className={`flex-1 py-3 px-3 rounded-lg border ${
                    frequency === f
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold text-center ${
                      frequency === f ? "text-white" : "text-foreground"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Time (HH:mm)</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-center"
              placeholder="02:00"
              placeholderTextColor="#687076"
              value={time}
              onChangeText={handleTimeChange}
              maxLength={5}
              keyboardType="number-pad"
            />
          </View>

          {/* Backup Options */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Backup Options</Text>

            {/* Backup New Only Toggle */}
            <TouchableOpacity
              onPress={() => setBackupNewOnly(!backupNewOnly)}
              className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-sm font-semibold text-foreground">Backup New Files Only</Text>
                <Text className="text-xs text-muted mt-1">
                  Skip files that were already backed up
                </Text>
              </View>
              <View
                className={`w-12 h-7 rounded-full items-center justify-center ${
                  backupNewOnly ? "bg-primary" : "bg-border"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white transform ${
                    backupNewOnly ? "translate-x-2" : "-translate-x-2"
                  }`}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-error/10 border border-error rounded-lg p-3">
              <Text className="text-sm text-error">{error}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 py-4 px-4 bg-border rounded-lg items-center"
            >
              <Text className="text-base font-semibold text-foreground">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 py-4 px-4 bg-primary rounded-lg items-center"
            >
              <Text className="text-base font-semibold text-white">
                {existingSchedule ? "Update" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
