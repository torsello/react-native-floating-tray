import React, { useCallback, useEffect, useContext, useState, useMemo } from 'react';
import {
  StyleSheet,
  Modal,
  View,
  KeyboardAvoidingView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Backdrop } from './Backdrop';
import { TrayHeader } from './TrayHeader';
import { TrayContent } from './TrayContent';
import { TrayContext, TrayConfigContext } from './DynamicTrayProvider';
import { resolveTheme } from './theme';
import type { DynamicTrayProps, TrayTheme } from './types';

// ─── Optional safe-area-context integration ─────────────────────────
// If react-native-safe-area-context is installed, we use its insets
// to position the tray above the home indicator. Otherwise we fall
// back to zero insets. This keeps the peer dependency optional.

let _useSafeAreaInsets:
  | (() => { bottom: number; top: number; left: number; right: number })
  | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const safeAreaModule = require('react-native-safe-area-context');
  _useSafeAreaInsets = safeAreaModule.useSafeAreaInsets;
} catch {
  // safe-area-context not installed — noop
}

const FALLBACK_INSETS = Object.freeze({
  bottom: 0,
  top: 0,
  left: 0,
  right: 0,
});

// ─── Component ──────────────────────────────────────────────────────

/**
 * The main tray overlay component.
 *
 * Renders a floating card modal with animated entry/exit, a dimmed
 * backdrop, a header with close/back actions, and step content with
 * cross-fade + height-morph transitions.
 *
 * Must be rendered inside a `<DynamicTrayProvider>`.
 *
 * @example
 * ```tsx
 * <DynamicTrayProvider>
 *   <App />
 *   <DynamicTray />
 * </DynamicTrayProvider>
 * ```
 */
export function DynamicTray({
  config: instanceConfig,
  style,
  headerStyle,
  titleStyle,
}: DynamicTrayProps = {}) {
  // ── Contexts & dimensions ──────────────────────────────────────
  const trayContext = useContext(TrayContext);
  const globalConfig = useContext(TrayConfigContext);
  const { height: screenHeight } = useWindowDimensions();
  const insets = _useSafeAreaInsets ? _useSafeAreaInsets() : FALLBACK_INSETS;

  // ── Derived config (memoized) ──────────────────────────────────
  const mergedConfig = useMemo(
    () => ({ ...globalConfig, ...instanceConfig }),
    [globalConfig, instanceConfig],
  );
  const theme: TrayTheme = useMemo(
    () => resolveTheme(mergedConfig.theme),
    [mergedConfig.theme],
  );

  // ── Animation shared values ────────────────────────────────────
  const progress = useSharedValue(0);
  const translateY = useSharedValue(screenHeight);
  const [modalVisible, setModalVisible] = useState(false);

  // ── Validate context ───────────────────────────────────────────
  // Placed AFTER all hooks to comply with Rules of Hooks
  if (!trayContext) {
    throw new Error(
      'DynamicTray must be used within a <DynamicTrayProvider>. ' +
        'Wrap your app with <DynamicTrayProvider> to use the tray system.',
    );
  }

  const {
    isOpen,
    currentStep,
    currentStepIndex,
    closeTray,
    popStep,
  } = trayContext;

  // ── Entry / exit animations ────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      progress.value = withTiming(1, {
        duration: mergedConfig.animationDuration,
      });
      translateY.value = withSpring(0, {
        damping: 28,
        stiffness: 200,
        mass: 0.8,
      });
    } else if (modalVisible) {
      const closeDuration = mergedConfig.animationDuration * 0.6;
      progress.value = withTiming(0, { duration: closeDuration });
      translateY.value = withTiming(screenHeight * 0.5, {
        duration: closeDuration,
      });
      const timer = setTimeout(() => {
        setModalVisible(false);
      }, closeDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ── Animated styles ────────────────────────────────────────────
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, 0.8, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // ── Handlers (stable refs) ─────────────────────────────────────
  const handleBackdropPress = useCallback(() => {
    if (mergedConfig.closeOnBackdropPress) {
      closeTray();
    }
  }, [mergedConfig.closeOnBackdropPress, closeTray]);

  const handleClose = useCallback(() => {
    closeTray();
  }, [closeTray]);

  const handleBack = useCallback(() => {
    popStep();
  }, [popStep]);

  // ── Layout calculations ────────────────────────────────────────
  const isFirstStep = currentStepIndex === 0;
  const bottomMargin = mergedConfig.bottomOffset + insets.bottom;

  // ── Early return (after hooks) ─────────────────────────────────
  if (!modalVisible && !isOpen) {
    return null;
  }

  // ── Render ─────────────────────────────────────────────────────
  const Wrapper = mergedConfig.keyboardAware ? KeyboardAvoidingView : View;
  const wrapperProps = mergedConfig.keyboardAware
    ? {
        behavior: Platform.OS === 'ios' ? 'padding' as const : undefined,
        style: styles.overlay,
        // Compensate for the safe area bottom inset — when the keyboard
        // is open the home indicator area is covered, so we subtract it
        keyboardVerticalOffset: -insets.bottom,
      }
    : { style: styles.overlay };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Wrapper {...wrapperProps}>
        <Backdrop
          progress={progress}
          onPress={handleBackdropPress}
          theme={theme}
          backdropOpacity={mergedConfig.backdropOpacity}
        />

        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.backgroundColor,
              borderRadius: mergedConfig.borderRadius,
              marginHorizontal: mergedConfig.horizontalMargin,
              marginBottom: bottomMargin,
              maxHeight: screenHeight * 0.85,
              paddingBottom: 8,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 24,
                },
                android: {
                  elevation: 24,
                },
              }),
            },
            cardAnimatedStyle,
            style,
          ]}
        >
          {currentStep && (
            <>
              <TrayHeader
                title={currentStep.title}
                isFirstStep={isFirstStep}
                onClose={handleClose}
                onBack={handleBack}
                theme={theme}
                style={headerStyle}
                titleStyle={titleStyle}
              />
              <TrayContent
                step={currentStep}
                stepIndex={currentStepIndex}
                theme={theme}
                animationDuration={mergedConfig.animationDuration}
              />
            </>
          )}
        </Animated.View>
      </Wrapper>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    overflow: 'hidden',
  },
});
