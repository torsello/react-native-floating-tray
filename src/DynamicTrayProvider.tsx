import React, { createContext, useCallback, useMemo, useReducer } from 'react';
import type { TrayConfig, TrayStep, DynamicTrayContext } from './types';
import { resolveConfig } from './theme';

// ─── State ──────────────────────────────────────────────────────────

/** @internal */
type TrayState = {
  isOpen: boolean;
  steps: TrayStep[];
  currentStepIndex: number;
  /** Navigation history stack for proper back-navigation */
  history: number[];
};

/** @internal */
type TrayAction =
  | { type: 'OPEN'; steps: TrayStep[] }
  | { type: 'CLOSE' }
  | { type: 'PUSH_STEP'; step: TrayStep }
  | { type: 'POP_STEP' }
  | { type: 'GO_TO_STEP'; index: number }
  | { type: 'RESET' };

const initialState: TrayState = {
  isOpen: false,
  steps: [],
  currentStepIndex: 0,
  history: [],
};

function trayReducer(state: TrayState, action: TrayAction): TrayState {
  switch (action.type) {
    case 'OPEN':
      return {
        isOpen: true,
        steps: action.steps,
        currentStepIndex: 0,
        history: [0],
      };
    case 'CLOSE':
      return {
        ...state,
        isOpen: false,
      };
    case 'RESET':
      return initialState;
    case 'PUSH_STEP': {
      const nextIndex = state.steps.length;
      return {
        ...state,
        steps: [...state.steps, action.step],
        currentStepIndex: nextIndex,
        history: [...state.history, nextIndex],
      };
    }
    case 'POP_STEP': {
      const newHistory = state.history.slice(0, -1);
      if (newHistory.length === 0) {
        return { ...state, isOpen: false };
      }
      return {
        ...state,
        currentStepIndex: newHistory[newHistory.length - 1],
        history: newHistory,
      };
    }
    case 'GO_TO_STEP': {
      const clampedIndex = Math.max(
        0,
        Math.min(action.index, state.steps.length - 1),
      );
      return {
        ...state,
        currentStepIndex: clampedIndex,
        history: [...state.history, clampedIndex],
      };
    }
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────

/** @internal Context providing tray methods and state */
export const TrayContext = createContext<DynamicTrayContext | null>(null);

/** @internal Context providing resolved tray configuration */
export const TrayConfigContext = createContext<Required<TrayConfig>>(
  resolveConfig(),
);

// ─── Provider ───────────────────────────────────────────────────────

interface DynamicTrayProviderProps {
  children: React.ReactNode;
  /** Global tray configuration. Per-instance overrides can be set on `<DynamicTray>`. */
  config?: Partial<TrayConfig>;
}

/**
 * Context provider that manages the tray state and configuration.
 *
 * Wrap your application (or the subtree that uses trays) with this provider.
 * All `<DynamicTray>` instances and `useDynamicTray()` calls must be
 * descendants of this provider.
 *
 * @example
 * ```tsx
 * <DynamicTrayProvider config={{ theme: 'dark', borderRadius: 28 }}>
 *   <App />
 *   <DynamicTray />
 * </DynamicTrayProvider>
 * ```
 */
export function DynamicTrayProvider({
  children,
  config,
}: DynamicTrayProviderProps) {
  const [state, dispatch] = useReducer(trayReducer, initialState);

  const resolvedConfig = useMemo(() => resolveConfig(config), [
    config?.theme,
    config?.animationDuration,
    config?.backdropOpacity,
    config?.borderRadius,
    config?.closeOnBackdropPress,
    config?.horizontalMargin,
    config?.bottomOffset,
    config?.keyboardAware,
  ]);

  const openTray = useCallback((steps: TrayStep[]) => {
    dispatch({ type: 'OPEN', steps });
  }, []);

  const closeTray = useCallback(() => {
    dispatch({ type: 'CLOSE' });
  }, []);

  // pushStep doesn't depend on currentStepIndex — the reducer handles it
  const pushStep = useCallback((step?: TrayStep) => {
    if (step) {
      dispatch({ type: 'PUSH_STEP', step });
    }
  }, []);

  const popStep = useCallback(() => {
    dispatch({ type: 'POP_STEP' });
  }, []);

  const goToStep = useCallback((index: number) => {
    dispatch({ type: 'GO_TO_STEP', index });
  }, []);

  const currentStep = state.steps[state.currentStepIndex] ?? null;

  const contextValue: DynamicTrayContext = useMemo(
    () => ({
      openTray,
      closeTray,
      pushStep,
      popStep,
      goToStep,
      isOpen: state.isOpen,
      currentStepIndex: state.currentStepIndex,
      currentStep,
      totalSteps: state.steps.length,
    }),
    [
      openTray,
      closeTray,
      pushStep,
      popStep,
      goToStep,
      state.isOpen,
      state.currentStepIndex,
      currentStep,
      state.steps.length,
    ],
  );

  return (
    <TrayConfigContext.Provider value={resolvedConfig}>
      <TrayContext.Provider value={contextValue}>
        {children}
      </TrayContext.Provider>
    </TrayConfigContext.Provider>
  );
}
