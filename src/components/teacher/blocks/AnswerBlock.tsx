import { useState } from 'react';
import { BlockProps } from './BlockTypes';
import { ResizableBlock } from './ResizableBlock';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const AnswerBlock: React.FC<BlockProps> = ({
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
  const [showLatexInput, setShowLatexInput] = useState(false);
  const [latexInput, setLatexInput] = useState('');
  const [answerType, setAnswerType] = useState<'text' | 'latex'>('text');
  const [correctAnswer, setCorrectAnswer] = useState(content || '');
  const [studentAnswer, setStudentAnswer] = useState('');

  const renderLatex = (text: string) => {
    try {
      return katex.renderToString(text, { displayMode: true });
    } catch (error) {
      console.error('LaTeX parsing error:', error);
      return text;
    }
  };

  const handleLatexSubmit = () => {
    try {
      const rendered = renderLatex(latexInput);
      setCorrectAnswer(rendered);
      onChange(rendered);
      setShowLatexInput(false);
      setLatexInput('');
      setAnswerType('latex');
    } catch (error) {
      console.error('LaTeX parsing error:', error);
    }
  };

  const handleTextSubmit = (text: string) => {
    setCorrectAnswer(text);
    onChange(text);
    setAnswerType('text');
  };

  const handleStudentLatexSubmit = () => {
    try {
      const rendered = renderLatex(latexInput);
      setStudentAnswer(rendered);
      setShowLatexInput(false);
      setLatexInput('');
    } catch (error) {
      console.error('LaTeX parsing error:', error);
    }
  };

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
        {!isPreview ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium text-gray-700">Answer Box</Label>
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
              <>
                <div className="flex-1 border rounded-md p-3 mb-2">
                  {correctAnswer ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: correctAnswer }}
                      className="flex items-center justify-center h-full text-gray-600"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Click ∑ to set LaTeX answer or type plain text below
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Plain text answer</Label>
                  <Input
                    value={answerType === 'text' ? correctAnswer : ''}
                    onChange={(e) => handleTextSubmit(e.target.value)}
                    placeholder="Enter correct answer"
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium text-gray-700">Your Answer</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLatexInput(!showLatexInput)}
                title="Use LaTeX"
              >
                ∑
              </Button>
            </div>
            {showLatexInput ? (
              <div className="flex-1">
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
                    onClick={handleStudentLatexSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {studentAnswer ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: studentAnswer }}
                    className="flex-1 border rounded-md p-3 flex items-center justify-center text-gray-600"
                  />
                ) : (
                  <Textarea
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    placeholder="Enter your answer here..."
                    className="flex-1 resize-none p-2 border rounded-md"
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </ResizableBlock>
  );
};
