import React, { memo } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import type { TrayTheme } from './types';

interface BackdropProps {
  /** Animated progress value (0 = hidden, 1 = fully visible) */
  progress: SharedValue<number>;
  /** Called when the backdrop is pressed */
  onPress?: () => void;
  /** Theme used for backdrop color */
  theme: TrayTheme;
  /** Maximum opacity of the backdrop overlay */
  backdropOpacity: number;
}

/**
 * Animated backdrop overlay rendered behind the tray card.
 * Fades in/out based on the `progress` shared value.
 *
 * @internal This component is not part of the public API.
 */
export const Backdrop = memo(function Backdrop({
  progress,
  onPress,
  theme,
  backdropOpacity,
}: BackdropProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, backdropOpacity]),
  }));

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: theme.backdropColor },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
