import { Block, Position, Size } from "../../types/Assignment";
import { ResizableBlock } from "./blocks/ResizableBlock";
import { TextBlock } from "./blocks/TextBlock";
import { AnswerBlock } from "./blocks/AnswerBlock";
import { ImageBlock } from "./blocks/ImageBlock";

interface ProblemCreatorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  selectedBlockIndex: number | null;
  onSelectBlock: (index: number | null) => void;
  onUpdateBlock: (index: number, content: string) => void;
  onUpdatePosition: (index: number, position: Position) => void;
  onUpdateSize: (index: number, size: Size) => void;
  onDeleteBlock: (index: number) => void;
  onMoveBlock: (fromIndex: number, toIndex: number) => void;
}

export function ProblemCreator({
  blocks,
  onChange,
  selectedBlockIndex,
  onSelectBlock,
  onUpdateBlock,
  onUpdatePosition,
  onUpdateSize,
  onDeleteBlock,
  onMoveBlock,
}: ProblemCreatorProps) {
  const renderBlock = (block: Block, index: number) => {
    const isSelected = selectedBlockIndex === index;
    const commonProps = {
      id: block.id,
      content: block.content || "",
      position: block.position!,
      size: block.size!,
      isSelected,
      onSelect: () => onSelectBlock(index),
      onDeselect: () => onSelectBlock(null),
      onChange: (content: string) => onUpdateBlock(index, content),
      onDelete: () => onDeleteBlock(index),
      onMoveUp: index > 0 ? () => onMoveBlock(index, index - 1) : undefined,
      onMoveDown: index < blocks.length - 1 ? () => onMoveBlock(index, index + 1) : undefined,
      onSizeChange: (size: Size) => onUpdateSize(index, size),
      onPositionChange: (position: Position) => onUpdatePosition(index, position),
      onDragStart: () => onSelectBlock(index),
      onDragEnd: () => onSelectBlock(null),
    };

    switch (block.type) {
      case "text":
        return <TextBlock key={block.id} {...commonProps} />;
      case "answer":
        return <AnswerBlock key={block.id} {...commonProps} />;
      case "image":
        return <ImageBlock key={block.id} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-[600px]">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
