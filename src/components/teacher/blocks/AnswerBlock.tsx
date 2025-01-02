import { useState } from 'react';
import { BlockProps } from './BlockTypes';
import { ResizableBlock } from './ResizableBlock';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const AnswerBlock: React.FC<BlockProps> = ({
  id,
  position,
  size,
  content,
  onContentChange,
  onSizeChange,
  onPositionChange,
}) => {
  const [showLatexInput, setShowLatexInput] = useState(false);
  const [latexInput, setLatexInput] = useState('');
  const [answerType, setAnswerType] = useState<'text' | 'latex'>('text');
  const [correctAnswer, setCorrectAnswer] = useState(content || '');

  const handleLatexSubmit = () => {
    try {
      const rendered = katex.renderToString(latexInput, { displayMode: true });
      setCorrectAnswer(rendered);
      onContentChange(rendered);
      setShowLatexInput(false);
      setLatexInput('');
      setAnswerType('latex');
    } catch (error) {
      console.error('LaTeX parsing error:', error);
    }
  };

  const handleTextSubmit = (text: string) => {
    setCorrectAnswer(text);
    onContentChange(text);
    setAnswerType('text');
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
          <Label className="text-sm font-medium text-gray-700">Answer Box</Label>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLatexInput(!showLatexInput)}
              title="Toggle LaTeX Input"
              className={answerType === 'latex' ? 'bg-accent' : ''}
            >
              ∑
            </Button>
          </div>
        </div>

        {showLatexInput ? (
          <div className="mb-2">
            <Input
              value={latexInput}
              onChange={(e) => setLatexInput(e.target.value)}
              placeholder="Enter LaTeX (e.g., x^2 + y^2 = z^2)"
              className="mb-2"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLatexInput(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleLatexSubmit}
              >
                Set Answer
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 border rounded-md p-3">
            {correctAnswer ? (
              <div 
                dangerouslySetInnerHTML={{ __html: correctAnswer }}
                className="flex items-center justify-center h-full text-gray-600"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Click ∑ to set LaTeX answer or type plain text
              </div>
            )}
          </div>
        )}

        {!showLatexInput && (
          <div className="mt-2">
            <Label className="text-xs text-gray-500">Plain text answer</Label>
            <Input
              value={answerType === 'text' ? correctAnswer : ''}
              onChange={(e) => handleTextSubmit(e.target.value)}
              placeholder="Enter correct answer"
              className="mt-1"
            />
          </div>
        )}

        <div className="mt-2 text-xs text-gray-500">
          Students will see an input box here
        </div>
      </div>
    </ResizableBlock>
  );
};
