import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
export type IconName = 'home' | 'book' | 'chart' | 'user' | 'bell' | 'arrow' | 'back' | 'folder' | 'close' | 'check' | 'settings';
export function Icon({name, size=24, color='#0b2453'}:{name:IconName;size?:number;color?:string}) {
  const paths: Partial<Record<IconName,string>> = {home:'M3 11 12 3l9 8v10h-6v-7H9v7H3Z',book:'M12 6C8 3 3 4 3 4v15s5-1 9 2c4-3 9-2 9-2V4s-5-1-9 2v15', user:'M4 21v-2a8 8 0 0 1 16 0v2ZM12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8',bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5Zm5 4h4',arrow:'M5 12h14m-5-5 5 5-5 5',back:'m14 5-7 7 7 7',folder:'M3 7h6l2-3h5l2 3h3v14H3Z',close:'m6 6 12 12M6 18 18 6',check:'m5 12 4 4L19 6',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2'};
  return <View accessible={false}><Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{name==='chart' ? <><Rect x="3" y="12" width="4" height="9" rx="1" fill={color}/><Rect x="10" y="3" width="4" height="18" rx="1" fill={color}/><Rect x="17" y="8" width="4" height="13" rx="1" fill={color}/></> : <Path d={paths[name]} fill={['home','user','folder'].includes(name)?color:'none'}/>}</Svg></View>;
}
