# Project Resume Guide

This guide helps you pick up where development left off and understand the current state of the project.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. Configure OAuth redirects:
   - In Supabase Dashboard: Set redirect URL to http://localhost:8080
   - In Google Cloud Console: Set authorized redirect URI to http://localhost:8080

4. Start development server:
```bash
npm run dev
```

## Current State

The project is at a transition point between two major features:

1. Authentication System (Working)
   - Located in:
     - src/lib/supabase.ts
     - src/components/auth/LoginCard.tsx
     - src/components/auth/ProtectedRoute.tsx
     - src/pages/Login.tsx
     - src/contexts/DevModeContext.tsx

2. Block System (Needs Restoration)
   - Last working version: commit d10c860
   - Key files to restore:
     - src/components/teacher/blocks/ResizableBlock.tsx
     - src/components/teacher/ProblemCreator.tsx
     - src/components/teacher/WorkspaceArea.tsx

## Development Flow

1. Authentication:
   - Dev mode: Click "Continue as Teacher" for quick testing
   - Production: Use Google OAuth sign-in
   - Protected routes redirect to /login if not authenticated

2. Teacher Dashboard:
   - Create/edit assignments using block system
   - Blocks should be draggable and resizable
   - Grid snapping helps with alignment
   - Collision detection prevents overlap

## Key Features

### Authentication
- Google OAuth via Supabase
- Dev mode for local testing
- Persistent sessions
- Protected routes

### Block System (To Be Restored)
- Drag and drop interface
- Grid snapping
- Collision detection
- Block types:
  - Text (with rich text editor)
  - Answer (for student responses)
  - Image (for media content)

## Common Issues & Solutions

1. Auth Redirect Issues
   - Ensure redirect URLs match in both Supabase and Google Console
   - Port must be 8080 (configured in vite.config.ts)
   - Check browser console for CORS errors

2. Block System Issues
   - If blocks aren't draggable, check ResizableBlock component
   - Grid snapping uses 20px increments
   - Z-index handles block stacking

## Next Steps

1. Immediate Tasks
   - Restore block system from commit d10c860
   - Integrate auth system with restored blocks
   - Test all block types with auth

2. Future Features
   - Student dashboard
   - Assignment submission
   - Progress tracking
   - Teacher feedback

## Testing

1. Dev Mode Testing
   - Toggle dev mode in top-left corner
   - No auth required in dev mode
   - Data persists in local storage

2. Production Testing
   - Requires valid Google account
   - Supabase must be properly configured
   - Check network tab for auth flows

## Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://console.cloud.google.com/apis/credentials)
- [Vite Config Guide](https://vitejs.dev/config/)
