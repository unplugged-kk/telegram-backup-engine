# Telegram Backup Engine - Project TODO

## Core Features

### Phase 1: Setup & Configuration
- [x] Setup screen with Telegram Bot Token input
- [x] Setup screen with Chat ID input
- [x] Secure credential storage (Expo SecureStore)
- [x] Test Connection button to validate bot permissions
- [x] Error handling for invalid credentials
- [x] Navigation to Home screen after successful setup

### Phase 2: Home Screen (Dashboard)
- [x] Display last successful backup timestamp
- [x] Display total files uploaded counter
- [x] Connection status indicator
- [x] "Backup Now" button (primary action)
- [x] "Schedule Backups" button
- [x] "Backup History" button
- [x] Settings icon navigation
- [x] Dark mode support

### Phase 3: Manual Backup
- [ ] Request media library permissions (iOS/Android) [TODO: Implement media-library integration]
- [x] Photos tab with media grid (UI structure)
- [x] Videos tab with media grid (UI structure)
- [x] Folders tab with folder browser (UI structure)
- [x] Multi-select functionality with checkboxes
- [x] Selection counter display
- [x] Upload button (disabled when nothing selected)
- [x] Progress bar during upload
- [x] Success confirmation with file count
- [x] Error handling with retry button
- [ ] Local metadata tracking (last backup timestamp, file hashes) [TODO: Implement hashing]

### Phase 4: Telegram Integration
- [x] Telegram Bot API client setup
- [x] Media upload to Telegram (photos, videos, documents) [Structure ready]
- [ ] ZIP archive creation for folders [TODO: Implement]
- [x] Upload progress tracking
- [ ] Handle Telegram rate limits [TODO: Implement exponential backoff]
- [ ] Duplicate detection using file hashes [TODO: Implement SHA256]
- [x] Error recovery and retry logic

### Phase 5: Scheduled Backups
- [x] Scheduled backups screen with list of schedules
- [x] Add Schedule modal/screen
- [x] Schedule name input
- [x] Frequency picker (Daily/Weekly/Custom)
- [x] Time picker (hour + minute)
- [ ] Folder multi-select [TODO: Implement folder picker]
- [x] "Backup new files only" toggle
- [ ] "Include all files" toggle [TODO: Add option]
- [x] Save schedule to local storage
- [x] Edit existing schedule
- [x] Delete schedule
- [x] Enable/disable schedule toggle
- [ ] Android WorkManager integration for background tasks [TODO: Implement]
- [ ] iOS Background Tasks integration [TODO: Implement]
- [x] Schedule persistence across app restarts

### Phase 6: Backup History
- [x] Backup history screen with reverse chronological list
- [x] Display date, time, file count, and status for each backup
- [x] Expand backup details to show file list
- [ ] Retry button for failed backups [TODO: Implement]
- [x] Local storage of backup history
- [ ] Clear history option [TODO: Add button]

### Phase 7: Settings & Security
- [x] Settings screen layout
- [x] Edit Bot Token option
- [x] Edit Chat ID option
- [x] Test Connection button in settings
- [ ] Biometric lock toggle (optional) [TODO: Implement]
- [x] Clear All Data button with confirmation
- [x] App version display
- [x] Privacy notice

### Phase 8: Error Handling & Edge Cases
- [ ] Handle network loss during upload [TODO: Implement]
- [ ] Handle app killed during backup (recovery on restart) [TODO: Implement]
- [ ] Handle Telegram rate limits (exponential backoff) [TODO: Implement]
- [ ] Handle storage permission issues [TODO: Implement]
- [ ] Handle duplicate uploads (skip if hash exists) [TODO: Implement]
- [ ] Handle large files (>2GB chunking if needed) [TODO: Implement]
- [x] Handle invalid Telegram credentials
- [x] Handle bot permission errors

### Phase 9: UI/UX Polish
- [x] Haptic feedback on button taps
- [x] Loading states and spinners
- [ ] Toast notifications for errors/success [TODO: Implement]
- [ ] Smooth animations and transitions [TODO: Optional polish]
- [x] Responsive layout for different screen sizes
- [ ] Accessibility improvements (WCAG AA) [TODO: Audit]
- [x] Dark mode consistency across all screens

### Phase 10: Testing & Documentation
- [ ] Unit tests for Telegram API client [TODO: Implement]
- [ ] Unit tests for schedule logic [TODO: Implement]
- [ ] Unit tests for file hash/duplicate detection [TODO: Implement]
- [ ] Integration tests for upload flow [TODO: Implement]
- [ ] Manual testing on iOS and Android [TODO: Test]
- [x] Documentation: Telegram Bot setup guide (in ARCHITECTURE.md)
- [x] Documentation: Architecture overview (ARCHITECTURE.md)
- [x] Documentation: Known limitations (in ARCHITECTURE.md)

## Optional Advanced Features

- [ ] Folder → ZIP → upload pipeline
- [ ] Telegram message formatting (backup metadata)
- [ ] Restore workflow (download from Telegram)
- [ ] Multiple Telegram channels support
- [ ] Video compression before upload
- [ ] Client-side encryption before upload

## Bug Fixes & Issues

(To be updated as issues are discovered during development)

---

## Development Notes

- **Default approach**: Best-effort background scheduling (works reliably in foreground, background is optional)
- **Credentials**: Stored securely using Expo SecureStore
- **Local metadata**: SQLite or AsyncStorage for tracking backups and file hashes
- **No third-party analytics**: Privacy-first design
- **No cloud storage except Telegram**: All backups go to Telegram only
- **Target platforms**: iOS 15+, Android 10+
