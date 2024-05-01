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

export const convertImageToGrayscaleArray = (
  canvasContainer: HTMLDivElement | null
): number[] | null => {
  if (!canvasContainer) return null;
  const height = 64;
  const width = 64;

  const virtualCanvas = document.createElement('canvas');
  virtualCanvas.height = height;
  virtualCanvas.width = width;
  const virtualCtx = virtualCanvas.getContext('2d');

  if (!virtualCtx) return null;

  virtualCtx.fillStyle = 'black';
  virtualCtx.fillRect(0, 0, virtualCanvas.width, virtualCanvas.height);

  const atomicCanvas = [...canvasContainer.children] as HTMLCanvasElement[];

  for (const canvas of atomicCanvas) {
    virtualCtx.drawImage(canvas, 0, 0, width, height);
  }

  if (!virtualCtx) return null;
  const uintarray = virtualCtx.getImageData(0, 0, 64, 64);
  const grayscaleArray = [];

  for (let i = 0; i < uintarray.data.length; i += 4) {
    grayscaleArray.push(
      (0.299 * uintarray.data[i] +
        0.587 * uintarray.data[i + 1] +
        0.114 * uintarray.data[i + 2]) /
        255.0
    );
  }

  return grayscaleArray;
};
