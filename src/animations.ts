import { Easing, WithTimingConfig, WithSpringConfig } from 'react-native-reanimated';

/**
 * Default spring configuration for tray animations.
 * Produces a smooth, slightly bouncy feel.
 */
export const defaultSpringConfig: WithSpringConfig = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/**
 * Default timing config for fade/opacity animations.
 */
export const defaultTimingConfig: WithTimingConfig = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

/**
 * Fast timing config for quick transitions.
 */
export const fastTimingConfig: WithTimingConfig = {
  duration: 200,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

/**
 * Content transition timing — slightly slower for content morphing.
 */
export const contentTransitionConfig: WithTimingConfig = {
  duration: 350,
  easing: Easing.bezier(0.4, 0.0, 0.2, 1),
};
