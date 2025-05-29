import React from 'react';
import { Tool } from '../types';
import { MousePointer, Hand, Square, Circle, ArrowRight, WineIcon as LineIcon, Type, Pencil } from 'lucide-react';

interface ToolbarProps {
  currentTool: string;
  setTool: (tool: Tool['type']) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ currentTool, setTool }) => {
  const tools: Tool[] = [
    { type: 'select', icon: 'MousePointer', name: 'Select' },
    { type: 'hand', icon: 'Hand', name: 'Hand (Pan)' },
    { type: 'rectangle', icon: 'Square', name: 'Rectangle' },
    { type: 'ellipse', icon: 'Circle', name: 'Ellipse' },
    { type: 'line', icon: 'LineIcon', name: 'Line' },
    { type: 'arrow', icon: 'ArrowRight', name: 'Arrow' },
    { type: 'text', icon: 'Type', name: 'Text' },
    { type: 'freedraw', icon: 'Pencil', name: 'Pencil' },
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'MousePointer': return <MousePointer size={18} />;
      case 'Hand': return <Hand size={18} />;
      case 'Square': return <Square size={18} />;
      case 'Circle': return <Circle size={18} />;
      case 'LineIcon': return <LineIcon size={18} />;
      case 'ArrowRight': return <ArrowRight size={18} />;
      case 'Type': return <Type size={18} />;
      case 'Pencil': return <Pencil size={18} />;
      default: return null;
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md p-1 flex space-x-1 z-10">
      {tools.map((tool) => (
        <button
          key={tool.type}
          className={`p-2 rounded transition-all ${
            currentTool === tool.type
              ? 'bg-blue-100 text-blue-700'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => setTool(tool.type)}
          title={tool.name}
        >
          {renderIcon(tool.icon)}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;