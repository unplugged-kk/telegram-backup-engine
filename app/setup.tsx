/**
 * Setup Screen
 * Initial configuration for Telegram Bot Token and Chat ID
 */

import React, { useState } from "react";
import { ScrollView, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppContext } from "@/lib/app-context";
import { TelegramClient } from "@/lib/telegram-client";
import * as Haptics from "expo-haptics";

export default function SetupScreen() {
  const router = useRouter();
  const { setCredentials } = useAppContext();
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setError("Please enter both Bot Token and Chat ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = new TelegramClient(botToken, chatId);

      // Validate bot
      await client.validateBot();

      // Validate chat
      await client.validateChat();

      // Save credentials
      await setCredentials({ botToken, chatId });

      // Haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate to home
      router.replace("/(tabs)");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed";
      setError(message);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6 justify-center">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">Setup</Text>
            <Text className="text-base text-muted">
              Configure your Telegram Bot to start backing up your files
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Bot Token Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Bot Token</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="Enter your Telegram Bot Token"
                placeholderTextColor="#687076"
                value={botToken}
                onChangeText={setBotToken}
                editable={!loading}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text className="text-xs text-muted">
                Get this from @BotFather on Telegram
              </Text>
            </View>

            {/* Chat ID Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Chat ID</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="Enter your Chat ID"
                placeholderTextColor="#687076"
                value={chatId}
                onChangeText={setChatId}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
              />
              <Text className="text-xs text-muted">
                Your private channel or group ID (e.g., -1001234567890)
              </Text>
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
              disabled={loading}
              className={`bg-primary rounded-lg py-4 flex-row items-center justify-center gap-2 ${loading ? "opacity-60" : "opacity-100"}`}
            >
              {loading && <ActivityIndicator color="#ffffff" size="small" />}
              <Text className="text-base font-semibold text-white">
                {loading ? "Testing..." : "Test Connection"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Help Section */}
          <View className="bg-surface rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-foreground">How to get your credentials:</Text>
            <Text className="text-xs text-muted leading-relaxed">
              1. Open Telegram and search for @BotFather{"\n"}
              2. Create a new bot and copy the token{"\n"}
              3. Create a private channel or group{"\n"}
              4. Add your bot to the channel/group{"\n"}
              5. Get the Chat ID from the channel/group settings
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
