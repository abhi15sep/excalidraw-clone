import React, { useRef, useEffect, useState, MouseEvent } from 'react';
import { DrawElement } from '../types';
import { renderElement } from '../utils/rendering';

interface CanvasProps {
  elements: DrawElement[];
  tool: string;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  roughness: number;
  panOffset: { x: number; y: number };
  zoom: number;
  onElementCreate: (element: DrawElement) => void;
  onElementUpdate: (id: string, changes: Partial<DrawElement>) => void;
  onElementSelect: (id: string | null, multiSelect?: boolean) => void;
  selectedElementIds: Set<string>;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  tool,
  strokeColor,
  backgroundColor,
  strokeWidth,
  roughness,
  panOffset,
  zoom,
  onElementCreate,
  onElementUpdate,
  onElementSelect,
  selectedElementIds,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(null);

  // Get actual coordinates considering pan and zoom
  const getCoordinates = (e: MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;
    return { x, y };
  };

  // Draw all elements on canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);
    
    // Draw grid (optional)
    // drawGrid(ctx, canvas.width, canvas.height, panOffset, zoom);

    // Draw all elements
    elements.forEach(element => {
      renderElement(ctx, element, selectedElementIds.has(element.id));
    });

    // Draw current element being created
    if (currentElement) {
      renderElement(ctx, currentElement, true);
    }

    ctx.restore();
  };

  useEffect(() => {
    // Set canvas dimensions
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [elements, panOffset, zoom, selectedElementIds, currentElement]);

  const handleMouseDown = (e: MouseEvent) => {
    if (tool === 'hand') return; // For panning the canvas

    const { x, y } = getCoordinates(e);
    setStartPoint({ x, y });

    if (tool === 'select') {
      // Handle selection
      const selectedElement = elements.findLast(el => {
        // Simple hit detection - can be improved
        return x >= el.x && 
               x <= el.x + el.width && 
               y >= el.y && 
               y <= el.y + el.height;
      });
      
      onElementSelect(selectedElement?.id || null, e.shiftKey);
    } else {
      // Create a new element
      setIsDrawing(true);
      const id = `element_${Date.now()}`;
      const newElement: DrawElement = {
        id,
        type: tool as any,
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
        points: tool === 'freedraw' ? [{ x, y }] : undefined,
      };
      setCurrentElement(newElement);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing || !currentElement) return;

    const { x, y } = getCoordinates(e);
    
    if (currentElement.type === 'freedraw' && currentElement.points) {
      // Add point to freedraw
      const updatedPoints = [...currentElement.points, { x, y }];
      setCurrentElement({
        ...currentElement,
        points: updatedPoints,
      });
    } else {
      // Update dimensions for shapes
      const width = x - startPoint.x;
      const height = y - startPoint.y;
      setCurrentElement({
        ...currentElement,
        width,
        height
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentElement) return;
    
    setIsDrawing(false);
    onElementCreate(currentElement);
    setCurrentElement(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default Canvas;