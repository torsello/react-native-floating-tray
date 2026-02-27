import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  DynamicTrayProvider,
  DynamicTray,
  TrayRow,
  useDynamicTray,
} from 'react-native-dynamic-tray';
import type { TrayStep } from 'react-native-dynamic-tray';

// ─── Demo Icons ────────────────────────────────────────────────────
function IconLock() { return <Text style={{ fontSize: 18 }}>🔒</Text>; }
function IconGrid() { return <Text style={{ fontSize: 18 }}>📋</Text>; }
function IconWarning() { return <Text style={{ fontSize: 18 }}>⚠️</Text>; }
function IconStar() { return <Text style={{ fontSize: 18 }}>⭐</Text>; }
function IconSend() { return <Text style={{ fontSize: 18 }}>📤</Text>; }
function IconSettings() { return <Text style={{ fontSize: 18 }}>⚙️</Text>; }

// ─── Demo Screen ───────────────────────────────────────────────────
function DemoScreen({ isDark }: { isDark: boolean }) {
  const { openTray, closeTray, goToStep } = useDynamicTray();

  const openWalletOptions = () => {
    const steps: TrayStep[] = [
      {
        id: 'options',
        title: 'Options',
        content: (
          <View>
            <TrayRow
              icon={<IconLock />}
              label="View Private Key"
              onPress={() => goToStep(1)}
            />
            <TrayRow
              icon={<IconGrid />}
              label="View Recovery Phrase"
              onPress={() => goToStep(2)}
            />
            <TrayRow
              icon={<IconWarning />}
              label="Remove Wallet"
              variant="destructive"
              onPress={() => goToStep(3)}
            />
          </View>
        ),
      },
      {
        id: 'private-key',
        title: 'Private Key',
        content: (
          <View style={innerStyles.stepContent}>
            <Text style={innerStyles.stepIcon}>🔐</Text>
            <Text style={[innerStyles.stepTitle, isDark && innerStyles.lightText]}>
              Your Private Key
            </Text>
            <Text style={[innerStyles.stepDescription, isDark && innerStyles.lightSubtext]}>
              Never share your private key with anyone.{'\n'}
              Anyone who has your key can access your funds.
            </Text>
            <View style={[innerStyles.keyBox, isDark && { backgroundColor: '#2C2C2E' }]}>
              <Text style={[innerStyles.keyText, isDark && innerStyles.lightText]}>
                0x7a9f...3b2c...8d4e...1f0a
              </Text>
            </View>
          </View>
        ),
      },
      {
        id: 'recovery',
        title: 'Recovery Phrase',
        content: (
          <View style={innerStyles.stepContent}>
            <Text style={innerStyles.stepIcon}>📝</Text>
            <Text style={[innerStyles.stepTitle, isDark && innerStyles.lightText]}>
              Recovery Phrase
            </Text>
            <Text style={[innerStyles.stepDescription, isDark && innerStyles.lightSubtext]}>
              Write these 12 words down and keep them safe.
            </Text>
            <View style={innerStyles.phraseGrid}>
              {['apple', 'banana', 'cherry', 'dolphin', 'eclipse', 'forest',
                'guitar', 'harbor', 'island', 'jungle', 'kite', 'lemon'].map((word, i) => (
                <View
                  key={word}
                  style={[innerStyles.phraseItem, isDark && { backgroundColor: '#2C2C2E' }]}
                >
                  <Text style={innerStyles.phraseNumber}>{i + 1}</Text>
                  <Text style={[innerStyles.phraseWord, isDark && innerStyles.lightText]}>
                    {word}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ),
      },
      {
        id: 'remove',
        title: 'Remove Wallet',
        content: (
          <View style={innerStyles.stepContent}>
            <Text style={innerStyles.stepIcon}>🗑️</Text>
            <Text style={[innerStyles.stepTitle, isDark && innerStyles.lightText]}>
              Are you sure?
            </Text>
            <Text style={[innerStyles.stepDescription, isDark && innerStyles.lightSubtext]}>
              This action cannot be undone. Make sure you have backed up your recovery phrase before removing this wallet.
            </Text>
            <TouchableOpacity
              style={innerStyles.destructiveButton}
              onPress={closeTray}
              activeOpacity={0.8}
            >
              <Text style={innerStyles.destructiveButtonText}>Remove Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[innerStyles.cancelButton, isDark && { backgroundColor: '#2C2C2E' }]}
              onPress={() => goToStep(0)}
              activeOpacity={0.8}
            >
              <Text style={[innerStyles.cancelButtonText, isDark && innerStyles.lightText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ),
      },
    ];

    openTray(steps);
  };

  const openSettingsTray = () => {
    openTray([
      {
        id: 'settings',
        title: 'Settings',
        content: (
          <View>
            <TrayRow icon={<IconSettings />} label="Preferences" subtitle="Customize your experience" showChevron onPress={() => {}} />
            <TrayRow icon={<IconStar />} label="Rate the App" subtitle="Help us improve" showChevron onPress={() => {}} />
            <TrayRow icon={<IconSend />} label="Send Feedback" onPress={() => {}} />
          </View>
        ),
      },
    ]);
  };

  const openDeepFlow = () => {
    openTray([
      {
        id: 'send-start',
        title: 'Send',
        content: (
          <View style={innerStyles.stepContent}>
            <Text style={innerStyles.stepIcon}>📤</Text>
            <Text style={[innerStyles.stepTitle, isDark && innerStyles.lightText]}>
              Send Tokens
            </Text>
            <Text style={[innerStyles.stepDescription, isDark && innerStyles.lightSubtext]}>
              Choose an asset to send to another wallet address.
            </Text>
            <TouchableOpacity
              style={[innerStyles.continueButton, { backgroundColor: '#AF52DE' }]}
              onPress={() => goToStep(1)}
              activeOpacity={0.85}
            >
              <Text style={innerStyles.destructiveButtonText}>Choose Asset →</Text>
            </TouchableOpacity>
          </View>
        ),
      },
      {
        id: 'choose-asset',
        title: 'Choose Asset',
        content: (
          <View>
            <TrayRow icon={<Text style={{ fontSize: 18 }}>₿</Text>} label="Bitcoin" subtitle="0.0042 BTC" showChevron onPress={() => goToStep(2)} />
            <TrayRow icon={<Text style={{ fontSize: 18 }}>Ξ</Text>} label="Ethereum" subtitle="1.25 ETH" showChevron onPress={() => goToStep(2)} />
            <TrayRow icon={<Text style={{ fontSize: 18 }}>◎</Text>} label="Solana" subtitle="32.5 SOL" showChevron onPress={() => goToStep(2)} />
            <TrayRow icon={<Text style={{ fontSize: 18 }}>💵</Text>} label="USDC" subtitle="500.00 USDC" showChevron onPress={() => goToStep(2)} />
          </View>
        ),
      },
      {
        id: 'enter-amount',
        title: 'Enter Amount',
        content: (
          <View style={innerStyles.stepContent}>
            <Text style={{ fontSize: 48, fontWeight: '700', color: isDark ? '#FFF' : '#1A1A1A', marginBottom: 4 }}>
              0.50 ETH
            </Text>
            <Text style={[innerStyles.stepDescription, isDark && innerStyles.lightSubtext]}>
              ≈ $1,250.00 USD
            </Text>
            <View style={[innerStyles.keyBox, isDark && { backgroundColor: '#2C2C2E' }]}>
              <Text style={[{ fontSize: 13, color: isDark ? '#8E8E93' : '#6E6E73' }]}>
                To: 0x742d...4F2e
              </Text>
            </View>
            <View style={{ height: 16 }} />
            <TouchableOpacity
              style={[innerStyles.continueButton, { backgroundColor: '#AF52DE' }]}
              onPress={() => goToStep(3)}
              activeOpacity={0.85}
            >
              <Text style={innerStyles.destructiveButtonText}>Review Transaction →</Text>
            </TouchableOpacity>
          </View>
        ),
      },
      {
        id: 'review',
        title: 'Review',
        content: (
          <View style={innerStyles.stepContent}>
            <Text style={innerStyles.stepIcon}>🔍</Text>
            <Text style={[innerStyles.stepTitle, isDark && innerStyles.lightText]}>
              Confirm Transaction
            </Text>
            <View style={[innerStyles.reviewRow, isDark && { borderColor: '#38383A' }]}>
              <Text style={[innerStyles.reviewLabel, isDark && innerStyles.lightSubtext]}>Asset</Text>
              <Text style={[innerStyles.reviewValue, isDark && innerStyles.lightText]}>Ethereum</Text>
            </View>
            <View style={[innerStyles.reviewRow, isDark && { borderColor: '#38383A' }]}>
              <Text style={[innerStyles.reviewLabel, isDark && innerStyles.lightSubtext]}>Amount</Text>
              <Text style={[innerStyles.reviewValue, isDark && innerStyles.lightText]}>0.50 ETH</Text>
            </View>
            <View style={[innerStyles.reviewRow, isDark && { borderColor: '#38383A' }]}>
              <Text style={[innerStyles.reviewLabel, isDark && innerStyles.lightSubtext]}>To</Text>
              <Text style={[innerStyles.reviewValue, isDark && innerStyles.lightText]}>0x742d...4F2e</Text>
            </View>
            <View style={[innerStyles.reviewRow, { borderBottomWidth: 0 }, isDark && { borderColor: '#38383A' }]}>
              <Text style={[innerStyles.reviewLabel, isDark && innerStyles.lightSubtext]}>Network Fee</Text>
              <Text style={[innerStyles.reviewValue, isDark && innerStyles.lightText]}>~$2.40</Text>
            </View>
            <View style={{ height: 16 }} />
            <TouchableOpacity
              style={[innerStyles.continueButton, { backgroundColor: '#AF52DE' }]}
              onPress={() => goToStep(4)}
              activeOpacity={0.85}
            >
              <Text style={innerStyles.destructiveButtonText}>Confirm & Send</Text>
            </TouchableOpacity>
          </View>
        ),
      },
      {
        id: 'success',
        title: 'Sent!',
        content: (
          <View style={innerStyles.stepContent}>
            <Text style={{ fontSize: 64, marginBottom: 8 }}>🎉</Text>
            <Text style={[innerStyles.stepTitle, isDark && innerStyles.lightText]}>
              Transaction Sent
            </Text>
            <Text style={[innerStyles.stepDescription, isDark && innerStyles.lightSubtext]}>
              0.50 ETH is on its way to 0x742d...4F2e. You'll be notified when it's confirmed.
            </Text>
            <TouchableOpacity
              style={[innerStyles.continueButton, { backgroundColor: '#34C759' }]}
              onPress={closeTray}
              activeOpacity={0.85}
            >
              <Text style={innerStyles.destructiveButtonText}>Done ✓</Text>
            </TouchableOpacity>
          </View>
        ),
      },
    ]);
  };

  const openFormTray = () => {
    openTray([
      {
        id: 'edit-wallet',
        title: 'Wallet Details',
        content: (
          <View style={innerStyles.stepContent}>
            <TextInput
              placeholder="Wallet name"
              defaultValue="Luke"
              placeholderTextColor={isDark ? '#636366' : '#C7C7CC'}
              style={[
                innerStyles.textInput,
                {
                  color: isDark ? '#FFF' : '#1A1A1A',
                  borderColor: isDark ? '#38383A' : '#E5E5EA',
                  backgroundColor: isDark ? '#2C2C2E' : '#FFF',
                },
              ]}
            />
            <TextInput
              placeholder="Icon emoji"
              defaultValue="😀"
              placeholderTextColor={isDark ? '#636366' : '#C7C7CC'}
              style={[
                innerStyles.textInput,
                {
                  color: isDark ? '#FFF' : '#1A1A1A',
                  borderColor: isDark ? '#38383A' : '#E5E5EA',
                  backgroundColor: isDark ? '#2C2C2E' : '#FFF',
                },
              ]}
            />
            <TouchableOpacity
              style={[innerStyles.continueButton, { backgroundColor: '#00BFFF' }]}
              onPress={closeTray}
              activeOpacity={0.85}
            >
              <Text style={innerStyles.destructiveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ),
      },
    ]);
  };

  const bgColor = isDark ? '#000000' : '#F2F2F7';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Dynamic Tray</Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
          react-native-dynamic-tray
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Wallet Demo</Text>
          <Text style={[styles.cardDescription, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
            Tap to see a multi-step tray flow with animated transitions
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={openWalletOptions} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Open Wallet Options</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Settings Demo</Text>
          <Text style={[styles.cardDescription, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
            A simple single-step tray with list rows
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: isDark ? '#30D158' : '#34C759' }]}
            onPress={openSettingsTray}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Deep Flow Demo</Text>
          <Text style={[styles.cardDescription, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
            5-step send flow — navigate forward and back through all steps
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#AF52DE' }]}
            onPress={openDeepFlow}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Start Send Flow</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>Form Demo</Text>
          <Text style={[styles.cardDescription, { color: isDark ? '#8E8E93' : '#6E6E73' }]}>
            TextInput inside a tray — keyboard-aware positioning
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#00BFFF' }]}
            onPress={openFormTray}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Edit Wallet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DynamicTray />
    </SafeAreaView>
  );
}

// ─── App Root ──────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <SafeAreaProvider>
    <DynamicTrayProvider
      config={{
        theme: isDark ? 'dark' : 'light',
        animationDuration: 350,
        backdropOpacity: 0.5,
        borderRadius: 24,
        closeOnBackdropPress: true,
      }}
    >
      <DemoScreen isDark={isDark} />
      <View style={[styles.themeToggle, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <Text style={{ color: isDark ? '#FFFFFF' : '#1A1A1A', fontSize: 14, fontWeight: '500' }}>
          Dark Mode
        </Text>
        <Switch
          value={isDark}
          onValueChange={setIsDark}
          trackColor={{ false: '#E5E5EA', true: '#34C759' }}
          thumbColor="#FFFFFF"
        />
      </View>
    </DynamicTrayProvider>
    </SafeAreaProvider>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 15, marginTop: 4, fontWeight: '400' },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 20, gap: 16 },
  card: {
    borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3, marginBottom: 6 },
  cardDescription: { fontSize: 15, lineHeight: 20, marginBottom: 20 },
  primaryButton: {
    backgroundColor: '#007AFF', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  themeToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E5EA',
  },
});

const innerStyles = StyleSheet.create({
  stepContent: { paddingHorizontal: 20, alignItems: 'center' },
  stepIcon: { fontSize: 48, marginBottom: 12 },
  stepTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center', color: '#1A1A1A' },
  stepDescription: { fontSize: 15, lineHeight: 22, textAlign: 'center', color: '#6E6E73', marginBottom: 20 },
  lightText: { color: '#FFFFFF' },
  lightSubtext: { color: '#8E8E93' },
  keyBox: { backgroundColor: '#F2F2F7', borderRadius: 12, padding: 16, width: '100%', alignItems: 'center' },
  keyText: { fontSize: 14, fontWeight: '500', fontFamily: 'monospace', color: '#1A1A1A' },
  phraseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  phraseItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, gap: 6,
  },
  phraseNumber: { fontSize: 12, fontWeight: '600', color: '#8E8E93' },
  phraseWord: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  destructiveButton: {
    backgroundColor: '#FF3B30', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 24, width: '100%', alignItems: 'center', marginBottom: 10,
  },
  destructiveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  cancelButton: {
    backgroundColor: '#F2F2F7', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 24, width: '100%', alignItems: 'center',
  },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  continueButton: {
    borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 24, width: '100%', alignItems: 'center',
  },
  reviewRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E5EA',
    width: '100%',
  },
  reviewLabel: { fontSize: 15, color: '#6E6E73' },
  reviewValue: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    width: '100%',
    marginBottom: 12,
  },
});
