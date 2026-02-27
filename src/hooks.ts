import { useContext } from 'react';
import { TrayContext, TrayConfigContext } from './DynamicTrayProvider';
import type { DynamicTrayContext, TrayConfig } from './types';

/**
 * Hook to access the dynamic tray methods and state.
 *
 * @example
 * ```tsx
 * const { openTray, closeTray, isOpen } = useDynamicTray();
 * ```
 */
export function useDynamicTray(): DynamicTrayContext {
  const context = useContext(TrayContext);
  if (!context) {
    throw new Error(
      'useDynamicTray must be used within a <DynamicTrayProvider>. ' +
      'Wrap your app with <DynamicTrayProvider> to use the dynamic tray system.'
    );
  }
  return context;
}

/**
 * Hook to access the resolved tray configuration.
 */
export function useTrayConfig(): Required<TrayConfig> {
  return useContext(TrayConfigContext);
}
