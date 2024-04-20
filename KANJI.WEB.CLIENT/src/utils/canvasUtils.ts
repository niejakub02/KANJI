import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants';

export const createCanvas = () => {
  const newCanvas = document.createElement('canvas');
  newCanvas.classList.add('canvas');
  newCanvas.height = CANVAS_HEIGHT;
  newCanvas.width = CANVAS_WIDTH;
  return newCanvas;
};

export const drawSolidLine = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  context.lineWidth = 20;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = 'white';
  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
};

export const loadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export const drawImageOnCanvas = (
  source: string
): Promise<HTMLCanvasElement> => {
  const virtualCanvas = createCanvas();
  const virtualCtx = virtualCanvas.getContext('2d');
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = source;
    img.onload = () => {
      virtualCtx?.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      resolve(virtualCanvas);
    };
    img.onerror = reject;
  });
};
