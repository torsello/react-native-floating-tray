import React, { memo } from 'react';
import { StyleSheet, Text, Pressable, View, ViewStyle, TextStyle } from 'react-native';
import type { TrayTheme } from './types';

interface TrayHeaderProps {
  /** Title text displayed in the header */
  title: string;
  /** Whether this is the first step (shows ✕ instead of ←) */
  isFirstStep: boolean;
  /** Called when the close button (✕) is pressed */
  onClose: () => void;
  /** Called when the back button (←) is pressed */
  onBack: () => void;
  /** Theme used for colors */
  theme: TrayTheme;
  /** Custom styles for the header container */
  style?: ViewStyle;
  /** Custom styles for the title text */
  titleStyle?: TextStyle;
}

/**
 * Header bar for the tray — shows a title and a close/back action button.
 *
 * - First step: displays ✕ (close)
 * - Subsequent steps: displays ← (back)
 *
 * @internal This component is not part of the public API.
 */
export const TrayHeader = memo(function TrayHeader({
  title,
  isFirstStep,
  onClose,
  onBack,
  theme,
  style,
  titleStyle,
}: TrayHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, { color: theme.textColor }, titleStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <Pressable
        onPress={isFirstStep ? onClose : onBack}
        style={({ pressed }) => [
          styles.actionButton,
          {
            backgroundColor: pressed
              ? theme.rowPressedColor
              : theme.rowBackgroundColor,
          },
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={isFirstStep ? 'Close' : 'Go back'}
      >
        <Text style={[styles.iconText, { color: theme.textColor }]}>
          {isFirstStep ? '✕' : '←'}
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
