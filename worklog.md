# IKMI SOCIAL - Development Worklog

---
## Task ID: 2 - full-stack-developer
### Work Task
Build custom authentication system with JWT-based auth, API routes, and Zustand store.

### Work Log
- Installed bcrypt and jose packages (with @types/bcrypt for TypeScript)
- Created `/src/lib/auth.ts` with auth utilities:
  - Password hashing with bcrypt (hashPassword, verifyPassword)
  - JWT token generation and verification with jose
  - Cookie management (setAuthCookie, getAuthCookie, removeAuthCookie)
  - getCurrentUser() function to retrieve user from JWT cookie
  - checkUserExists() for registration validation
  - validateCredentials() for login authentication
- Created API routes:
  - `/api/auth/register/route.ts` - User registration with validation (name, username, email, password)
  - `/api/auth/login/route.ts` - Login with email/username and password
  - `/api/auth/logout/route.ts` - Logout by clearing auth cookie
  - `/api/auth/me/route.ts` - Get current authenticated user
- Created `/src/stores/auth-store.ts` with Zustand:
  - User state management with persist middleware
  - setLoading, setUser, logout actions
  - fetchCurrentUser function for client-side auth check
  - authApi helper object for API calls

### Stage Summary
- Built complete custom authentication system (NOT NextAuth as requested)
- JWT tokens stored in httpOnly cookies for security
- Zod validation on registration (name, username format, email, password length)
- Password hashing with bcrypt (12 salt rounds)
- User can login with either email or username
- Proper error responses with appropriate HTTP status codes
- ESLint passed with no errors
- Database schema already in sync

---
Task ID: 3
Agent: frontend-styling-expert
Task: Build main layout components

Work Log:
- Updated globals.css with green/teal primary color scheme (oklch color space)
- Created theme-provider.tsx for dark/light mode support using next-themes
- Created theme-toggle.tsx with animated sun/moon toggle button using Framer Motion
- Created sidebar.tsx (left sidebar) with:
  - Logo header with IKMI SOCIAL branding
  - Navigation items: Home, Profile, Friends, Groups, Notifications (with badge), Settings
  - Active state indicator with smooth animations
  - User profile section with avatar and logout button
  - Theme toggle integration
- Created right-sidebar.tsx with:
  - People You May Know section with mutual friends count
  - Trending Groups section with member count and categories
  - Quick links footer (About, Help, Privacy, Terms)
  - Smooth staggered animations for content
- Created mobile-nav.tsx with:
  - Fixed bottom navigation bar for mobile devices
  - Compact navigation icons with labels
  - Active state indicator
  - Badge support for notifications
- Created main-layout.tsx combining all layout components:
  - Responsive grid layout (left sidebar, main content, right sidebar)
  - Mobile navigation replaces sidebars on small screens
  - Sticky sidebars on desktop
  - Proper padding for mobile nav
- Created index.ts for clean exports
- Updated root layout.tsx with ThemeProvider and updated metadata
- Updated page.tsx with demo feed showcasing the layout

Stage Summary:
- All layout components successfully created and integrated
- Green/teal color scheme implemented using oklch for modern color accuracy
- Dark/light mode fully supported with smooth theme toggle
- Mobile-first responsive design with bottom navigation on mobile
- Framer Motion animations for smooth transitions and interactions
- Build completed successfully with no errors

---
Task ID: 6
Agent: full-stack-developer
Task: Build friendship system

Work Log:
- Created `/src/app/api/friends/route.ts` - GET endpoint to list all friends
- Created `/src/app/api/friends/requests/route.ts`:
  - GET endpoint to list pending friend requests (incoming and outgoing)
  - POST endpoint to send friend requests with validation
