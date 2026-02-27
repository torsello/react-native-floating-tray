import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import type { TrayRowProps } from './types';
import { useTrayConfig } from './hooks';
import { resolveTheme } from './theme';

/**
 * A pressable list row for use inside a DynamicTray step.
 *
 * Automatically resolves the current theme from the nearest
 * `DynamicTrayProvider` context — no need to pass theme manually.
 *
 * @example
 * ```tsx
 * <TrayRow
 *   icon={<LockIcon />}
 *   label="View Private Key"
 *   subtitle="Tap to reveal"
 *   showChevron
 *   onPress={handlePress}
 * />
 *
 * <TrayRow
 *   icon={<TrashIcon />}
 *   label="Remove Wallet"
 *   variant="destructive"
 *   onPress={handleDelete}
 * />
 * ```
 */
export const TrayRow = memo(function TrayRow({
  icon,
  label,
  subtitle,
  variant = 'default',
  showChevron = false,
  onPress,
  style,
  disabled = false,
}: TrayRowProps) {
  const config = useTrayConfig();
  const theme = useMemo(() => resolveTheme(config.theme), [config.theme]);

  const isDestructive = variant === 'destructive';

  const rowBackgroundColor = isDestructive
    ? theme.destructiveBackgroundColor
    : theme.rowBackgroundColor;

  const textColor = isDestructive ? theme.destructiveColor : theme.textColor;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed
            ? isDestructive
              ? theme.destructiveBackgroundColor
              : theme.rowPressedColor
            : rowBackgroundColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      <View style={styles.labelContainer}>
        <Text
          style={[styles.label, { color: textColor }]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: theme.secondaryTextColor }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <Text style={[styles.chevron, { color: theme.secondaryTextColor }]}>
          ›
        </Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
    marginLeft: 8,
  },
});
