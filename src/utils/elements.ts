import { DrawElement, ElementType } from '../types';

// Generate a unique ID for new elements
export const generateId = (): string => {
  return `element_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Create a new element with default properties
export const createElement = (
  type: ElementType,
  x: number,
  y: number,
  strokeColor: string,
  backgroundColor: string,
  strokeWidth: number,
  roughness: number
): DrawElement => {
  return {
    id: generateId(),
    type,
    x,
    y,
    width: 0,
    height: 0,
    strokeColor,
    backgroundColor,
    strokeWidth,
    strokeStyle: 'solid',
    opacity: 1,
    roughness,
    seed: Math.floor(Math.random() * 2000),
    points: type === 'freedraw' ? [{ x, y }] : undefined,
    text: type === 'text' ? 'Text' : undefined,
    fontSize: 16,
    fontFamily: 'sans-serif',
    textAlign: 'left',
  };
};

// Update an existing element
export const updateElement = (
  element: DrawElement,
  changes: Partial<DrawElement>
): DrawElement => {
  return {
    ...element,
    ...changes,
  };
};

// Export drawing as image
export const exportToImage = (canvas: HTMLCanvasElement): void => {
  try {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `excalidraw_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataURL;
    link.click();
  } catch (error) {
    console.error('Failed to export image:', error);
  }
};