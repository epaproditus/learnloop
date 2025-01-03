import { useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../ui/button";
import { ResizableBlock } from "./blocks/ResizableBlock";
import { TextBlock } from "./blocks/TextBlock";
import { AnswerBlock } from "./blocks/AnswerBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import { PreviewModal } from "./PreviewModal";
import { PublishDialog } from "./PublishDialog";
import { BlockTemplatesSidebar } from "./workspace/BlockTemplatesSidebar";
import type { Assignment, Block, Position, Size } from "../../types/Assignment";

const GRID_SIZE = 20;
const DEFAULT_BLOCK_WIDTH = 600;
const DEFAULT_BLOCK_HEIGHT = 200;

interface DragItem {
  type: string;
  id?: string;
  templateType?: Block['type'];
}

export interface WorkspaceAreaProps {
  assignment: Assignment | null;
  onCreate: (assignment: Partial<Assignment>) => Promise<void>;
  onUpdate: (assignment: Partial<Assignment>) => Promise<void>;
  onPublish: (courseId: string, assignment: Assignment) => Promise<void>;
  onBack: () => void;
}

export function WorkspaceArea(props: WorkspaceAreaProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <WorkspaceAreaComponent {...props} />
    </DndProvider>
  );
}

function WorkspaceAreaComponent({
  assignment,
  onCreate,
  onUpdate,
  onPublish,
  onBack,
}: WorkspaceAreaProps) {
  const [blocks, setBlocks] = useState<Block[]>(assignment?.blocks || []);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [title, setTitle] = useState(assignment?.title || "");
  const [description, setDescription] = useState(assignment?.description || "");
  const [maxPoints, setMaxPoints] = useState(assignment?.max_points || 100);
  const [dueDate, setDueDate] = useState(assignment?.due_date || "");
  const [showPreview, setShowPreview] = useState(false);
  const [showPublish, setShowPublish] = useState(false);

  // Snap position to grid
  const snapToGrid = (value: number): number => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  // Check for collisions
  const hasCollision = (index: number, newPosition: Position, newSize: Size): boolean => {
    const block = blocks[index];
    if (!block) return false;

    return blocks.some((otherBlock, otherIndex) => {
      if (otherIndex === index) return false;

      const horizontalOverlap = 
        newPosition.x < (otherBlock.position?.x || 0) + (otherBlock.size?.width || 0) &&
        newPosition.x + newSize.width > (otherBlock.position?.x || 0);

      const verticalOverlap = 
        newPosition.y < (otherBlock.position?.y || 0) + (otherBlock.size?.height || 0) &&
        newPosition.y + newSize.height > (otherBlock.position?.y || 0);

      return horizontalOverlap && verticalOverlap;
    });
  };

  const [, drop] = useDrop(() => ({
    accept: ['BLOCK', 'TEMPLATE'],
    drop: (item: DragItem, monitor) => {
      const dropOffset = monitor.getClientOffset();
      const workspaceElement = document.getElementById('workspace');
      
      if (!dropOffset || !workspaceElement) return;

      const workspaceRect = workspaceElement.getBoundingClientRect();
      const x = snapToGrid(dropOffset.x - workspaceRect.left);
      const y = snapToGrid(dropOffset.y - workspaceRect.top);

      if (item.type === 'TEMPLATE' && item.templateType) {
        addBlock(item.templateType, { x, y });
      }
    },
  }), [blocks]);

  const addBlock = (type: Block['type'], position: Position) => {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      content: "",
      order_index: blocks.length,
      assignment_id: assignment?.id || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      position,
      size: { width: DEFAULT_BLOCK_WIDTH, height: DEFAULT_BLOCK_HEIGHT },
    };

    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index: number, content: string) => {
    const newBlocks = [...blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      content,
      updated_at: new Date().toISOString(),
    };
    setBlocks(newBlocks);
  };

  const updateBlockPosition = (index: number, position: Position) => {
    const newPosition = {
      x: snapToGrid(position.x),
      y: snapToGrid(position.y),
    };

    if (!hasCollision(index, newPosition, blocks[index].size!)) {
      const newBlocks = [...blocks];
      newBlocks[index] = {
        ...newBlocks[index],
        position: newPosition,
        updated_at: new Date().toISOString(),
      };
      setBlocks(newBlocks);
    }
  };

  const updateBlockSize = (index: number, size: Size) => {
    const newSize = {
      width: snapToGrid(size.width),
      height: snapToGrid(size.height),
    };

    if (!hasCollision(index, blocks[index].position!, newSize)) {
      const newBlocks = [...blocks];
      newBlocks[index] = {
        ...newBlocks[index],
        size: newSize,
        updated_at: new Date().toISOString(),
      };
      setBlocks(newBlocks);
    }
  };

  const deleteBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
    setSelectedBlockIndex(null);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(newBlocks);
  };

  const handleSave = async () => {
    const assignmentData = {
      title,
      description,
      max_points: maxPoints,
      due_date: dueDate || null,
      blocks,
    };

    if (assignment) {
      await onUpdate(assignmentData);
    } else {
      await onCreate(assignmentData);
    }
  };

  const getCurrentAssignment = (): Assignment => ({
    id: assignment?.id || "",
    title,
    description,
    max_points: maxPoints,
    due_date: dueDate || null,
    blocks,
    teacher_id: assignment?.teacher_id || "",
    status: "draft",
    created_at: assignment?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: null,
    google_classroom_id: null,
    google_classroom_link: null,
    rubric: assignment?.rubric || null,
  });

  const renderBlock = (block: Block, index: number) => {
    const isSelected = selectedBlockIndex === index;
    const commonProps = {
      id: block.id,
      content: block.content || "",
      position: block.position!,
      size: block.size!,
      isSelected,
      onSelect: () => setSelectedBlockIndex(index),
      onDeselect: () => setSelectedBlockIndex(null),
      onChange: (content: string) => updateBlock(index, content),
      onDelete: () => deleteBlock(index),
      onMoveUp: index > 0 ? () => moveBlock(index, index - 1) : undefined,
      onMoveDown: index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined,
      onSizeChange: (size: Size) => updateBlockSize(index, size),
      onPositionChange: (position: Position) => updateBlockPosition(index, position),
      onDragStart: () => setSelectedBlockIndex(index),
      onDragEnd: () => setSelectedBlockIndex(null),
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Assignments
          </Button>
          <h1 className="text-2xl font-bold">
            {assignment ? "Edit Assignment" : "Create Assignment"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            Preview
          </Button>
          <Button variant="outline" onClick={() => setShowPublish(true)}>
            Publish
          </Button>
          <Button onClick={handleSave}>Save Draft</Button>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assignment title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Assignment description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxPoints" className="block text-sm font-medium text-gray-700">
              Maximum Points
            </label>
            <input
              type="number"
              id="maxPoints"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={maxPoints}
              onChange={(e) => setMaxPoints(parseInt(e.target.value))}
              placeholder="Maximum points"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Due date"
            />
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex">
        <BlockTemplatesSidebar />
        
        {/* Drop Area */}
        <div 
          ref={drop}
          id="workspace"
          className="flex-1 relative p-4 min-h-[600px]"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              zIndex: 0
            }}
          />

          {/* Blocks */}
          <div className="relative" style={{ zIndex: 1 }}>
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPreview && (
        <PreviewModal
          blocks={blocks}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showPublish && (
        <PublishDialog
          assignment={getCurrentAssignment()}
          open={showPublish}
          onOpenChange={setShowPublish}
          onPublish={onPublish}
        />
      )}
    </div>
  );
}