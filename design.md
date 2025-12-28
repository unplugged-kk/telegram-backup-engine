# Telegram Backup Engine - Mobile App Design

## Design Philosophy

This app follows **Apple Human Interface Guidelines (HIG)** and is designed for **mobile portrait orientation (9:16)** with **one-handed usage** in mind. The interface is clean, focused, and task-oriented—not social.

---

## Screen List

### 1. **Setup/Configuration Screen**
- **Purpose**: Initial setup and credential management
- **Content**:
  - Telegram Bot Token input field (masked)
  - Chat ID input field
  - Test Connection button
  - Save & Continue button
  - Edit Credentials button (if already configured)
- **Functionality**: Validate bot permissions, test connectivity, store credentials securely

### 2. **Home Screen (Dashboard)**
- **Purpose**: Main hub showing backup status and quick actions
- **Content**:
  - Last successful backup timestamp
  - Number of files uploaded (total)
  - Quick action buttons:
    - "Backup Now" (primary, prominent)
    - "Schedule Backups" (secondary)
    - "Backup History" (tertiary)
  - Status indicator (connected/disconnected)
  - Settings icon (top-right)
- **Functionality**: Display real-time backup status, provide quick access to main features

### 3. **Manual Backup Screen**
- **Purpose**: Select and upload media manually
- **Content**:
  - Tab bar: "Photos" | "Videos" | "Folders"
  - Media grid/list with checkboxes
  - Selection counter (e.g., "3 items selected")
  - Upload button (disabled if nothing selected)
  - Progress bar during upload
  - Success/error messages
- **Functionality**: Browse device media, select items, upload to Telegram

### 4. **Scheduled Backups Screen**
- **Purpose**: Configure and manage automatic backups
- **Content**:
  - Active schedules list (if any)
  - "Add Schedule" button
  - For each schedule:
    - Schedule name (e.g., "Daily Night Backup")
    - Time (e.g., "2:00 AM")
    - Frequency (Daily/Weekly/Custom)
    - Folders included
    - Toggle on/off
    - Delete button
- **Functionality**: Create, edit, enable/disable, delete schedules

### 5. **Add/Edit Schedule Modal**
- **Purpose**: Configure a backup schedule
- **Content**:
  - Schedule name input
  - Frequency picker (Daily/Weekly/Custom)
  - Time picker (hour + minute)
  - Folder selector (multi-select)
  - Options:
    - "Backup new files only" toggle
    - "Include all files" toggle
  - Save button
- **Functionality**: Create or modify a schedule with custom settings

### 6. **Backup History Screen**
- **Purpose**: View past backup attempts
- **Content**:
  - List of backups (reverse chronological)
  - For each backup:
    - Date & time
    - Number of files uploaded
    - Status (Success/Failed/Partial)
    - Retry button (if failed)
    - Details button (expand to show file list)
- **Functionality**: Review backup history, retry failed backups

### 7. **Settings Screen**
- **Purpose**: App configuration and security
- **Content**:
  - Telegram Credentials section:
    - Edit Bot Token
    - Edit Chat ID
    - Test Connection button
  - Security section:
    - Enable Biometric Lock toggle
    - Clear All Data button
  - About section:
    - App version
    - Privacy notice
- **Functionality**: Manage credentials, security settings, app info

---

## Primary Content and Functionality

### Home Screen (Dashboard)
- **Data**: Last backup time, total files uploaded, current connection status
- **Functionality**:
  - Display real-time backup status
  - Quick access to backup, schedule, and history
  - Settings access

### Manual Backup
- **Data**: Photos, videos, folders from device
- **Functionality**:
  - Browse and select media
  - Show upload progress
  - Handle errors with retry
  - Confirm successful upload

### Scheduled Backups
- **Data**: List of configured schedules with times and folders
- **Functionality**:
  - Create new schedules
  - Edit existing schedules
  - Enable/disable schedules
  - Delete schedules
  - Trigger background tasks

### Backup History
- **Data**: Timestamp, file count, status for each backup
- **Functionality**:
  - View past backups
  - Expand to see file details
  - Retry failed backups

---

## Key User Flows

### Flow 1: Initial Setup
1. User opens app
2. Enters Telegram Bot Token
3. Enters Chat ID
4. Taps "Test Connection"
5. App validates bot permissions
6. Saves credentials securely
7. Navigates to Home Screen

### Flow 2: Manual Backup
1. User taps "Backup Now" on Home
2. Navigates to Manual Backup Screen
3. Selects photos/videos/folders
4. Taps "Upload"
5. App shows progress bar
6. On success: Shows confirmation + file count
7. On error: Shows error message + retry button

### Flow 3: Schedule Setup
1. User taps "Schedule Backups" on Home
2. Taps "Add Schedule"
3. Enters schedule name (e.g., "Daily Night Backup")
4. Selects frequency (Daily) and time (2:00 AM)
5. Selects folders to backup
6. Toggles "Backup new files only"
7. Taps "Save"
8. Schedule appears in list and is enabled

### Flow 4: View Backup History
1. User taps "Backup History" on Home
2. Sees list of past backups (reverse chronological)
3. Taps on a backup to expand and see file details
4. If backup failed, taps "Retry" to re-upload

### Flow 5: Update Credentials
1. User taps Settings icon
2. Taps "Edit Bot Token" or "Edit Chat ID"
3. Updates credential
4. Taps "Test Connection"
5. Saves changes

---

## Color Choices

The app uses a **professional, minimal color scheme** suitable for a backup utility:

| Element | Color | Usage |
|---------|-------|-------|
| **Primary** | `#0a7ea4` (Teal) | Buttons, active states, key actions |
| **Background** | `#ffffff` (White) / `#151718` (Dark) | Screen background |
| **Surface** | `#f5f5f5` (Light Gray) / `#1e2022` (Dark Gray) | Cards, input fields |
| **Foreground** | `#11181C` (Dark) / `#ECEDEE` (Light) | Primary text |
| **Muted** | `#687076` (Gray) / `#9BA1A6` (Light Gray) | Secondary text, labels |
| **Border** | `#E5E7EB` (Light) / `#334155` (Dark) | Dividers, borders |
| **Success** | `#22C55E` (Green) | Success messages, checkmarks |
| **Warning** | `#F59E0B` (Amber) | Warnings, pending states |
| **Error** | `#EF4444` (Red) | Errors, failed uploads |

---

## Navigation Structure

```
Home (Dashboard)
├── Backup Now → Manual Backup Screen
├── Schedule Backups → Scheduled Backups Screen
│   └── Add Schedule → Add/Edit Schedule Modal
├── Backup History → Backup History Screen
└── Settings → Settings Screen
```

---

## Interaction Patterns

- **Primary buttons**: Teal background, scale on press (0.97), haptic feedback
- **List items**: Tap to expand/select, opacity change on press
- **Toggles**: Smooth animation, haptic feedback on change
- **Progress**: Animated progress bar with percentage text
- **Errors**: Toast notifications with retry option
- **Success**: Confirmation message with checkmark icon

---

## Accessibility & One-Handed Usage

- All interactive elements positioned within thumb-reach (bottom 60% of screen)
- Large touch targets (minimum 44pt)
- High contrast text (WCAG AA compliant)
- Clear labels for all inputs
- Haptic feedback for confirmations
- Dark mode support for reduced eye strain
