import React from 'react';

interface ColorOption {
  color: string;
  name: string;
}

interface ColorPickerProps {
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  strokeColor,
  setStrokeColor,
  backgroundColor,
  setBackgroundColor,
}) => {
  const colors: ColorOption[] = [
    { color: '#000000', name: 'Black' },
    { color: '#343a40', name: 'Gray' },
    { color: '#e03131', name: 'Red' },
    { color: '#2b8a3e', name: 'Green' },
    { color: '#1971c2', name: 'Blue' },
    { color: '#f08c00', name: 'Orange' },
    { color: '#5f3dc4', name: 'Purple' },
    { color: '#0b7285', name: 'Teal' },
  ];

  const backgroundColors: ColorOption[] = [
    { color: 'transparent', name: 'Transparent' },
    { color: '#ffffff', name: 'White' },
    { color: '#f8f9fa', name: 'Light Gray' },
    { color: '#fff3bf', name: 'Light Yellow' },
    { color: '#d3f9d8', name: 'Light Green' },
    { color: '#dbe4ff', name: 'Light Blue' },
    { color: '#ffe8cc', name: 'Light Orange' },
    { color: '#e5dbff', name: 'Light Purple' },
  ];

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 flex flex-col space-y-3 z-10">
      <div>
        <p className="text-xs font-medium mb-2 text-gray-700">Stroke</p>
        <div className="flex flex-wrap gap-1">
          {colors.map((color) => (
            <button
              key={color.color}
              className={`w-6 h-6 rounded transition-all ${
                strokeColor === color.color
                  ? 'ring-2 ring-blue-500 ring-offset-1'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color.color }}
              onClick={() => setStrokeColor(color.color)}
              title={color.name}
            />
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-xs font-medium mb-2 text-gray-700">Fill</p>
        <div className="flex flex-wrap gap-1">
          {backgroundColors.map((color) => (
            <button
              key={color.color}
              className={`w-6 h-6 rounded transition-all ${
                color.color === 'transparent' ? 'bg-white border border-gray-300 relative' : ''
              } ${
                backgroundColor === color.color
                  ? 'ring-2 ring-blue-500 ring-offset-1'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color.color }}
              onClick={() => setBackgroundColor(color.color)}
              title={color.name}
            >
              {color.color === 'transparent' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[1px] h-full bg-gray-400 transform rotate-45" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;