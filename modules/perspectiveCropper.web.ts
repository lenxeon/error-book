import type { CropCorners, CropPoint } from './perspectiveCropper';

export function solveHomography(from: CropPoint[], to: CropPoint[]) {
  const rows: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = from[i];
    const { x: u, y: v } = to[i];
    rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    rows.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let column = 0; column < 8; column++) {
    let pivot = column;
    for (let row = column + 1; row < 8; row++) if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot = row;
    [rows[column], rows[pivot]] = [rows[pivot], rows[column]];
    const divisor = rows[column][column];
    if (Math.abs(divisor) < 1e-10) throw new Error('裁切四角太接近，无法校正。');
    for (let index = column; index < 9; index++) rows[column][index] /= divisor;
    for (let row = 0; row < 8; row++) {
      if (row === column) continue;
      const factor = rows[row][column];
      for (let index = column; index < 9; index++) rows[row][index] -= factor * rows[column][index];
    }
  }
  return rows.map(row => row[8]);
}

export async function perspectiveCrop(uri: string, corners: CropCorners) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const loaded = new Image();
    loaded.onload = () => resolve(loaded);
    loaded.onerror = () => reject(new Error('无法读取照片，请重新选择。'));
    loaded.src = uri;
  });
  const originalWidth = image.naturalWidth || image.width;
  const originalHeight = image.naturalHeight || image.height;
  const inputScale = Math.min(1, 4096 / Math.max(originalWidth, originalHeight));
  const width = Math.max(1, Math.round(originalWidth * inputScale));
  const height = Math.max(1, Math.round(originalHeight * inputScale));
  const source = [corners.topLeft, corners.topRight, corners.bottomRight, corners.bottomLeft].map(point => ({ x: point.x * width, y: point.y * height }));
  const edge = (a: CropPoint, b: CropPoint) => Math.hypot(a.x - b.x, a.y - b.y);
  const outputWidth = Math.min(2400, Math.max(1, Math.round(Math.max(edge(source[0], source[1]), edge(source[3], source[2])))));
  const outputHeight = Math.min(3200, Math.max(1, Math.round(Math.max(edge(source[0], source[3]), edge(source[1], source[2])))));
  const transform = solveHomography(
    [{ x: 0, y: 0 }, { x: outputWidth, y: 0 }, { x: outputWidth, y: outputHeight }, { x: 0, y: outputHeight }],
    source,
  );
  const input = document.createElement('canvas');
  input.width = width;
  input.height = height;
  const inputContext = input.getContext('2d', { willReadFrequently: true });
  if (!inputContext) throw new Error('无法处理照片。');
  inputContext.drawImage(image, 0, 0, width, height);
  const inputPixels = inputContext.getImageData(0, 0, width, height);
  const output = document.createElement('canvas');
  output.width = outputWidth;
  output.height = outputHeight;
  const outputContext = output.getContext('2d');
  if (!outputContext) throw new Error('无法处理照片。');
  const outputPixels = outputContext.createImageData(outputWidth, outputHeight);
  const [a, b, c, d, e, f, g, h] = transform;
  for (let y = 0; y < outputHeight; y++) {
    for (let x = 0; x < outputWidth; x++) {
      const denominator = g * x + h * y + 1;
      const sx = (a * x + b * y + c) / denominator;
      const sy = (d * x + e * y + f) / denominator;
      if (sx < 0 || sy < 0 || sx >= width - 1 || sy >= height - 1) continue;
      const x0 = Math.floor(sx), y0 = Math.floor(sy), dx = sx - x0, dy = sy - y0;
      const from = (y0 * width + x0) * 4, to = (y * outputWidth + x) * 4;
      for (let channel = 0; channel < 4; channel++) {
        const p00 = inputPixels.data[from + channel];
        const p10 = inputPixels.data[from + 4 + channel];
        const p01 = inputPixels.data[from + width * 4 + channel];
        const p11 = inputPixels.data[from + width * 4 + 4 + channel];
        outputPixels.data[to + channel] = p00 * (1 - dx) * (1 - dy) + p10 * dx * (1 - dy) + p01 * (1 - dx) * dy + p11 * dx * dy;
      }
    }
  }
  outputContext.putImageData(outputPixels, 0, 0);
  return output.toDataURL('image/jpeg', 0.94);
}
