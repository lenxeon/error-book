import React from 'react';
import { Image, View, StyleProp, ViewStyle } from 'react-native';

// Each component points to a small, independently bundled crop from the design.
const art = {
  avatar: { source: require('../../assets/images/sprites/avatar.png'), width: 64, height: 65 },
  camera: { source: require('../../assets/images/sprites/camera.png'), width: 77, height: 64 },
  robot: { source: require('../../assets/images/sprites/robot.png'), width: 77, height: 64 },
  notebook: { source: require('../../assets/images/sprites/notebook.png'), width: 77, height: 64 },
  printer: { source: require('../../assets/images/sprites/printer.png'), width: 75, height: 64 },
  fox: { source: require('../../assets/images/sprites/fox.png'), width: 105, height: 105 },
  bulb: { source: require('../../assets/images/sprites/bulb.png'), width: 32, height: 39 },
  paper1: { source: require('../../assets/images/sprites/paper1.png'), width: 102, height: 46 },
  paper2: { source: require('../../assets/images/sprites/paper2.png'), width: 95, height: 46 },
  paper3: { source: require('../../assets/images/sprites/paper3.png'), width: 94, height: 46 },
} as const;

export type DesignArtName = keyof typeof art;

export function DesignArt({ name, width, height, style, stretch = false }: {
  name: DesignArtName;
  width: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  stretch?: boolean;
}) {
  const sprite = art[name];
  const scale = Math.max(width / sprite.width, height ? height / sprite.height : 0);
  const imageWidth = stretch && height ? width : sprite.width * scale;
  const imageHeight = stretch && height ? height : sprite.height * scale;

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height: height ?? imageHeight, overflow: 'hidden' }, style]}
    >
      <Image source={sprite.source} resizeMode="stretch" style={{ width: imageWidth, height: imageHeight }} />
    </View>
  );
}
