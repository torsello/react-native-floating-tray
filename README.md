# react-native-dynamic-tray

A dynamic, animated tray/modal system for React Native — inspired by [Family's tray system](https://benji.org/family-values).

Floating card modals with animated transitions, multi-step navigation, backdrop dimming, and a configurable API similar to `@gorhom/bottom-sheet`.

## Demo

<p align="center">
  <img src="./media/demo-light.gif" alt="Light Mode Demo" width="300" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./media/demo-dark.gif" alt="Dark Mode Demo" width="300" />
</p>

<p align="center">
  <em>Light Mode</em>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <em>Dark Mode</em>
</p>

## Features

- 🎯 **Floating card tray** with customizable border radius, shadow, and margins
- 🔄 **Multi-step navigation** with animated height morphing + content cross-fade
- ↩️ **History-based back navigation** — always returns to the step you came from
- 🌗 **Light & Dark themes** built-in, plus fully custom themes
- ⚡ **Powered by Reanimated** for 60fps native-thread animations
- 📱 **Works with Expo & CLI** — no native linking required beyond Reanimated
- ♿ **Accessible** — built-in `accessibilityRole`, `accessibilityLabel`, and `accessibilityState`
- 🎛️ **Configurable** backdrop opacity, animation duration, close behavior, and more
- 🪶 **Lightweight** — `sideEffects: false`, tree-shakeable, zero runtime dependencies beyond peer deps

## Installation

```bash
npm install react-native-dynamic-tray
```

### Peer Dependencies

```bash
npm install react-native-reanimated
```

Follow the [Reanimated setup guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started) if not already installed.

### Optional

```bash
npm install react-native-safe-area-context
```

If installed, the tray automatically respects safe area insets (home indicator on iPhone X+).

## Quick Start

```tsx
import {
  DynamicTrayProvider,
  DynamicTray,
  TrayRow,
  useDynamicTray,
} from "react-native-dynamic-tray";

// 1. Wrap your app
function App() {
  return (
    <DynamicTrayProvider config={{ theme: "light", borderRadius: 24 }}>
      <HomeScreen />
      <DynamicTray />
    </DynamicTrayProvider>
  );
}

// 2. Open the tray from anywhere
function HomeScreen() {
  const { openTray, closeTray, goToStep } = useDynamicTray();

  const handleOpen = () => {
    openTray([
      {
        id: "options",
        title: "Options",
        content: (
          <View>
            <TrayRow
              icon={<LockIcon />}
              label="View Private Key"
              onPress={() => goToStep(1)}
              showChevron
            />
            <TrayRow
              icon={<TrashIcon />}
              label="Delete"
              variant="destructive"
              onPress={() => goToStep(2)}
            />
          </View>
        ),
      },
      {
        id: "detail",
        title: "Private Key",
        content: <Text>Your private key content here...</Text>,
      },
      {
        id: "confirm",
        title: "Are you sure?",
        content: <ConfirmDelete onConfirm={closeTray} />,
      },
    ]);
  };

  return <Button title="Open Tray" onPress={handleOpen} />;
}
```

## API Reference

### `<DynamicTrayProvider>`

Wrap your app to provide tray context.

| Prop     | Type                  | Description          |
| -------- | --------------------- | -------------------- |
| `config` | `Partial<TrayConfig>` | Global configuration |

### `TrayConfig`

| Property               | Type                             | Default   | Description              |
| ---------------------- | -------------------------------- | --------- | ------------------------ |
| `theme`                | `'light' \| 'dark' \| TrayTheme` | `'light'` | Color theme              |
| `animationDuration`    | `number`                         | `350`     | Animation duration in ms |
| `backdropOpacity`      | `number`                         | `0.5`     | Backdrop overlay opacity |
| `borderRadius`         | `number`                         | `24`      | Card border radius       |
| `closeOnBackdropPress` | `boolean`                        | `true`    | Tap backdrop to close    |
| `horizontalMargin`     | `number`                         | `12`      | Card left/right margin   |
| `bottomOffset`         | `number`                         | `12`      | Card bottom margin       |
| `keyboardAware`        | `boolean`                        | `true`    | Auto-adjust for keyboard |

### `<DynamicTray>`

The tray overlay component. Renders the modal, backdrop, header, and content.

| Prop          | Type                  | Description                   |
| ------------- | --------------------- | ----------------------------- |
| `config`      | `Partial<TrayConfig>` | Per-instance config overrides |
| `style`       | `ViewStyle`           | Custom card container styles  |
| `headerStyle` | `ViewStyle`           | Custom header styles          |
| `titleStyle`  | `TextStyle`           | Custom title text styles      |

### `useDynamicTray()`

Hook returning tray methods and state:

| Method/State       | Type                          | Description                      |
| ------------------ | ----------------------------- | -------------------------------- |
| `openTray(steps)`  | `(steps: TrayStep[]) => void` | Open with an array of steps      |
| `closeTray()`      | `() => void`                  | Close the tray                   |
| `pushStep(step)`   | `(step: TrayStep) => void`    | Add & navigate to a new step     |
| `popStep()`        | `() => void`                  | Go back to the previous step     |
| `goToStep(index)`  | `(index: number) => void`     | Navigate to a step by index      |
| `isOpen`           | `boolean`                     | Whether the tray is visible      |
| `currentStepIndex` | `number`                      | Index of the current step        |
| `currentStep`      | `TrayStep \| null`            | The current step object          |
| `totalSteps`       | `number`                      | Total number of registered steps |

### `<TrayRow>`

Pressable list row for use inside tray content. Automatically resolves the theme from context.

| Prop          | Type                         | Default     | Description         |
| ------------- | ---------------------------- | ----------- | ------------------- |
| `label`       | `string`                     | —           | Row text            |
| `icon`        | `ReactNode`                  | —           | Left icon           |
| `subtitle`    | `string`                     | —           | Secondary text      |
| `variant`     | `'default' \| 'destructive'` | `'default'` | Visual variant      |
| `showChevron` | `boolean`                    | `false`     | Right arrow         |
| `onPress`     | `() => void`                 | —           | Press handler       |
| `disabled`    | `boolean`                    | `false`     | Disable interaction |
| `style`       | `ViewStyle`                  | —           | Custom row styles   |

### `TrayTheme`

Full color customization:

```ts
{
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  destructiveColor: string;
  destructiveBackgroundColor: string;
  backdropColor: string;
  rowBackgroundColor: string;
  rowPressedColor: string;
  separatorColor: string;
  iconColor: string;
}
```

Built-in themes are exported as `lightTheme` and `darkTheme`.

## Running the Example

```bash
cd example
npm install
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Inspiration

This library is inspired by the tray system built by [Benji](https://twitter.com/beaborning) and the team at [Family](https://family.co). Their beautiful, fluid modal navigation in the Family app set the standard for what mobile UX should feel like. Read more about their design philosophy at [benji.org/family-values](https://benji.org/family-values).

## License

MIT