- Created `/src/app/api/friends/requests/[id]/accept/route.ts` - POST to accept friend requests
- Created `/src/app/api/friends/requests/[id]/reject/route.ts` - POST to reject friend requests
- Created `/src/app/api/friends/[id]/route.ts` - DELETE to unfriend a user
- Created `/src/app/api/friends/suggestions/route.ts` - GET to fetch friend suggestions based on mutual friends
- Created friendship components:
  - `/src/components/friends/add-friend-button.tsx` - Multi-state button with Add Friend/Friend Request Sent/Accept Reject/Friends states
  - `/src/components/friends/friend-card.tsx` - User card with avatar, name, headline, mutual friends count, action buttons
  - `/src/components/friends/friend-request-item.tsx` - Incoming/outgoing friend request item with accept/reject/cancel
  - `/src/components/friends/friends-list.tsx` - Searchable grid of friends with unfriend capability
  - `/src/components/friends/friend-requests.tsx` - List of pending requests (incoming/outgoing sections)
  - `/src/components/friends/friend-suggestions.tsx` - Suggested friends based on mutual friends
  - `/src/components/friends/index.ts` - Clean exports for all components

Stage Summary:
- Complete friendship API system with proper error handling and validation
- Friendship states handled: none, pending_sent, pending_received, friends
- Notifications created for friend requests and acceptances
- Mutual friends calculation for suggestions
- Framer Motion animations for smooth UI transitions
- Green/teal color scheme matching project design
- Loading states and error handling for async actions
- ESLint passed with no errors

---
Task ID: 4
Agent: full-stack-developer
Task: Build post/feed system

Work Log:
- Created `/src/app/api/posts/route.ts`:
  - GET endpoint with pagination for feed (public posts, ordered by newest)
  - POST endpoint to create new posts with validation (max 5000 chars, max 4 images)
- Created `/src/app/api/posts/[id]/route.ts`:
  - GET endpoint to fetch single post with author info, like count, comment count
  - DELETE endpoint to delete own posts with cascade delete for likes/comments
- Created `/src/app/api/posts/[id]/like/route.ts`:
  - POST endpoint to like a post (unique constraint per user/post)
  - DELETE endpoint to unlike a post
- Created `/src/app/api/posts/[id]/comments/route.ts`:
  - GET endpoint with pagination for comments (nested replies support)
  - POST endpoint to add comments with optional parentId for replies
- Created post components:
  - `/src/components/post/create-post.tsx` - Create post form with text input and image upload (max 4 images, client-side compression)
  - `/src/components/post/post-card.tsx` - Single post display with like, comment, share, delete actions
  - `/src/components/post/comment-section.tsx` - Comments list with nested replies and add comment form
  - `/src/components/post/feed.tsx` - Feed component with pagination and refresh capability
  - `/src/components/post/index.ts` - Clean exports for all components
- Updated `/src/app/page.tsx` to use Feed component with current user context

Stage Summary:
- Complete post/feed API system with proper authentication and authorization
- Image upload with client-side compression (max 1200px, 70% quality JPEG)
- Like/unlike posts with optimistic UI updates
- Comments with nested replies (2 levels deep in UI, unlimited in DB)
- Delete own posts with confirmation dialog
- Framer Motion animations for post cards and comments
- Responsive design matching project's green/teal color scheme
- Loading states, error handling, and toast notifications
- ESLint passed with no errors
- All code compiles successfully

---
Task ID: 5
Agent: full-stack-developer
Task: Build profile and CV system

Work Log:
- Created API routes:
  - `/src/app/api/users/[id]/route.ts` - GET user profile, PUT update profile (authorization check)
  - `/src/app/api/users/me/route.ts` - GET current user profile, PUT update own profile
  - `/src/app/api/users/me/education/route.ts` - GET, POST, PUT, DELETE education entries
  - `/src/app/api/users/me/experience/route.ts` - GET, POST, PUT, DELETE experience entries
  - `/src/app/api/users/me/achievement/route.ts` - GET, POST, PUT, DELETE achievements
  - `/src/app/api/users/me/portfolio/route.ts` - GET, POST, PUT, DELETE portfolio projects
