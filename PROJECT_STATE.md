# Project State

## Current Status

The project is in a transitional state. We have:

1. Authentication System (Working)
   - Google OAuth integration via Supabase
   - Dev mode for local testing
   - Protected routes
   - Login/logout flow

2. Teacher Dashboard (Needs Restoration)
   - Block system needs to be restored from commit d10c860
   - Blocks should be draggable and resizable
   - Left sidebar for block templates
   - Grid snapping and collision detection

## Next Steps

1. Restore Block System
   - Checkout the stable version: `git checkout d10c860dd770d0ee71768d62482bf4b7cf585c4d`
   - Keep the following auth files:
     - src/lib/supabase.ts
     - src/components/auth/LoginCard.tsx
     - src/components/auth/ProtectedRoute.tsx
     - src/pages/Login.tsx
     - src/contexts/DevModeContext.tsx

2. Integration Tasks
   - Ensure auth system works with restored block system
   - Test dev mode functionality
   - Verify Google OAuth flow

## Key Components

### Authentication
- `LoginCard`: Handles Google OAuth and dev mode login
- `ProtectedRoute`: Route wrapper for auth checks
- `DevModeContext`: Manages dev mode state
- `supabase.ts`: Supabase client configuration

### Block System (To Be Restored)
- `WorkspaceArea`: Main workspace component
- `ProblemCreator`: Block creation and management
- `ResizableBlock`: Base block component with drag/resize
- Block Types:
  - TextBlock
  - AnswerBlock
  - ImageBlock

## Environment Setup

1. Required Environment Variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

2. Development Server:
```bash
npm run dev
```
Server runs on port 8080 (configured in vite.config.ts)

## Known Issues

1. Port Configuration
   - Supabase and Google OAuth redirects must be set to http://localhost:8080
   - Update redirect URLs in both Supabase and Google Cloud Console if needed

2. Authentication Flow
   - Dev mode persists across refreshes
   - Google OAuth requires proper redirect URI configuration
