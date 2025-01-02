import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";

type BlockType = "text" | "answer" | "image";

interface BlockTemplate {
  id: string;
  type: BlockType;
  icon: string;
  label: string;
  description: string;
}

const blockTemplates: BlockTemplate[] = [
  {
    id: "text-block",
    type: "text",
    icon: "📝",
    label: "Text Block",
    description: "Add formatted text with LaTeX support"
  },
  {
    id: "answer-block",
    type: "answer",
    icon: "✏️",
    label: "Answer Box",
    description: "Add an answer input area with LaTeX support"
  },
  {
    id: "image-block",
    type: "image",
    icon: "🖼️",
    label: "Image Block",
    description: "Upload and display an image"
  }
];

export const ProblemCreator = () => {
  const handleDragStart = (e: React.DragEvent, blockType: BlockType) => {
    e.dataTransfer.setData("blockType", blockType);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2">
        Drag blocks to the workspace area
      </div>
      
      <div className="space-y-2">
        {blockTemplates.map((template) => (
          <Card
            key={template.id}
            draggable
            onDragStart={(e) => handleDragStart(e, template.type)}
            className="cursor-move hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{template.icon}</div>
                <div>
                  <h3 className="font-medium">{template.label}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="text-sm text-gray-500 mb-2">
          Tips:
        </div>
        <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
          <li>Blocks can be resized after dropping</li>
          <li>Use LaTeX between $$ symbols</li>
          <li>Supported image formats: PNG, JPG</li>
        </ul>
      </div>
    </div>
  );
};
