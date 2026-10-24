import { requireNativeModule } from 'expo-modules-core';

export type CropPoint = { x: number; y: number };
export type CropCorners = { topLeft: CropPoint; topRight: CropPoint; bottomRight: CropPoint; bottomLeft: CropPoint };

type PerspectiveCropperNative = {
  perspectiveCrop(uri: string, coordinates: number[]): Promise<string>;
};

const native = requireNativeModule<PerspectiveCropperNative>('PerspectiveCropper');

export function perspectiveCrop(uri: string, corners: CropCorners) {
  const coordinates = [
    corners.topLeft.x, corners.topLeft.y,
    corners.topRight.x, corners.topRight.y,
    corners.bottomRight.x, corners.bottomRight.y,
    corners.bottomLeft.x, corners.bottomLeft.y,
  ];
  return native.perspectiveCrop(uri, coordinates);
}
