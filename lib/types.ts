/**
 * Core types for Telegram Backup Engine
 */

export interface TelegramCredentials {
  botToken: string;
  chatId: string;
}

export interface BackupSchedule {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "custom";
  time: string; // HH:mm format
  folders: string[]; // folder paths to backup
  backupNewOnly: boolean;
  enabled: boolean;
  createdAt: number;
  lastRun?: number;
}

export interface BackupHistory {
  id: string;
  timestamp: number;
  status: "success" | "failed" | "partial";
  filesCount: number;
  files: BackupFile[];
  errorMessage?: string;
  scheduledBackupId?: string; // if triggered by schedule
}

export interface BackupFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: "photo" | "video" | "document" | "folder";
  hash: string; // SHA256 for duplicate detection
  uploadedAt: number;
  telegramMessageId?: string;
}

export interface AppState {
  credentials: TelegramCredentials | null;
  isSetup: boolean;
  lastBackupTime?: number;
  totalFilesUploaded: number;
  isConnected: boolean;
  schedules: BackupSchedule[];
  backupHistory: BackupHistory[];
}

export interface UploadProgress {
  current: number;
  total: number;
  percentage: number;
  currentFile?: string;
}

export interface TelegramBotInfo {
  id: number;
  isBot: boolean;
  firstName: string;
  username: string;
  canJoinGroups: boolean;
  canReadAllGroupMessages: boolean;
  supportsInlineQueries: boolean;
}

export interface TelegramChatInfo {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
}