- Created profile components:
  - `/src/components/profile/profile-header.tsx` - Cover photo, avatar, name, headline, bio, skills display
  - `/src/components/profile/profile-tabs.tsx` - Tabs for Posts, About, CV, Portfolio
  - `/src/components/profile/profile-stats.tsx` - Friends count, posts count, experience count, achievements count
  - `/src/components/profile/cv-section.tsx` - Education, Experience, Achievements sections with edit/delete
  - `/src/components/profile/portfolio-card.tsx` - Portfolio project card with image carousel and tech badges
  - `/src/components/profile/edit-profile-dialog.tsx` - Comprehensive dialogs for:
    - EditProfileDialog - Basic info, contact, skills management
    - EducationDialog - Add/edit education entries
    - ExperienceDialog - Add/edit experience with current job toggle
    - AchievementDialog - Add/edit achievements/certifications
    - PortfolioDialog - Add/edit portfolio projects with technologies
  - `/src/components/profile/index.ts` - Clean exports for all components
- Updated `/src/app/page.tsx` with full profile page integration

Stage Summary:
- Complete profile and CV system with CRUD operations for all CV entries
- Skills stored as JSON array, displayed as badges with add/remove functionality
- Framer Motion animations for smooth UI transitions
- Image carousel support in portfolio cards
- Print-friendly CV layout with professional styling
- Form validation for all entry types
- Loading states and error handling for async operations
- Responsive design matching project's green/teal color scheme
- ESLint passed with no errors
- All code compiles and runs successfully

---
Task ID: 8
Agent: full-stack-developer
Task: Build notifications system

Work Log:
- Created `/src/lib/notifications.ts` - Notification helper functions:
  - createNotification() - Generic notification creation
  - createFriendRequestNotification() - Friend request notification
  - createFriendAcceptedNotification() - Friend accepted notification
  - createLikeNotification() - Post like notification
  - createCommentNotification() - Comment notification
  - createGroupInviteNotification() - Group invite notification
  - createMentionNotification() - Mention notification
  - getUnreadNotificationCount() - Get unread count for a user
  - markAllNotificationsAsRead() - Mark all as read
  - markNotificationAsRead() - Mark single notification as read
  - deleteNotification() - Delete notification
- Created API routes:
  - `/src/app/api/notifications/route.ts`:
    - GET endpoint to list notifications with pagination and unread count
    - PUT endpoint to mark all notifications as read
  - `/src/app/api/notifications/[id]/route.ts`:
    - PUT endpoint to mark single notification as read
    - DELETE endpoint to delete notification
- Created notification components:
  - `/src/components/notifications/notification-badge.tsx` - Unread count badge with animation
  - `/src/components/notifications/notification-item.tsx` - Single notification display with:
    - Different icons per notification type (UserPlus, Heart, MessageCircle, Users, AtSign)
    - Different background colors per type
    - Unread indicator dot
    - Mark as read and delete buttons on hover
    - Click to navigate to relevant content
    - Time ago display
  - `/src/components/notifications/notification-dropdown.tsx` - Popover dropdown with:
    - Real-time unread count (polls every 30 seconds)
    - Scrollable notification list
    - Mark all as read button
    - Empty state
    - Link to full notifications page
  - `/src/components/notifications/index.ts` - Clean exports
- Updated `/src/components/layout/sidebar.tsx`:
  - Dynamic unread notification count from API
  - Uses NotificationBadge component
  - Polls for updates every 30 seconds

Stage Summary:
- Complete notification system with 6 notification types: friend_request, friend_accepted, like, comment, group_invite, mention
- Helper functions for easy integration with other app features
- Real-time unread count in sidebar with polling
- Popover dropdown for quick notification access
- Mark as read (single and all) functionality
- Delete notification capability
- Click notification to navigate to relevant content
- Framer Motion animations for new notifications
- Different icons and colors for notification types
- ESLint passed with no errors
- All code compiles successfully

