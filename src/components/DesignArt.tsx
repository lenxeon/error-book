import React from 'react';
import { Image, View, StyleProp, ViewStyle } from 'react-native';

// Render the supplied reference as an atlas. No AI redraw: original color and matte shading stay intact.
// Coordinates refer to the 1536 × 1024 design board. Only artwork areas are selected.
export const crops = {
  hero: [350, 144, 423, 194],
  camera: [375, 354, 77, 64], robot: [473, 354, 77, 64],
  notebook: [571, 354, 77, 64], printer: [669, 354, 75, 64],
  avatar: [1270, 81, 64, 65], fox: [1038, 889, 105, 105],
  sky: [1095, 69, 160, 96], bulb: [1102, 870, 32, 39], taskRight: [1390, 729, 123, 59],
  task: [366, 490, 108, 108], paper1: [1182, 892, 102, 46],
  paper2: [1300, 892, 95, 46], paper3: [1412, 892, 94, 46],
} as const;
export function DesignArt({ name, width, height, style, stretch=false }: { name: keyof typeof crops; width: number; height?: number; style?: StyleProp<ViewStyle>; stretch?:boolean }) {
  const [x, y, w, h] = crops[name]; const scale = Math.max(width / w, height ? height / h : 0);
  const sx=stretch?width/w:scale, sy=stretch&&height?height/h:scale;
  return <View accessible={false} importantForAccessibility="no-hide-descendants" style={[{ width, height: height ?? h * scale, overflow: 'hidden' }, style]}><Image source={require('../../assets/images/design-atlas.png')} resizeMode="stretch" style={{ position: 'absolute', width: 1536 * sx, height: 1024 * sy, left: -x * sx, top: -y * sy }} /></View>;
}
