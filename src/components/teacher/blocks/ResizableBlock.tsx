import React, { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";

interface ResizableBlockProps {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onSizeChange: (size: { width: number; height: number }) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  children: React.ReactNode;
}

export const ResizableBlock: React.FC<ResizableBlockProps> = ({
  id,
  position,
  size,
  onSizeChange,
  onPositionChange,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, e.clientX - dragStart.x);
      const newY = Math.max(0, e.clientY - dragStart.y);
      onPositionChange({ x: newX, y: newY });
    } else if (isResizing) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      onSizeChange({
        width: Math.max(200, size.width + dx),
        height: Math.max(100, size.height + dy),
      });
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  return (
    <div
      className={cn(
        "absolute bg-white rounded-lg shadow-lg border border-gray-200",
        isDragging && "cursor-grabbing",
        isResizing && "cursor-nwse-resize"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {/* Drag handle */}
      <div
        className="absolute top-0 left-0 right-0 h-6 bg-gray-100 rounded-t-lg cursor-move flex items-center px-2 text-xs text-gray-500 select-none"
        onMouseDown={handleDragStart}
      >
        <span className="mr-2">⋮⋮</span>
        <span>Drag to move</span>
      </div>

      {/* Content area */}
      <div className="absolute top-6 left-0 right-0 bottom-6 overflow-auto p-2">
        {children}
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
        >
          <path d="M22 22H20V20H22V22ZM22 18H18V20H22V18ZM18 22H16V24H18V22ZM14 22H12V24H14V22Z" />
        </svg>
      </div>
    </div>
  );
};
