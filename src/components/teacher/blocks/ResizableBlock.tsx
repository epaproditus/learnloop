import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDrag } from "react-dnd";
import { cn } from "../../../lib/utils";

const GRID_SIZE = 20;

interface ResizableBlockProps {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isSelected: boolean;
  isPreview?: boolean;
  type?: string;
  isTemplate?: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  children: React.ReactNode;
}

export const ResizableBlock: React.FC<ResizableBlockProps> = ({
  type,
  isTemplate = false,
  id,
  position,
  size,
  isSelected,
  isPreview = false,
  onSelect,
  onDeselect,
  onSizeChange,
  onPositionChange,
  onDragStart,
  onDragEnd,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging: isDndDragging }, drag] = useDrag(() => ({
    type: type || 'BLOCK',
    item: () => ({
      id,
      type,
      position,
      size,
      isTemplate
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: !isPreview
  }));
  
  drag(ref);

  // Snap value to grid
  const snapToGrid = (value: number): number => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPreview) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onDragStart?.();
    onSelect();
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPreview) return;

    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
    onSelect();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = snapToGrid(Math.max(0, e.clientX - dragStart.x));
      const newY = snapToGrid(Math.max(0, e.clientY - dragStart.y));
      onPositionChange({ x: newX, y: newY });
    } else if (isResizing) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      const newWidth = snapToGrid(Math.max(200, size.width + dx));
      const newHeight = snapToGrid(Math.max(100, size.height + dy));
      
      onSizeChange({ width: newWidth, height: newHeight });
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  }, [isDragging, isResizing, dragStart, onPositionChange, onSizeChange, size.width, size.height]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      onDragEnd?.();
    }
    setIsDragging(false);
    setIsResizing(false);
  }, [isDragging, onDragEnd]);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={cn(
        "absolute bg-white rounded-lg shadow-lg transition-shadow",
        isSelected ? "ring-2 ring-indigo-500 shadow-lg" : "border border-gray-200",
        isResizing && "cursor-nwse-resize",
        isPreview && "pointer-events-none"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={(e) => {
        if (!isPreview && e.target === e.currentTarget) {
          e.stopPropagation();
          onSelect();
        }
      }}
      onBlur={onDeselect}
      tabIndex={0}
    >
      {/* Drag handle */}
      <div
        ref={ref}
        className={cn(
          "absolute top-0 left-0 right-0 h-6 bg-gray-100 rounded-t-lg cursor-move flex items-center px-2 text-xs text-gray-500 select-none",
          isSelected && "bg-indigo-50",
          (isDragging || isDndDragging) && "cursor-grabbing",
          isTemplate && "cursor-move"
        )}
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
      {!isPreview && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        >
          <svg
            viewBox="0 0 24 24"
            className={cn(
              "w-4 h-4",
              isSelected ? "text-indigo-400" : "text-gray-400"
            )}
            fill="currentColor"
          >
            <path d="M22 22H20V20H22V22ZM22 18H18V20H22V18ZM18 22H16V24H18V22ZM14 22H12V24H14V22Z" />
          </svg>
        </div>
      )}

      {/* Grid alignment guides */}
      {isSelected && !isPreview && (
        <>
          <div className="absolute left-0 top-0 w-full h-px bg-indigo-400 opacity-50" />
          <div className="absolute left-0 bottom-0 w-full h-px bg-indigo-400 opacity-50" />
          <div className="absolute left-0 top-0 w-px h-full bg-indigo-400 opacity-50" />
          <div className="absolute right-0 top-0 w-px h-full bg-indigo-400 opacity-50" />
        </>
      )}
    </div>
  );
};
