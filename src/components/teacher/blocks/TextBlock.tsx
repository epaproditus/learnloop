import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { BlockProps } from './BlockTypes';
import { ResizableBlock } from './ResizableBlock';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';

const LATEX_TEMPLATES = [
  { name: 'Fraction', template: '\\frac{x}{y}' },
  { name: 'Square Root', template: '\\sqrt{x}' },
  { name: 'Exponent', template: 'x^{n}' },
];

const TEXT_COLORS = [
  { name: 'Default', value: 'inherit' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Orange', value: '#f97316' },
];

const renderLatex = (text: string) => {
  const latexPattern = /`(.*?)`/g;
  return text.split(latexPattern).map((part, index) => {
    if (index % 2 === 0) {
      return part;
    }
    try {
      return katex.renderToString(part, { displayMode: true });
    } catch (error) {
      console.error('LaTeX parsing error:', error);
      return `\`${part}\``;
    }
  }).join('');
};

export const TextBlock: React.FC<BlockProps> = ({
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
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: [TextStyle.name] }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const renderedContent = renderLatex(html);
      onChange(renderedContent);
    },
    editable: !isPreview,
  });

  const insertLatexTemplate = (template: string) => {
    editor?.commands.insertContent(`\`${template}\``);
    const pos = editor?.state.selection.$head.pos || 0;
    editor?.commands.setTextSelection(pos - 1);
  };

  const setTextColor = (color: string) => {
    editor?.chain().focus().setMark('textStyle', { color }).run();
  };

  const renderToolbar = () => (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'bg-accent' : ''}
            disabled={isPreview}
          >
            B
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive('italic') ? 'bg-accent' : ''}
            disabled={isPreview}
          >
            I
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor?.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
            disabled={isPreview}
          >
            H
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor?.isActive('bulletList') ? 'bg-accent' : ''}
            disabled={isPreview}
          >
            •
          </Button>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-8"
              disabled={isPreview}
            >
              <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: editor?.getAttributes('textStyle').color || 'inherit' }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <div className="grid grid-cols-4 gap-1">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.value}
                  className="w-8 h-8 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ backgroundColor: color.value }}
                  onClick={() => setTextColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isPreview}
              title="Insert LaTeX"
            >
              ∑
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <div className="grid gap-2">
              {LATEX_TEMPLATES.map((template) => (
                <Button
                  key={template.name}
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => insertLatexTemplate(template.template)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {!isPreview && (
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <Button variant="ghost" size="sm" onClick={onMoveUp}>↑</Button>
          )}
          {onMoveDown && (
            <Button variant="ghost" size="sm" onClick={onMoveDown}>↓</Button>
          )}
          <Button variant="ghost" size="sm" onClick={onDelete}>×</Button>
        </div>
      )}
    </div>
  );

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
        {!isPreview && renderToolbar()}
        <EditorContent 
          editor={editor} 
          className={`flex-1 overflow-auto prose prose-sm max-w-none ${
            !isPreview ? 'border rounded-md p-2 min-h-[100px] focus-within:ring-1 focus-within:ring-ring' : 'p-2'
          }`}
        />
      </div>
    </ResizableBlock>
  );
};
