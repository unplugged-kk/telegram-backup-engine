/**
 * Settings Screen
 * App configuration and security
 */

import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { TelegramClient } from "@/lib/telegram-client";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const router = useRouter();
  const { state, setCredentials, clearAllData } = useAppContext();
  const colors = useColors();
  const [editingBotToken, setEditingBotToken] = useState(false);
  const [editingChatId, setEditingChatId] = useState(false);
  const [botToken, setBotToken] = useState(state.credentials?.botToken || "");
  const [chatId, setChatId] = useState(state.credentials?.chatId || "");
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setError("Please enter both Bot Token and Chat ID");
      return;
    }

    setTesting(true);
    setError(null);

    try {
      const client = new TelegramClient(botToken, chatId);
      await client.validateBot();
      await client.validateChat();

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Connection test passed!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed";
      setError(message);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setTesting(false);
    }
  };

  const handleSaveCredentials = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setError("Please enter both Bot Token and Chat ID");
      return;
    }

    await setCredentials({ botToken, chatId });
    setEditingBotToken(false);
    setEditingChatId(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Success", "Credentials updated!");
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all backup history, schedules, and credentials. This action cannot be undone.",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Clear",
          onPress: async () => {
            await clearAllData();
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace("../setup");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">Settings</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Telegram Credentials Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Telegram Credentials</Text>

            {/* Bot Token */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Bot Token</Text>
              {editingBotToken ? (
                <View className="gap-2">
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholder="Enter Bot Token"
                    placeholderTextColor="#687076"
                    value={botToken}
                    onChangeText={setBotToken}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => setEditingBotToken(false)}
                      className="flex-1 py-2 px-3 bg-border rounded-lg items-center"
                    >
                      <Text className="text-sm font-semibold text-foreground">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveCredentials}
                      className="flex-1 py-2 px-3 bg-primary rounded-lg items-center"
                    >
                      <Text className="text-sm font-semibold text-white">Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setEditingBotToken(true)}
                  className="bg-surface border border-border rounded-lg p-3 flex-row items-center justify-between"
                >
                  <Text className="text-sm text-muted">••••••••••••••••</Text>
                  <MaterialIcons name="edit" size={18} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Chat ID */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Chat ID</Text>
              {editingChatId ? (
                <View className="gap-2">
                  <TextInput
                    className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholder="Enter Chat ID"
                    placeholderTextColor="#687076"
                    value={chatId}
                    onChangeText={setChatId}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="number-pad"
                  />
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => setEditingChatId(false)}
                      className="flex-1 py-2 px-3 bg-border rounded-lg items-center"
                    >
                      <Text className="text-sm font-semibold text-foreground">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveCredentials}
                      className="flex-1 py-2 px-3 bg-primary rounded-lg items-center"
                    >
                      <Text className="text-sm font-semibold text-white">Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setEditingChatId(true)}
                  className="bg-surface border border-border rounded-lg p-3 flex-row items-center justify-between"
                >
                  <Text className="text-sm text-muted">{state.credentials?.chatId || "Not set"}</Text>
                  <MaterialIcons name="edit" size={18} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-error/10 border border-error rounded-lg p-3">
                <Text className="text-sm text-error">{error}</Text>
              </View>
            )}

            {/* Test Connection Button */}
            <TouchableOpacity
              onPress={handleTestConnection}
              disabled={testing}
              className={`py-3 rounded-lg items-center justify-center flex-row gap-2 ${
                testing ? "bg-primary/50" : "bg-primary"
              }`}
            >
              {testing && <ActivityIndicator color="#ffffff" size="small" />}
              <Text className="text-base font-semibold text-white">
                {testing ? "Testing..." : "Test Connection"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View className="gap-3 mt-6 pt-6 border-t border-border">
            <Text className="text-lg font-semibold text-error">Danger Zone</Text>

            <TouchableOpacity
              onPress={handleClearAllData}
              className="bg-error/10 border border-error rounded-lg p-4 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-base font-semibold text-error">Clear All Data</Text>
                <Text className="text-xs text-error/70 mt-1">
                  Delete all backups, schedules, and credentials
                </Text>
              </View>
              <MaterialIcons name="delete" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View className="gap-3 mt-6 pt-6 border-t border-border">
            <Text className="text-lg font-semibold text-foreground">About</Text>

            <View className="bg-surface rounded-lg p-4 gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">Version</Text>
                <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
              </View>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-sm text-muted">Build</Text>
                <Text className="text-sm font-semibold text-foreground">1</Text>
              </View>
            </View>

            <View className="bg-surface rounded-lg p-4 mt-2">
              <Text className="text-xs text-muted leading-relaxed">
                Telegram Backup Engine is a personal backup utility that uses Telegram channels as
                storage. Your data is private and never shared with third parties.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
