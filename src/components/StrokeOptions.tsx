import React from 'react';

interface StrokeOptionsProps {
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  roughness: number;
  setRoughness: (roughness: number) => void;
}

const StrokeOptions: React.FC<StrokeOptionsProps> = ({
  strokeWidth,
  setStrokeWidth,
  roughness,
  setRoughness,
}) => {
  const strokeWidths = [1, 2, 4, 6];
  
  return (
    <div className="absolute top-20 right-4 bg-white rounded-lg shadow-md p-3 flex flex-col space-y-3 z-10">
      <div>
        <p className="text-xs font-medium mb-2 text-gray-700">Stroke Width</p>
        <div className="flex items-center space-x-2">
          {strokeWidths.map((width) => (
            <button
              key={width}
              className={`p-2 rounded transition-all ${
                strokeWidth === width
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => setStrokeWidth(width)}
              title={`${width}px`}
            >
              <div 
                className="rounded-full bg-gray-800" 
                style={{ 
                  width: width * 2, 
                  height: width * 2,
                  minWidth: width * 2,
                  minHeight: width * 2
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2 text-gray-700">Roughness</p>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={roughness}
          onChange={(e) => setRoughness(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Smooth</span>
          <span>Rough</span>
        </div>
      </div>
    </div>
  );
};

export default StrokeOptions;