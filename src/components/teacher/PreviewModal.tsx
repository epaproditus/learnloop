import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { TextBlock } from "./blocks/TextBlock";
import { AnswerBlock } from "./blocks/AnswerBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import type { Block, WorkspaceMode } from "../../types/Assignment";

interface PreviewModalProps {
  blocks: Block[];
  mode?: WorkspaceMode;
  onClose: () => void;
}

const GRID_SIZE = 20;

export function PreviewModal({ blocks, mode = "single", onClose }: PreviewModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const renderBlock = (block: Block) => {
    const commonProps = {
      id: block.id,
      content: block.content || "",
      position: block.position!,
      size: block.size!,
      isSelected: false,
      isPreview: true,
      onSelect: () => {},
      onDeselect: () => {},
      onChange: () => {},
      onDelete: () => {},
      onSizeChange: () => {},
      onPositionChange: () => {},
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

  const renderContent = () => {
    switch (mode) {
      case "slideshow":
        return (
          <div className="relative min-h-[600px] bg-gray-50 p-4">
            {/* Grid Background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              }}
            />

            {/* Navigation Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
                disabled={currentSlide === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                {currentSlide + 1} / {blocks.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSlide(prev => Math.min(prev + 1, blocks.length - 1))}
                disabled={currentSlide === blocks.length - 1}
              >
                Next
              </Button>
            </div>

            {/* Current Slide */}
            <div className="relative">
              {renderBlock(blocks[currentSlide])}
            </div>
          </div>
        );

      case "infinite":
        return (
          <div className="relative min-h-[600px] bg-gray-50 p-4 overflow-y-auto">
            {/* Grid Background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              }}
            />

            {/* All Blocks */}
            <div className="relative">
              {blocks.map(renderBlock)}
            </div>
          </div>
        );

      default: // single
        return (
          <div className="relative min-h-[600px] bg-gray-50 p-4">
            {/* Grid Background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              }}
            />

            {/* All Blocks */}
            <div className="relative">
              {blocks.map(renderBlock)}
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Preview Assignment</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>

        {blocks.length > 0 ? (
          renderContent()
        ) : (
          <div className="min-h-[400px] flex items-center justify-center text-gray-500">
            No blocks added yet
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
