import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { BlockProps } from './BlockTypes';
import { ResizableBlock } from './ResizableBlock';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Button } from '../../ui/button';

const renderLatex = (text: string) => {
  const latexPattern = /\$\$(.*?)\$\$/g;
  return text.split(latexPattern).map((part, index) => {
    if (index % 2 === 0) {
      return part;
    }
    try {
      return katex.renderToString(part, { displayMode: true });
    } catch (error) {
      console.error('LaTeX parsing error:', error);
      return `$$${part}$$`;
    }
  }).join('');
};

export const TextBlock: React.FC<BlockProps> = ({
  id,
  position,
  size,
  content,
  onContentChange,
  onSizeChange,
  onPositionChange,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  const toggleLatexMode = () => {
    const currentContent = editor?.getHTML() || '';
    if (currentContent.includes('$$')) {
      // If already in LaTeX mode, render the math
      const renderedContent = renderLatex(currentContent);
      editor?.commands.setContent(renderedContent);
    } else {
      // Add LaTeX delimiters
      editor?.commands.insertContent('$$  $$');
      // Move cursor between delimiters
      const pos = editor?.state.selection.$head.pos || 0;
      editor?.commands.setTextSelection(pos - 3);
    }
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
        <div className="flex justify-end space-x-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'bg-accent' : ''}
          >
            B
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive('italic') ? 'bg-accent' : ''}
          >
            I
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLatexMode}
            title="Insert LaTeX"
          >
            ∑
          </Button>
        </div>
        <EditorContent 
          editor={editor} 
          className="flex-1 overflow-auto prose prose-sm max-w-none focus:outline-none"
        />
      </div>
    </ResizableBlock>
  );
};
