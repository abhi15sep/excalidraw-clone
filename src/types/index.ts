export type ElementType = 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'text' | 'freedraw';

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export type DrawElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  opacity: number;
  points?: { x: number; y: number }[];
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  roughness: number; // 0-2 scale for how rough/sketchy the drawing looks
  seed: number; // used for consistent rough drawing
  isSelected?: boolean;
};

export type Tool = {
  type: ElementType | 'select' | 'hand';
  icon: string;
  name: string;
};

export type CanvasState = {
  elements: DrawElement[];
  selectedElementIds: Set<string>;
  currentTool: Tool['type'];
  panOffset: { x: number; y: number };
  zoom: number;
  history: {
    past: DrawElement[][];
    future: DrawElement[][];
  };
};