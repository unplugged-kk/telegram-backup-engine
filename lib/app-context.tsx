/**
 * App Context Provider
 * Manages global app state including credentials, schedules, and backup history
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { AppState, TelegramCredentials, BackupSchedule, BackupHistory } from "./types";
import { SecureStorage } from "./secure-storage";

type AppAction =
  | { type: "SET_CREDENTIALS"; payload: TelegramCredentials | null }
  | { type: "SET_SETUP_COMPLETE"; payload: boolean }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "ADD_SCHEDULE"; payload: BackupSchedule }
  | { type: "UPDATE_SCHEDULE"; payload: BackupSchedule }
  | { type: "DELETE_SCHEDULE"; payload: string }
  | { type: "ADD_BACKUP_HISTORY"; payload: BackupHistory }
  | { type: "SET_LAST_BACKUP_TIME"; payload: number }
  | { type: "SET_TOTAL_FILES_UPLOADED"; payload: number }
  | { type: "LOAD_STATE"; payload: Partial<AppState> }
  | { type: "CLEAR_ALL" };

const initialState: AppState = {
  credentials: null,
  isSetup: false,
  totalFilesUploaded: 0,
  isConnected: false,
  schedules: [],
  backupHistory: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_CREDENTIALS":
      return { ...state, credentials: action.payload, isSetup: !!action.payload };
    case "SET_SETUP_COMPLETE":
      return { ...state, isSetup: action.payload };
    case "SET_CONNECTED":
      return { ...state, isConnected: action.payload };
    case "ADD_SCHEDULE":
      return { ...state, schedules: [...state.schedules, action.payload] };
    case "UPDATE_SCHEDULE":
      return {
        ...state,
        schedules: state.schedules.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case "DELETE_SCHEDULE":
      return { ...state, schedules: state.schedules.filter((s) => s.id !== action.payload) };
    case "ADD_BACKUP_HISTORY":
      return { ...state, backupHistory: [action.payload, ...state.backupHistory] };
    case "SET_LAST_BACKUP_TIME":
      return { ...state, lastBackupTime: action.payload };
    case "SET_TOTAL_FILES_UPLOADED":
      return { ...state, totalFilesUploaded: action.payload };
    case "LOAD_STATE":
      return { ...state, ...action.payload };
    case "CLEAR_ALL":
      return initialState;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  setCredentials: (credentials: TelegramCredentials | null) => Promise<void>;
  addSchedule: (schedule: BackupSchedule) => Promise<void>;
  updateSchedule: (schedule: BackupSchedule) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  addBackupHistory: (history: BackupHistory) => Promise<void>;
  setLastBackupTime: (timestamp: number) => Promise<void>;
  setTotalFilesUploaded: (count: number) => Promise<void>;
  setConnected: (connected: boolean) => void;
  clearAllData: () => Promise<void>;
  loadState: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from storage on mount
  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const credentials = await SecureStorage.getCredentials();
      const schedules = await SecureStorage.getSchedules();
      const history = await SecureStorage.getHistory();
      const lastBackupTime = await SecureStorage.getLastBackupTime();
      const totalFilesUploaded = await SecureStorage.getTotalFilesUploaded();

      dispatch({
        type: "LOAD_STATE",
        payload: {
          credentials,
          isSetup: !!credentials,
          schedules,
          backupHistory: history,
          lastBackupTime: lastBackupTime || undefined,
          totalFilesUploaded,
        },
      });
    } catch (error) {
      console.error("Failed to load state:", error);
    }
  };

  const setCredentials = async (credentials: TelegramCredentials | null) => {
    if (credentials) {
      await SecureStorage.saveCredentials(credentials);
    } else {
      await SecureStorage.clearCredentials();
    }
    dispatch({ type: "SET_CREDENTIALS", payload: credentials });
  };

  const addSchedule = async (schedule: BackupSchedule) => {
    const schedules = [...state.schedules, schedule];
    await SecureStorage.saveSchedules(schedules);
    dispatch({ type: "ADD_SCHEDULE", payload: schedule });
  };

  const updateSchedule = async (schedule: BackupSchedule) => {
    const schedules = state.schedules.map((s) => (s.id === schedule.id ? schedule : s));
    await SecureStorage.saveSchedules(schedules);
    dispatch({ type: "UPDATE_SCHEDULE", payload: schedule });
  };

  const deleteSchedule = async (id: string) => {
    const schedules = state.schedules.filter((s) => s.id !== id);
    await SecureStorage.saveSchedules(schedules);
    dispatch({ type: "DELETE_SCHEDULE", payload: id });
  };

  const addBackupHistory = async (history: BackupHistory) => {
    const newHistory = [history, ...state.backupHistory];
    await SecureStorage.saveHistory(newHistory);
    dispatch({ type: "ADD_BACKUP_HISTORY", payload: history });
  };

  const setLastBackupTime = async (timestamp: number) => {
    await SecureStorage.saveLastBackupTime(timestamp);
    dispatch({ type: "SET_LAST_BACKUP_TIME", payload: timestamp });
  };

  const setTotalFilesUploaded = async (count: number) => {
    await SecureStorage.saveTotalFilesUploaded(count);
    dispatch({ type: "SET_TOTAL_FILES_UPLOADED", payload: count });
  };

  const setConnected = (connected: boolean) => {
    dispatch({ type: "SET_CONNECTED", payload: connected });
  };

  const clearAllData = async () => {
    await SecureStorage.clearAllData();
    dispatch({ type: "CLEAR_ALL" });
  };

  const value: AppContextType = {
    state,
    setCredentials,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addBackupHistory,
    setLastBackupTime,
    setTotalFilesUploaded,
    setConnected,
    clearAllData,
    loadState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