---
Task ID: 7
Agent: full-stack-developer
Task: Build groups system

Work Log:
- Created `/src/app/api/groups/route.ts`:
  - GET endpoint with pagination and search for listing groups (public + private if member)
  - POST endpoint to create new groups with validation (name max 100 chars, description max 500 chars)
  - Creator automatically becomes admin member
- Created `/src/app/api/groups/[id]/route.ts`:
  - GET endpoint to fetch group details with member info
  - PUT endpoint to update group (creator or admin only)
  - DELETE endpoint to delete group (creator only)
- Created `/src/app/api/groups/[id]/join/route.ts`:
  - POST endpoint to join public groups
  - DELETE endpoint to leave groups (creator cannot leave, must delete or transfer)
- Created `/src/app/api/groups/[id]/members/route.ts`:
  - GET endpoint to list members with role grouping (admins, moderators, members)
  - Pagination support and role filtering
  - Access control for private groups
- Created `/src/app/api/groups/[id]/posts/route.ts`:
  - GET endpoint for group posts with pagination
  - POST endpoint to create posts in groups (members only)
- Created group components:
  - `/src/components/groups/group-card.tsx` - Card with cover, avatar, name, member count, join/leave button
  - `/src/components/groups/group-header.tsx` - Full group header with cover, info, actions (edit, delete, share)
  - `/src/components/groups/group-members.tsx` - Members list grouped by role (admins, moderators, members)
  - `/src/components/groups/create-group-dialog.tsx` - Form to create groups with name, description, privacy, avatar, cover image
  - `/src/components/groups/groups-list.tsx` - Grid of groups with search and pagination
  - `/src/components/groups/index.ts` - Clean exports
- Updated `/src/app/page.tsx` with full groups page integration:
  - Groups list view with search and create button
  - Group detail view with tabs for posts and members
  - Join/leave functionality
  - Responsive design

Stage Summary:
- Complete groups system with public/private privacy settings
- Member roles: creator (stored via createdById), admin, moderator, member
- Creator automatically becomes admin when creating a group
- Only public groups can be joined directly (private would need invite system)
- Creator cannot leave group (must delete or transfer ownership)
- Group posts use existing Post model with groupId field
- Private groups only visible to members
- Framer Motion animations for smooth UI transitions
- Responsive grid layout for groups list
- Green/teal color scheme matching project design
- Loading states, error handling, and toast notifications
- ESLint passed with no errors
- All code compiles and runs successfully

---
Task ID: 9
Agent: main
Task: Fix image upload issue in production (standalone mode)

Work Log:
- Identified root cause: In Next.js standalone mode, `process.cwd()` points to `.next/standalone/` instead of project root
- Files uploaded at runtime in production went to `standalone/public/uploads` which is temporary
- When server restarts/rebuilds, standalone folder is recreated, losing runtime uploads
- Created `getProjectRoot()` function in both upload and serve routes:
  - Detects standalone mode by checking if cwd contains `.next/standalone`
  - Navigates up to find actual project root
  - Falls back to checking common locations like `/home/z/my-project`, `/app`, `/var/www`
- Updated `/src/app/api/upload/route.ts`:
  - Uses `getProjectRoot()` to find persistent upload directory
  - Creates uploads in `projectRoot/public/uploads`
  - Multiple fallback directories if primary is not writable
- Updated `/src/app/api/serve/[...path]/route.ts`:
  - Uses same `getProjectRoot()` logic to find files
  - Searches multiple directories in priority order
  - Added more logging for debugging

Stage Summary:
- Fixed image upload persistence issue in standalone/production mode
- Both upload and serve APIs now use consistent path resolution
- Files persist across server restarts and rebuilds
- Pushed changes to GitHub (commit 622c053)
- Repository: https://github.com/UjangSupriatna/ikmi-real
