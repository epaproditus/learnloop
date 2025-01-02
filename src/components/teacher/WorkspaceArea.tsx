import { useState } from "react";
import { TextBlock } from "./blocks/TextBlock";
import { AnswerBlock } from "./blocks/AnswerBlock";
import { ImageBlock } from "./blocks/ImageBlock";

interface Block {
  id: string;
  type: "text" | "answer" | "image";
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
}

export const WorkspaceArea = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData("blockType") as Block["type"];
    if (!blockType) return;
    
    // Get position relative to the workspace
    const workspaceRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - workspaceRect.left;
    const y = e.clientY - workspaceRect.top;

    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: blockType,
      position: { x, y },
      size: { width: 300, height: 200 },
      content: ""
    };

    setBlocks(prev => [...prev, newBlock]);
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const updateBlockSize = (id: string, size: { width: number; height: number }) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === id ? { ...block, size } : block
      )
    );
  };

  const updateBlockPosition = (id: string, position: { x: number; y: number }) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === id ? { ...block, position } : block
      )
    );
  };

  const renderBlock = (block: Block) => {
    const commonProps = {
      id: block.id,
      position: block.position,
      size: block.size,
      content: block.content,
      onContentChange: (content: string) => updateBlockContent(block.id, content),
      onSizeChange: (size: { width: number; height: number }) => updateBlockSize(block.id, size),
      onPositionChange: (position: { x: number; y: number }) => updateBlockPosition(block.id, position),
    };

    switch (block.type) {
      case "text":
        return <TextBlock key={block.id} {...commonProps} />;
      case "answer":
        return <AnswerBlock key={block.id} {...commonProps} />;
      case "image":
        return <ImageBlock key={block.id} {...commonProps} />;
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-200 rounded-lg h-[600px] relative overflow-hidden bg-gray-50"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {blocks.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p>Drag blocks here to create your assignment</p>
            <p className="text-sm">Blocks can be resized and moved after placing</p>
          </div>
        </div>
      ) : (
        blocks.map(renderBlock)
      )}
    </div>
  );
};
