import type { TrayTheme, TrayConfig } from './types';

export const lightTheme: TrayTheme = {
  backgroundColor: '#FFFFFF',
  textColor: '#1A1A1A',
  secondaryTextColor: '#8E8E93',
  destructiveColor: '#FF3B30',
  destructiveBackgroundColor: 'rgba(255, 59, 48, 0.1)',
  backdropColor: '#000000',
  rowBackgroundColor: '#F2F2F7',
  rowPressedColor: '#E5E5EA',
  separatorColor: '#E5E5EA',
  iconColor: '#3C3C43',
};

export const darkTheme: TrayTheme = {
  backgroundColor: '#1C1C1E',
  textColor: '#FFFFFF',
  secondaryTextColor: '#8E8E93',
  destructiveColor: '#FF453A',
  destructiveBackgroundColor: 'rgba(255, 69, 58, 0.15)',
  backdropColor: '#000000',
  rowBackgroundColor: '#2C2C2E',
  rowPressedColor: '#3A3A3C',
  separatorColor: '#38383A',
  iconColor: '#EBEBF5',
};

export const defaultConfig: Required<TrayConfig> = {
  theme: 'light',
  animationDuration: 350,
  backdropOpacity: 0.5,
  borderRadius: 24,
  closeOnBackdropPress: true,
  horizontalMargin: 12,
  bottomOffset: 12,
  keyboardAware: true,
};

/**
 * Resolves the theme from a config value.
 */
export function resolveTheme(theme: TrayConfig['theme']): TrayTheme {
  if (!theme || theme === 'light') return lightTheme;
  if (theme === 'dark') return darkTheme;
  return theme;
}

/**
 * Merges user config with defaults.
 */
export function resolveConfig(userConfig?: Partial<TrayConfig>): Required<TrayConfig> {
  return { ...defaultConfig, ...userConfig };
}
