import { Card, CardContent } from "../../ui/card";
import { useDrag } from "react-dnd";
import { Block } from "../../../types/Assignment";

interface BlockTemplate {
  type: Block['type'];
  icon: string;
  label: string;
  description: string;
}

interface TemplateCardProps {
  template: BlockTemplate;
}

const blockTemplates: BlockTemplate[] = [
  {
    type: "text",
    icon: "📝",
    label: "Text Block",
    description: "Add formatted text with LaTeX support"
  },
  {
    type: "answer",
    icon: "✏️",
    label: "Answer Box",
    description: "Add an answer input area"
  },
  {
    type: "image",
    icon: "🖼️",
    label: "Image Block",
    description: "Upload and display an image"
  }
];

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TEMPLATE',
    item: { type: 'TEMPLATE', templateType: template.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={drag}
      className={`cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
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
  );
};

export const BlockTemplatesSidebar = () => {
  return (
    <div className="w-64 min-h-full bg-gray-50 p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Block Templates</h2>
      <div className="space-y-4">
        {blockTemplates.map((template) => (
          <TemplateCard key={template.type} template={template} />
        ))}
      </div>
    </div>
  );
};