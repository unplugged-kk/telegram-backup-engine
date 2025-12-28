# Telegram Backup Engine - Architecture & Documentation

## Overview

The Telegram Backup Engine is a personal backup application that uses Telegram private channels or groups as the storage backend. It provides both manual and scheduled automatic backups of photos, videos, and files directly to Telegram, replacing traditional cloud storage solutions like Apple iCloud or Google One.

---

## Architecture

### High-Level Flow

```
User Device
    ↓
[Mobile App - React Native/Expo]
    ├── Setup Screen (Credentials)
    ├── Manual Backup (Select & Upload)
    ├── Scheduled Backups (Background Tasks)
    └── History & Settings
    ↓
[Telegram Bot API]
    ↓
[Telegram Private Channel/Group]
    (Storage Backend)
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Mobile Framework** | React Native (Expo SDK 54) | Cross-platform iOS/Android development |
| **Language** | TypeScript 5.9 | Type-safe development |
| **Styling** | NativeWind (Tailwind CSS) | Responsive UI components |
| **State Management** | React Context + useReducer | Global app state |
| **Storage** | Expo SecureStore + AsyncStorage | Secure credentials & local data |
| **API Client** | Axios | Telegram Bot API communication |
| **Routing** | Expo Router | File-based navigation |
| **Background Tasks** | Expo Task Manager | Scheduled backups (future) |

---

## Project Structure

```
telegram-backup-engine/
├── app/
│   ├── _layout.tsx              # Root layout with providers
│   ├── setup.tsx                # Initial credential setup
│   ├── manual-backup.tsx        # Manual upload screen
│   ├── schedules.tsx            # Schedule management
│   ├── add-schedule.tsx         # Schedule creation/editing
│   ├── history.tsx              # Backup history view
│   ├── settings.tsx             # App settings
│   └── (tabs)/
│       ├── _layout.tsx          # Tab bar navigation
│       └── index.tsx            # Home dashboard
├── lib/
│   ├── types.ts                 # TypeScript type definitions
│   ├── telegram-client.ts       # Telegram Bot API client
│   ├── secure-storage.ts        # Credential & data storage
│   ├── app-context.tsx          # Global state management
│   └── theme-provider.tsx       # Dark mode support
├── components/
│   ├── screen-container.tsx     # Safe area wrapper
│   └── ui/
│       └── icon-symbol.tsx      # Icon mapping
├── hooks/
│   ├── use-colors.ts            # Theme colors hook
│   └── use-color-scheme.ts      # Dark/light mode detection
├── assets/
│   └── images/
│       ├── icon.png             # App icon
│       ├── splash-icon.png      # Splash screen
│       └── favicon.png          # Web favicon
├── app.config.ts                # Expo configuration
├── tailwind.config.js           # Tailwind CSS config
├── theme.config.js              # Color palette
├── design.md                    # UI/UX design specification
├── todo.md                      # Feature tracking
└── ARCHITECTURE.md              # This file
```

---

## Core Components

### 1. App Context (`lib/app-context.tsx`)

Manages global application state including credentials, schedules, and backup history. Uses React Context + useReducer pattern for predictable state updates.

**Key Functions:**
- `setCredentials()` - Save/update Telegram credentials
- `addSchedule()` - Create new backup schedule
- `addBackupHistory()` - Record backup attempt
- `clearAllData()` - Reset app to initial state

### 2. Telegram Client (`lib/telegram-client.ts`)

Wrapper around Telegram Bot API for media uploads and validation.

**Key Methods:**
- `validateBot()` - Verify bot token and permissions
- `validateChat()` - Verify chat ID and access
- `uploadPhoto()` - Upload image to Telegram
- `uploadVideo()` - Upload video to Telegram
- `uploadDocument()` - Upload file to Telegram
- `sendMessage()` - Send text message with metadata

### 3. Secure Storage (`lib/secure-storage.ts`)

Handles secure storage of sensitive data using platform-specific APIs.

**Storage Strategy:**
- **Credentials** (Bot Token, Chat ID) → Expo SecureStore (encrypted)
- **Schedules** → AsyncStorage (JSON)
- **History** → AsyncStorage (JSON)
- **File Hashes** → AsyncStorage (for duplicate detection)

### 4. Screens

#### Setup Screen (`app/setup.tsx`)
- User enters Telegram Bot Token and Chat ID
- Validates credentials with Telegram API
- Saves credentials securely
- Navigates to home on success

#### Home Dashboard (`app/(tabs)/index.tsx`)
- Displays last backup timestamp
- Shows total files uploaded
- Connection status indicator
- Quick action buttons for backup, schedules, and history

#### Manual Backup (`app/manual-backup.tsx`)
- Browse device media (photos, videos, folders)
- Multi-select with checkboxes
- Upload progress tracking
- Success/error feedback

#### Schedules (`app/schedules.tsx`)
- List all configured schedules
- Enable/disable schedules
- Edit or delete schedules
- Add new schedule button

#### Add/Edit Schedule (`app/add-schedule.tsx`)
- Configure schedule name
- Set frequency (Daily/Weekly/Custom)
- Choose time (HH:mm format)
- Toggle "backup new files only" option

#### Backup History (`app/history.tsx`)
- Reverse chronological list of backups
- Status indicator (success/failed/partial)
- Expandable details showing file list
- Retry button for failed uploads

#### Settings (`app/settings.tsx`)
- Edit Telegram credentials
- Test connection
- Clear all data (with confirmation)
- App version and privacy notice

---

## Data Flow

### Manual Backup Flow

```
User selects files
    ↓
App calculates file hashes
    ↓
Check for duplicates (compare with stored hashes)
    ↓
