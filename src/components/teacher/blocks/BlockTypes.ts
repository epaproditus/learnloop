export interface BlockProps {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  onContentChange: (content: string) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}
