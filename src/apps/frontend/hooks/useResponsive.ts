import { useMemo } from "react";
import { useWindowDimensions, StyleProp, ViewStyle } from "react-native";

const Breakpoints = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 992,
  xl: 1280,
} as const;

type BreakpointKeys = keyof typeof Breakpoints;

export type ResponsiveStyle<T extends ViewStyle> = {
  [breakpointKey in BreakpointKeys]: StyleProp<T>;
};

export function useResponsive<T extends object = any>(
  styleMap: ResponsiveStyle<T>
): undefined | StyleProp<T> {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    let active: StyleProp<T> | undefined;

    for (const key in Breakpoints) {
      const value: number = Breakpoints[key as BreakpointKeys];
      if (width >= value) {
        active = styleMap[key as BreakpointKeys];
      }
    }

    return active;
  }, [width, styleMap]);
}

export default useResponsive;
