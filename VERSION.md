# Version History

## v0.1.0 - Initial Block System
- Basic block system with drag-and-drop
- Text, Answer, and Image blocks
- LaTeX support with backtick syntax
- Dev mode for bypassing auth

### Key Components
- TeacherDashboard: v0.1.0
  - Dev mode toggle
  - Basic layout
- WorkspaceArea: v0.1.0
  - Grid system
  - Block management
  - Multiple workspace modes
- Blocks:
  - TextBlock: v0.1.0 (TipTap + LaTeX)
  - AnswerBlock: v0.1.0 (Text + LaTeX input)
  - ImageBlock: v0.1.0 (Upload + Fullscreen)

### Known Bugs (with minimal reproduction steps)

1. Block Overlap Issue
```typescript
// To reproduce:
1. Create two text blocks
2. Drag one block near another
3. Blocks may overlap instead of snapping to grid
```

2. Color Picker Reset
```typescript
// To reproduce:
1. Add a text block
2. Select text and open color picker
3. Choose a color
4. Click outside the editor
5. Color picker state resets
```

3. LaTeX Rendering
```typescript
// To reproduce:
1. Add a text block
2. Enter LaTeX: `x^2 + y^2 = z^2`
3. Add more text after
4. LaTeX rendering may flicker
```

4. Image Zoom
```typescript
// To reproduce:
1. Add an image block
2. Upload an image
3. Enter fullscreen
4. Use zoom slider
5. Zoom transitions may be jerky
```

### Component Dependencies
```
TeacherDashboard
└─ WorkspaceArea
   ├─ ProblemCreator
   └─ Blocks
      ├─ TextBlock (depends on: TipTap, KaTeX)
      ├─ AnswerBlock (depends on: KaTeX)
      └─ ImageBlock (depends on: Slider)
```

### Required Environment
- Node.js 16+
- React 18
- Vite
- TipTap
- KaTeX
- Radix UI
- Tailwind CSS

### Quick Start for Resume
1. Check PROJECT_STATE.md for current status
2. Run development server: `npm run dev`
3. Access teacher dashboard with dev mode
4. Known issues are tracked with [ ] checkboxes

### Next Version Plans (v0.2.0)
- Fix current bugs
- Add keyboard shortcuts
- Improve block positioning
- Enhance LaTeX integration
- Add block grouping
