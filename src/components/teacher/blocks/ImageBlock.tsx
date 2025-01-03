import { useState, useRef } from 'react';
import { BlockProps } from './BlockTypes';
import { ResizableBlock } from './ResizableBlock';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';

export const ImageBlock: React.FC<BlockProps> = ({
  id,
  position,
  size,
  content,
  isSelected,
  isPreview = false,
  onSelect,
  onDeselect,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSizeChange,
  onPositionChange,
  onDragStart,
  onDragEnd,
}) => {
  const [imageUrl, setImageUrl] = useState(content || '');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageUrl(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onChange('');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setZoomLevel(100);
  };

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  if (isFullscreen && imageUrl) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
        onClick={toggleFullscreen}
      >
        <div className="absolute top-4 right-4 flex items-center gap-4 bg-black/50 p-2 rounded-lg" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <Label className="text-white">Zoom</Label>
            <Slider
              value={[zoomLevel]}
              onValueChange={handleZoomChange}
              min={50}
              max={200}
              step={10}
              className="w-32"
            />
            <span className="text-white text-sm">{zoomLevel}%</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            Exit Fullscreen
          </Button>
        </div>
        <img
          src={imageUrl}
          alt="Fullscreen content"
          className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        />
      </div>
    );
  }

  return (
    <ResizableBlock
      id={id}
      position={position}
      size={size}
      isSelected={isSelected}
      isPreview={isPreview}
      onSelect={onSelect}
      onDeselect={onDeselect}
      onSizeChange={onSizeChange}
      onPositionChange={onPositionChange}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="h-full flex flex-col">
        {!isPreview && (
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium text-gray-700">Image Block</Label>
            {imageUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Remove
              </Button>
            )}
          </div>
        )}

        {imageUrl ? (
          <div className="flex-1 flex flex-col">
            <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-gray-50 rounded-md group">
              <img
                src={imageUrl}
                alt="Uploaded content"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="bg-white/75 hover:bg-white"
                >
                  View Fullscreen
                </Button>
              </div>
            </div>
          </div>
        ) : !isPreview ? (
          <div
            className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 transition-colors ${
              isDraggingFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-sm text-gray-600 text-center mb-1">
              Drag and drop an image here
            </p>
            <p className="text-xs text-gray-500 text-center">
              or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            No image uploaded
          </div>
        )}

        {!isPreview && (
          <div className="mt-2 text-xs text-gray-500">
            Supported formats: PNG, JPG
          </div>
        )}
      </div>
    </ResizableBlock>
  );
};
