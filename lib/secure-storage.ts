/**
 * Secure Storage Utility
 * Handles secure storage of sensitive credentials using Expo SecureStore
 */

import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TelegramCredentials, BackupSchedule, BackupHistory } from "./types";

const KEYS = {
  BOT_TOKEN: "telegram_bot_token",
  CHAT_ID: "telegram_chat_id",
  SCHEDULES: "backup_schedules",
  HISTORY: "backup_history",
  LAST_BACKUP_TIME: "last_backup_time",
  TOTAL_FILES_UPLOADED: "total_files_uploaded",
  FILE_HASHES: "file_hashes",
};

export class SecureStorage {
  /**
   * Save Telegram credentials securely
   */
  static async saveCredentials(credentials: TelegramCredentials): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.BOT_TOKEN, credentials.botToken);
      await SecureStore.setItemAsync(KEYS.CHAT_ID, credentials.chatId);
    } catch (error) {
      throw new Error(`Failed to save credentials: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get Telegram credentials
   */
  static async getCredentials(): Promise<TelegramCredentials | null> {
    try {
      const botToken = await SecureStore.getItemAsync(KEYS.BOT_TOKEN);
      const chatId = await SecureStore.getItemAsync(KEYS.CHAT_ID);

      if (!botToken || !chatId) {
        return null;
      }

      return { botToken, chatId };
    } catch (error) {
      throw new Error(`Failed to get credentials: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Clear Telegram credentials
   */
  static async clearCredentials(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.BOT_TOKEN);
      await SecureStore.deleteItemAsync(KEYS.CHAT_ID);
    } catch (error) {
      throw new Error(`Failed to clear credentials: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Save backup schedules
   */
  static async saveSchedules(schedules: BackupSchedule[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SCHEDULES, JSON.stringify(schedules));
    } catch (error) {
      throw new Error(`Failed to save schedules: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get backup schedules
   */
  static async getSchedules(): Promise<BackupSchedule[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SCHEDULES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      throw new Error(`Failed to get schedules: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Save backup history
   */
  static async saveHistory(history: BackupHistory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
      throw new Error(`Failed to save history: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get backup history
   */
  static async getHistory(): Promise<BackupHistory[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      throw new Error(`Failed to get history: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Save last backup time
   */
  static async saveLastBackupTime(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_BACKUP_TIME, timestamp.toString());
    } catch (error) {
      throw new Error(`Failed to save last backup time: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get last backup time
   */
  static async getLastBackupTime(): Promise<number | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.LAST_BACKUP_TIME);
      return data ? parseInt(data, 10) : null;
    } catch (error) {
      throw new Error(`Failed to get last backup time: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Save total files uploaded count
   */
  static async saveTotalFilesUploaded(count: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TOTAL_FILES_UPLOADED, count.toString());
    } catch (error) {
      throw new Error(`Failed to save total files: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get total files uploaded count
   */
  static async getTotalFilesUploaded(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TOTAL_FILES_UPLOADED);
      return data ? parseInt(data, 10) : 0;
    } catch (error) {
      throw new Error(`Failed to get total files: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Save file hashes for duplicate detection
   */
  static async saveFileHashes(hashes: Record<string, string>): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.FILE_HASHES, JSON.stringify(hashes));
    } catch (error) {
      throw new Error(`Failed to save file hashes: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get file hashes
   */
  static async getFileHashes(): Promise<Record<string, string>> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FILE_HASHES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      throw new Error(`Failed to get file hashes: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Clear all data
   */
  static async clearAllData(): Promise<void> {
    try {
      await this.clearCredentials();
      await AsyncStorage.multiRemove([
        KEYS.SCHEDULES,
        KEYS.HISTORY,
        KEYS.LAST_BACKUP_TIME,
        KEYS.TOTAL_FILES_UPLOADED,
        KEYS.FILE_HASHES,
      ]);
    } catch (error) {
      throw new Error(`Failed to clear all data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
