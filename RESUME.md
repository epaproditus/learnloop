# Quick Resume Guide

## Current Status
- Working on teacher dashboard block system
- Dev mode enabled for bypassing auth
- Basic block types implemented (Text, Answer, Image)
- Multiple workspace modes available

## Key Files
1. Project Overview: `PROJECT_STATE.md`
2. Version History: `VERSION.md`
3. Main Components:
   - `src/pages/TeacherDashboard.tsx`
   - `src/components/teacher/WorkspaceArea.tsx`
   - `src/components/teacher/blocks/*.tsx`

## Immediate Tasks

### Bug Fixes
- [ ] Fix block overlap during drag
- [ ] Improve grid snapping precision
- [ ] Fix color picker state persistence
- [ ] Add ESC key support for fullscreen images
- [ ] Optimize LaTeX rendering

### Next Features
- [ ] Add keyboard shortcuts
- [ ] Implement block grouping
- [ ] Add more LaTeX templates
- [ ] Add image annotations

## Quick Start
1. Start dev server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:8080
3. Use dev mode toggle in top-left

## Component Status

### Working
- ✅ Dev mode toggle
- ✅ Block drag and drop
- ✅ Basic text editing
- ✅ LaTeX support
- ✅ Image upload
- ✅ Workspace modes

### Needs Attention
- ⚠️ Block positioning system
- ⚠️ LaTeX rendering optimization
- ⚠️ Color picker state
- ⚠️ Image zoom controls

## Dependencies to Install
```bash
# Core dependencies
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-text-style @tiptap/extension-color

# UI components
npm install @radix-ui/react-popover @radix-ui/react-slider

# LaTeX support
npm install katex
```

## Development Notes
- Use backticks for LaTeX: \`x^2\`
- Grid size is 20px
- Minimum block size: 200x100
- Dev mode persists in localStorage

## Testing Steps
1. Create each type of block
2. Test LaTeX input
3. Try resizing and moving blocks
4. Test workspace mode switching
5. Verify preview functionality

## Branch Structure
- main: Current stable version
- dev: Active development
- feature/*: New features
- bugfix/*: Bug fixes

## Contact
For questions about current implementation:
- Check comments in component files
- Refer to PROJECT_STATE.md
- Review VERSION.md for history
