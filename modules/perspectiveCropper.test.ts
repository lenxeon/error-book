import assert from 'node:assert/strict';
import test from 'node:test';
import { solveHomography } from './perspectiveCropper.web';
import type { CropPoint } from './perspectiveCropper';

function transform(point: CropPoint, coefficients: number[]): CropPoint {
  const [a, b, c, d, e, f, g, h] = coefficients;
  const denominator = g * point.x + h * point.y + 1;
  return { x: (a * point.x + b * point.y + c) / denominator, y: (d * point.x + e * point.y + f) / denominator };
}

test('透视矩阵将矩形四角准确映射到倾斜纸面四角', () => {
  const rect = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 140 }, { x: 0, y: 140 }];
  const trapezoid = [{ x: 18, y: 12 }, { x: 91, y: 4 }, { x: 100, y: 128 }, { x: 6, y: 136 }];
  const matrix = solveHomography(rect, trapezoid);

  rect.forEach((point, index) => {
    const actual = transform(point, matrix);
    assert.ok(Math.abs(actual.x - trapezoid[index].x) < 1e-7);
    assert.ok(Math.abs(actual.y - trapezoid[index].y) < 1e-7);
  });
});

test('透视矩阵在无倾斜时保持像素坐标不变', () => {
  const corners = [{ x: 0, y: 0 }, { x: 320, y: 0 }, { x: 320, y: 180 }, { x: 0, y: 180 }];
  const matrix = solveHomography(corners, corners);

  corners.forEach(point => {
    const actual = transform(point, matrix);
    assert.ok(Math.abs(actual.x - point.x) < 1e-7);
    assert.ok(Math.abs(actual.y - point.y) < 1e-7);
  });
});
