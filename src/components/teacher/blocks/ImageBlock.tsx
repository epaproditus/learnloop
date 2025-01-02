import { useState, useRef } from 'react';
import { BlockProps } from './BlockTypes';
import { ResizableBlock } from './ResizableBlock';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';

export const ImageBlock: React.FC<BlockProps> = ({
  id,
  position,
  size,
  content,
  onContentChange,
  onSizeChange,
  onPositionChange,
}) => {
  const [imageUrl, setImageUrl] = useState(content || '');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
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
      onContentChange(dataUrl);
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
    onContentChange('');
  };

  return (
    <ResizableBlock
      id={id}
      position={position}
      size={size}
      onSizeChange={onSizeChange}
      onPositionChange={onPositionChange}
    >
      <div className="h-full flex flex-col">
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

        {imageUrl ? (
          <div className="flex-1 flex items-center justify-center overflow-hidden bg-gray-50 rounded-md">
            <img
              src={imageUrl}
              alt="Uploaded content"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
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
        )}

        <div className="mt-2 text-xs text-gray-500">
          Supported formats: PNG, JPG
        </div>
      </div>
    </ResizableBlock>
  );
};
