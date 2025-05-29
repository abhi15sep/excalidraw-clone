import { DrawElement } from '../types';

// Function to render a single element on the canvas
export const renderElement = (
  ctx: CanvasRenderingContext2D,
  element: DrawElement,
  isSelected: boolean
) => {
  ctx.save();
  
  // Set styles
  ctx.strokeStyle = element.strokeColor;
  ctx.fillStyle = element.backgroundColor;
  ctx.lineWidth = element.strokeWidth;
  ctx.globalAlpha = element.opacity;

  // Set line style
  if (element.strokeStyle === 'dashed') {
    ctx.setLineDash([10, 5]);
  } else if (element.strokeStyle === 'dotted') {
    ctx.setLineDash([2, 2]);
  } else {
    ctx.setLineDash([]);
  }

  // Apply rough effect based on roughness
  // This is a simplified version - a real implementation would use roughjs
  const roughness = element.roughness || 0;
  const jitter = roughness * element.strokeWidth * 0.5;

  // Draw based on element type
  switch (element.type) {
    case 'rectangle':
      drawRectangle(ctx, element, jitter);
      break;
    case 'ellipse':
      drawEllipse(ctx, element, jitter);
      break;
    case 'line':
      drawLine(ctx, element, jitter);
      break;
    case 'arrow':
      drawArrow(ctx, element, jitter);
      break;
    case 'freedraw':
      drawFreedraw(ctx, element);
      break;
    case 'text':
      drawText(ctx, element);
      break;
  }

  // Draw selection border if selected
  if (isSelected) {
    ctx.strokeStyle = '#4285f4';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      element.x - 4, 
      element.y - 4, 
      element.width + 8, 
      element.height + 8
    );
    
    // Draw resize handles
    const handles = [
      { x: element.x, y: element.y }, // top-left
      { x: element.x + element.width / 2, y: element.y }, // top-center
      { x: element.x + element.width, y: element.y }, // top-right
      { x: element.x, y: element.y + element.height / 2 }, // middle-left
      { x: element.x + element.width, y: element.y + element.height / 2 }, // middle-right
      { x: element.x, y: element.y + element.height }, // bottom-left
      { x: element.x + element.width / 2, y: element.y + element.height }, // bottom-center
      { x: element.x + element.width, y: element.y + element.height }, // bottom-right
    ];
    
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#4285f4';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    
    handles.forEach(handle => {
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  ctx.restore();
};

const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  element: DrawElement,
  jitter: number
) => {
  const { x, y, width, height } = element;
  
  if (jitter > 0) {
    // Draw a rougher rectangle with slight offsets
    ctx.beginPath();
    const points = [
      { x: x + randomJitter(jitter), y: y + randomJitter(jitter) },
      { x: x + width + randomJitter(jitter), y: y + randomJitter(jitter) },
      { x: x + width + randomJitter(jitter), y: y + height + randomJitter(jitter) },
      { x: x + randomJitter(jitter), y: y + height + randomJitter(jitter) },
    ];
    
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    if (element.backgroundColor !== 'transparent') {
      ctx.fill();
    }
    ctx.stroke();
  } else {
    // Draw a clean rectangle
    if (element.backgroundColor !== 'transparent') {
      ctx.fillRect(x, y, width, height);
    }
    ctx.strokeRect(x, y, width, height);
  }
};

const drawEllipse = (
  ctx: CanvasRenderingContext2D,
  element: DrawElement,
  jitter: number
) => {
  const { x, y, width, height } = element;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const radiusX = width / 2;
  const radiusY = height / 2;
  
  ctx.beginPath();
  
  if (jitter > 0) {
    // Draw a rougher ellipse
    const steps = Math.max(Math.floor(Math.PI * Math.max(radiusX, radiusY) / 5), 30);
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const px = centerX + Math.cos(angle) * radiusX + randomJitter(jitter);
      const py = centerY + Math.sin(angle) * radiusY + randomJitter(jitter);
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
  } else {
    // Draw a clean ellipse
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  }
  
  if (element.backgroundColor !== 'transparent') {
    ctx.fill();
  }
  ctx.stroke();
};

const drawLine = (
  ctx: CanvasRenderingContext2D,
  element: DrawElement,
  jitter: number
) => {
  const { x, y, width, height } = element;
  const endX = x + width;
  const endY = y + height;
  
  ctx.beginPath();
  
  if (jitter > 0) {
    // Draw a rough line
    const dx = endX - x;
    const dy = endY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(Math.floor(distance / 5), 2);
    
    ctx.moveTo(x + randomJitter(jitter), y + randomJitter(jitter));
    
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const px = x + dx * t + randomJitter(jitter);
      const py = y + dy * t + randomJitter(jitter);
      ctx.lineTo(px, py);
    }
  } else {
    // Draw a clean line
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
  }
  
  ctx.stroke();
};

const drawArrow = (
  ctx: CanvasRenderingContext2D,
  element: DrawElement,
  jitter: number
) => {
  const { x, y, width, height } = element;
  const endX = x + width;
  const endY = y + height;
  
  // Draw the line
  drawLine(ctx, element, jitter);
  
  // Draw the arrowhead
  const angle = Math.atan2(endY - y, endX - x);
  const arrowSize = 12 + element.strokeWidth;
  
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - arrowSize * Math.cos(angle - Math.PI / 6) + randomJitter(jitter),
    endY - arrowSize * Math.sin(angle - Math.PI / 6) + randomJitter(jitter)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - arrowSize * Math.cos(angle + Math.PI / 6) + randomJitter(jitter),
    endY - arrowSize * Math.sin(angle + Math.PI / 6) + randomJitter(jitter)
  );
  ctx.stroke();
};

const drawFreedraw = (
  ctx: CanvasRenderingContext2D,
  element: DrawElement
) => {
  if (!element.points || element.points.length < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(element.points[0].x, element.points[0].y);
  
  for (let i = 1; i < element.points.length; i++) {
    ctx.lineTo(element.points[i].x, element.points[i].y);
  }
  
  ctx.stroke();
};

const drawText = (
  ctx: CanvasRenderingContext2D,
  element: DrawElement
) => {
  if (!element.text) return;
  
  const { x, y, fontSize = 16, fontFamily = 'sans-serif', textAlign = 'left' } = element;
  
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = textAlign as CanvasTextAlign;
  ctx.textBaseline = 'top';
  ctx.fillStyle = element.strokeColor;
  ctx.fillText(element.text, x, y);
};

const randomJitter = (amount: number) => {
  return (Math.random() - 0.5) * amount * 2;
};