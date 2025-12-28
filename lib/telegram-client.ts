/**
 * Telegram Bot API Client
 * Handles communication with Telegram Bot API for media uploads and validation
 */

import axios, { AxiosInstance } from "axios";
import * as FileSystem from "expo-file-system/legacy";
import { TelegramBotInfo, TelegramChatInfo } from "./types";

const TELEGRAM_API_BASE = "https://api.telegram.org";

export class TelegramClient {
  private client: AxiosInstance;
  private botToken: string;
  private chatId: string;

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken;
    this.chatId = chatId;
    this.client = axios.create({
      baseURL: `${TELEGRAM_API_BASE}/bot${botToken}`,
      timeout: 30000,
    });
  }

  /**
   * Validate bot token and get bot info
   */
  async validateBot(): Promise<TelegramBotInfo> {
    try {
      const response = await this.client.get("/getMe");
      if (!response.data.ok) {
        throw new Error(response.data.description || "Failed to validate bot");
      }
      return response.data.result;
    } catch (error) {
      throw new Error(`Bot validation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get chat info to validate chat ID and permissions
   */
  async validateChat(): Promise<TelegramChatInfo> {
    try {
      const response = await this.client.get("/getChat", {
        params: { chat_id: this.chatId },
      });
      if (!response.data.ok) {
        throw new Error(response.data.description || "Failed to get chat info");
      }
      return response.data.result;
    } catch (error) {
      throw new Error(`Chat validation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Upload a photo to Telegram
   */
  async uploadPhoto(
    fileUri: string,
    fileName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("chat_id", this.chatId);

      // Read file as blob
      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const blob = this.base64ToBlob(fileData, "image/jpeg");
      formData.append("photo", blob, fileName);
      formData.append("caption", `📸 ${fileName}`);

      const response = await this.client.post("/sendPhoto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });

      if (!response.data.ok) {
        throw new Error(response.data.description || "Failed to upload photo");
      }

      return response.data.result.message_id;
    } catch (error) {
      throw new Error(`Photo upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Upload a video to Telegram
   */
  async uploadVideo(
    fileUri: string,
    fileName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("chat_id", this.chatId);

      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const blob = this.base64ToBlob(fileData, "video/mp4");
      formData.append("video", blob, fileName);
      formData.append("caption", `🎬 ${fileName}`);

      const response = await this.client.post("/sendVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });

      if (!response.data.ok) {
        throw new Error(response.data.description || "Failed to upload video");
      }

      return response.data.result.message_id;
    } catch (error) {
      throw new Error(`Video upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Upload a document to Telegram
   */
  async uploadDocument(
    fileUri: string,
    fileName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("chat_id", this.chatId);

      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const blob = this.base64ToBlob(fileData, "application/octet-stream");
      formData.append("document", blob, fileName);
      formData.append("caption", `📄 ${fileName}`);

      const response = await this.client.post("/sendDocument", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });

      if (!response.data.ok) {
        throw new Error(response.data.description || "Failed to upload document");
      }

      return response.data.result.message_id;
    } catch (error) {
      throw new Error(`Document upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Send a text message to Telegram
   */
  async sendMessage(text: string): Promise<string> {
    try {
      const response = await this.client.post("/sendMessage", {
        chat_id: this.chatId,
        text,
        parse_mode: "HTML",
      });

      if (!response.data.ok) {
        throw new Error(response.data.description || "Failed to send message");
      }

      return response.data.result.message_id;
    } catch (error) {
      throw new Error(`Message send failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Convert base64 string to Blob
   */
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  /**
   * Update credentials
   */
  updateCredentials(botToken: string, chatId: string): void {
    this.botToken = botToken;
    this.chatId = chatId;
    this.client = axios.create({
      baseURL: `${TELEGRAM_API_BASE}/bot${botToken}`,
      timeout: 30000,
    });
  }
}
