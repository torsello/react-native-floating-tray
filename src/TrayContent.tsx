import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import type { TrayStep, TrayTheme } from './types';

interface TrayContentProps {
  /** Current step to render */
  step: TrayStep;
  /** Index of the current step (used for transition detection) */
  stepIndex: number;
  /** Theme (reserved for future styling) */
  theme: TrayTheme;
  /** Base animation duration in ms */
  animationDuration: number;
}

/**
 * Animated content wrapper that handles cross-fade and height-morph
 * transitions when navigating between tray steps.
 *
 * Uses a two-phase animation:
 * 1. Fade out current content (25% of duration)
 * 2. Swap content + fade in new content (35% of duration)
 *
 * Height changes are spring-animated for a fluid feel.
 *
 * @internal This component is not part of the public API.
 */
export const TrayContent = memo(function TrayContent({
  step,
  stepIndex,
  theme,
  animationDuration,
}: TrayContentProps) {
  const [displayedStep, setDisplayedStep] = useState(step);
  const contentOpacity = useSharedValue(1);
  const contentHeight = useSharedValue(0);
  const isFirstMeasure = useRef(true);
  const prevStepId = useRef(step.id);

  // Reset first-measure flag when the tray is opened with new steps
  useEffect(() => {
    if (step.id !== prevStepId.current) {
      prevStepId.current = step.id;

      // Fade out → swap → fade in
      contentOpacity.value = withTiming(0, {
        duration: animationDuration * 0.25,
      });

      const timer = setTimeout(() => {
        setDisplayedStep(step);
        contentOpacity.value = withTiming(1, {
          duration: animationDuration * 0.35,
        });
      }, animationDuration * 0.25);

      return () => clearTimeout(timer);
    } else {
      // Same step (initial mount or re-render with same step)
      setDisplayedStep(step);
    }
  }, [step.id, animationDuration]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;

      if (isFirstMeasure.current) {
        // First measurement — snap to height (no animation)
        contentHeight.value = height;
        isFirstMeasure.current = false;
      } else {
        // Subsequent measurements — spring animate
        contentHeight.value = withSpring(height, {
          damping: 25,
          stiffness: 180,
          mass: 0.8,
        });
      }
    },
    [contentHeight],
  );

  const containerStyle = useAnimatedStyle(() => {
    if (contentHeight.value === 0) {
      return {};
    }
    return {
      height: contentHeight.value,
    };
  });

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[styles.content, opacityStyle]}
        onLayout={handleLayout}
      >
        {displayedStep.content}
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    paddingBottom: 16,
  },
});
