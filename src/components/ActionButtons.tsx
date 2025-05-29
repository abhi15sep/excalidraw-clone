import React from 'react';
import { Download, Undo, Redo, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onExport,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md p-1 flex space-x-1 z-10">
      <button
        className={`p-2 rounded transition-all ${
          canUndo ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'
        }`}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
      >
        <Undo size={18} />
      </button>
      
      <button
        className={`p-2 rounded transition-all ${
          canRedo ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'
        }`}
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo"
      >
        <Redo size={18} />
      </button>

      <div className="w-px h-6 bg-gray-200 my-auto mx-1"></div>
      
      <button
        className="p-2 rounded hover:bg-gray-100 text-gray-700 transition-all"
        onClick={onClear}
        title="Clear Canvas"
      >
        <Trash2 size={18} />
      </button>
      
      <button
        className="p-2 rounded hover:bg-gray-100 text-gray-700 transition-all"
        onClick={onExport}
        title="Export Image"
      >
        <Download size={18} />
      </button>
    </div>
  );
};

export default ActionButtons;