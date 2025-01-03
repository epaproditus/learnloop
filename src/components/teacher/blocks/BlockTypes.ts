export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BlockProps {
  id: string;
  content: string;
  position: Position;
  size: Size;
  isSelected: boolean;
  isPreview?: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onChange: (content: string) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onSizeChange: (size: Size) => void;
  onPositionChange: (position: Position) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export interface BlockSettings {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
}

export interface TextBlockProps extends BlockProps {
  settings?: BlockSettings;
}

export interface AnswerBlockProps extends BlockProps {
  settings?: BlockSettings & {
    answerType?: 'text' | 'multiple_choice';
    options?: string[];
  };
}

export interface ImageBlockProps extends BlockProps {
  settings?: BlockSettings & {
    maxSize?: number;
    allowedTypes?: string[];
  };
}