Upload to Telegram via Bot API
    ↓
Update backup history
    ↓
Increment total files counter
    ↓
Update last backup timestamp
    ↓
Show success/error confirmation
```

### Scheduled Backup Flow (Future)

```
Scheduled time reached
    ↓
Background task triggered
    ↓
App loads credentials from SecureStore
    ↓
Scan device for new files (since last backup)
    ↓
Upload new files to Telegram
    ↓
Update backup history
    ↓
Schedule next backup
```

---

## Security Considerations

### Credential Protection

- **Bot Token**: Stored in Expo SecureStore (encrypted at rest)
- **Chat ID**: Stored in Expo SecureStore (encrypted at rest)
- **No Third-Party Analytics**: Privacy-first design
- **No Cloud Storage Except Telegram**: All data stays on device or Telegram

### File Integrity

- **SHA256 Hashing**: Detect and prevent duplicate uploads
- **File Metadata**: Track upload timestamps and Telegram message IDs
- **Local Backup**: Keep local record of all uploads

### Permissions

- **Media Library Access**: Request permission before accessing photos/videos
- **Background Execution**: Request background task permissions (iOS/Android)
- **Device Storage**: Read-only access to device files

---

## Telegram Bot Setup Guide

### Step 1: Create Bot with BotFather

1. Open Telegram and search for `@BotFather`
2. Send `/start` command
3. Send `/newbot` command
4. Choose a name (e.g., "My Backup Bot")
5. Choose a username (e.g., "my_backup_bot")
6. Copy the **Bot Token** (e.g., `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### Step 2: Create Private Channel/Group

1. Open Telegram
2. Create a new channel or group (private)
3. Name it (e.g., "My Backups")
4. Add the bot to the channel/group

### Step 3: Get Chat ID

**Option A: Using Bot Command**
1. Send any message in the channel/group
2. Forward it to `@userinfobot`
3. The bot will show the chat ID (e.g., `-1001234567890`)

**Option B: Using API**
```bash
curl https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
```
Look for `chat.id` in the response.

### Step 4: Configure App

1. Open Telegram Backup Engine
2. Enter Bot Token
3. Enter Chat ID
4. Tap "Test Connection"
5. Start backing up!

---

## Known Limitations

### iOS Background Execution

- iOS restricts background execution to ~30 seconds
- Scheduled backups work best in foreground
- Consider using iOS Background App Refresh (limited)
- Workaround: Use foreground notifications to remind users to backup

### Android Background Execution

- Android WorkManager provides better background support
- Requires device to be awake or charging
- Doze mode may delay scheduled tasks
- Workaround: Use WorkManager with flexible scheduling

### File Size Limits

- Telegram Bot API: 2GB per file (chunking not yet implemented)
- Network timeouts: 30 seconds per upload
- Workaround: Compress videos or split large files

### Rate Limiting

- Telegram Bot API: ~30 messages per second per bot
- Implement exponential backoff on rate limit errors
- Consider batching uploads with delays

---

## Future Enhancements

### Phase 2: Advanced Features

- [ ] Folder → ZIP → upload pipeline
- [ ] Video compression before upload
- [ ] Client-side encryption before upload
- [ ] Restore workflow (download from Telegram)
- [ ] Multiple Telegram channels support
- [ ] Selective folder backup
- [ ] Bandwidth throttling

### Phase 3: Optimization

- [ ] Incremental backups (only new files)
- [ ] Resume interrupted uploads
- [ ] Parallel uploads (with rate limiting)
- [ ] Offline queue (upload when online)
- [ ] Battery-aware scheduling

### Phase 4: User Experience

- [ ] Backup statistics dashboard
- [ ] Storage usage breakdown
- [ ] Search and restore interface
- [ ] Backup notifications
- [ ] Export backup metadata

---

## Testing Checklist

### Manual Testing

- [ ] Setup with valid Telegram credentials
- [ ] Setup with invalid credentials (error handling)
- [ ] Manual backup of single photo
- [ ] Manual backup of multiple photos
- [ ] Manual backup of videos
- [ ] Manual backup of mixed media
- [ ] Upload progress tracking
- [ ] Error recovery and retry
- [ ] Backup history display
- [ ] Schedule creation and editing
- [ ] Schedule enable/disable
- [ ] Settings credential update
- [ ] Clear all data
- [ ] Dark mode toggle
- [ ] Navigation between screens

### Platform Testing

- [ ] iOS 15+ (iPhone, iPad)
- [ ] Android 10+ (phones, tablets)
- [ ] Web (responsive layout)
- [ ] Notch/safe area handling
- [ ] Tab bar navigation

### Edge Cases

- [ ] App killed during upload (recovery)
- [ ] Network loss mid-upload (retry)
- [ ] Duplicate file detection
- [ ] Large file uploads (>100MB)
- [ ] Rapid schedule triggers
- [ ] Credential expiration

---

## Deployment

### Build for iOS

```bash
eas build --platform ios
```

### Build for Android

```bash
eas build --platform android
```

### Build for Web

```bash
expo export --platform web
```

---

## Support & Troubleshooting

### Common Issues

**"Invalid bot token"**
- Verify token format from @BotFather
- Ensure no extra spaces or characters
- Regenerate token if needed

**"Chat not found"**
- Verify chat ID is correct (negative number for channels)
- Ensure bot is added to the channel/group
- Check bot permissions

**"Upload failed"**
- Check network connectivity
- Verify file size < 2GB
- Check Telegram rate limits
- Retry after delay

---

## License

This is a personal, closed-source application. Not for public distribution.

---

## Contact & Support

For issues or questions, refer to the Telegram Backup Engine documentation or contact the developer.
