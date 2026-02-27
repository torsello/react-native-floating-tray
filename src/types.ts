import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle } from 'react-native';

/**
 * Color palette for the tray theme.
 */
export interface TrayTheme {
  /** Background color of the tray card */
  backgroundColor: string;
  /** Primary text color (title, labels) */
  textColor: string;
  /** Secondary/subtitle text color */
  secondaryTextColor: string;
  /** Color for the destructive variant rows */
  destructiveColor: string;
  /** Background tint for destructive rows */
  destructiveBackgroundColor: string;
  /** Backdrop overlay color */
  backdropColor: string;
  /** Row background color */
  rowBackgroundColor: string;
  /** Row pressed/highlight background */
  rowPressedColor: string;
  /** Header separator line color */
  separatorColor: string;
  /** Icon default tint color */
  iconColor: string;
}

/**
 * Global configuration for the tray system.
 */
export interface TrayConfig {
  /** Theme preset or custom theme object */
  theme?: 'light' | 'dark' | TrayTheme;
  /** Animation duration in ms (default: 350) */
  animationDuration?: number;
  /** Backdrop opacity when tray is open (default: 0.5) */
  backdropOpacity?: number;
  /** Border radius of the tray card (default: 24) */
  borderRadius?: number;
  /** Whether tapping the backdrop closes the tray (default: true) */
  closeOnBackdropPress?: boolean;
  /** Horizontal margin from screen edges (default: 12) */
  horizontalMargin?: number;
  /** Distance from the bottom of the screen (default: 12) */
  bottomOffset?: number;
  /** Automatically adjust tray position when keyboard opens (default: true) */
  keyboardAware?: boolean;
}

/**
 * Defines a single step/screen within the tray.
 */
export interface TrayStep {
  /** Unique identifier for this step */
  id: string;
  /** Title displayed in the tray header */
  title: string;
  /** Optional icon rendered in the header alongside the title */
  icon?: ReactNode;
  /** Content to render inside the tray body */
  content: ReactNode;
}

/**
 * Props for the main DynamicTray component.
 */
export interface DynamicTrayProps {
  /** Override global config for this specific tray instance */
  config?: Partial<TrayConfig>;
  /** Custom styles for the tray card container */
  style?: ViewStyle;
  /** Custom styles for the tray header */
  headerStyle?: ViewStyle;
  /** Custom styles for the header title text */
  titleStyle?: TextStyle;
}

/**
 * Props for the TrayRow component.
 */
export interface TrayRowProps {
  /** Icon element rendered on the left side of the row */
  icon?: ReactNode;
  /** Main label text */
  label: string;
  /** Optional subtitle text below the label */
  subtitle?: string;
  /** Visual variant: default or destructive (red) */
  variant?: 'default' | 'destructive';
  /** Show a right chevron arrow (default: true) */
  showChevron?: boolean;
  /** Callback when the row is pressed */
  onPress?: () => void;
  /** Custom styles for the row container */
  style?: ViewStyle;
  /** Whether the row is disabled */
  disabled?: boolean;
}

/**
 * Methods and state exposed by the useDynamicTray hook.
 */
export interface DynamicTrayContext {
  /** Open the tray with a set of steps */
  openTray: (steps: TrayStep[]) => void;
  /** Close the tray */
  closeTray: () => void;
  /** Navigate to the next step */
  pushStep: (step?: TrayStep) => void;
  /** Navigate to the previous step */
  popStep: () => void;
  /** Go to a specific step by index */
  goToStep: (index: number) => void;
  /** Whether the tray is currently visible */
  isOpen: boolean;
  /** Current step index */
  currentStepIndex: number;
  /** Current step object */
  currentStep: TrayStep | null;
  /** Total number of steps */
  totalSteps: number;
}
