# Version History

## Current Version

### v0.2.0 (In Progress)
- Added authentication system with Supabase
- Added Google OAuth integration
- Added dev mode for local testing
- Added protected routes
- Fixed port configuration (now using 8080)

### v0.1.0 (Stable - commit d10c860)
- Initial teacher dashboard implementation
- Block system with drag and resize
- Grid snapping and collision detection
- Block templates sidebar
- Block types:
  - Text blocks with rich text editing
  - Answer blocks for student input
  - Image blocks for media content

## Upcoming Changes

### v0.2.1 (Planned)
- Restore block system functionality
- Integrate authentication with block system
- Improve dev mode UX
- Add proper error handling for auth flows

### v0.3.0 (Planned)
- Student dashboard implementation
- Assignment submission system
- Real-time progress tracking
- Teacher feedback system

## Development Notes

### Current Focus
1. Restoring block system while maintaining auth improvements
2. Ensuring smooth integration between components
3. Maintaining dev mode for easy testing

### Technical Debt
1. Need to properly type all components
2. Need to add error boundaries
3. Need to improve state management
4. Need to add proper loading states

### Breaking Changes
- Port changed from 5173 to 8080
- Authentication required for all routes (except login)
- Dev mode now persists across refreshes
