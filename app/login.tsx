import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BRAND_BLACK, BRAND_YELLOW } from '../constants/colors';
import { Language, useLanguage } from '../contexts/LanguageContext';
import { auth, db } from '../firebaseConfig';

const LANGUAGE_OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: 'so', label: 'Somali', flag: '🇸🇴' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'am', label: 'Amharic', flag: '🇪🇹' },
];

export default function LoginScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [processing, setProcessing] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [focusedField, setFocusedField] = useState<'fullName' | 'email' | 'password' | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const currentLanguage =
    LANGUAGE_OPTIONS.find((option) => option.code === language) ?? LANGUAGE_OPTIONS[0];
  const switchCopy = mode === 'signup' ? t('login.haveAccount') : t('login.noAccount');
  const switchParts = switchCopy.split('?');
  const switchLead = switchParts.length > 1 ? `${switchParts[0]}? ` : '';
  const switchAction = switchParts.length > 1 ? switchParts.slice(1).join('?').trim() : switchCopy;

  const getAuthErrorMessage = (error: unknown) => {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

    if (code === 'auth/network-request-failed') return t('login.networkError');
    if (code === 'auth/email-already-in-use') return t('login.emailAlreadyInUse');
    if (code === 'auth/invalid-email') return t('login.invalidEmail');
    if (code === 'auth/weak-password') return t('login.weakPassword');
    if (
      code === 'auth/invalid-credential' ||
      code === 'auth/invalid-login-credentials' ||
      code === 'auth/user-not-found' ||
      code === 'auth/wrong-password'
    ) {
      return t('login.invalidCredentials');
    }

    return mode === 'signup' ? t('login.signupFailed') : t('login.loginFailed');
  };

  const handleGuestPress = async () => {
    setProcessing(true);
    try {
      await signInAnonymously(auth);
      router.replace('/(drawer)/home');
    } catch {
      Alert.alert(t('login.guestLoginErrorTitle'), t('login.guestLoginErrorMessage'));
    } finally {
      setProcessing(false);
    }
  };

  const handleLanguageSelect = async (nextLanguage: Language) => {
    setShowLanguageMenu(false);
    await setLanguage(nextLanguage);
  };

  const handleAuthPress = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (mode === 'signup' && !trimmedName) {
      Alert.alert(t('login.errorTitle'), t('login.fullNameRequired'));
      return;
    }

    if (!trimmedEmail) {
      Alert.alert(t('login.errorTitle'), t('login.emailRequired'));
      return;
    }

    if (!password.trim()) {
      Alert.alert(t('login.errorTitle'), t('login.passwordRequired'));
      return;
    }

    if (mode === 'signup' && password.trim().length < 6) {
      Alert.alert(t('login.errorTitle'), t('login.passwordTooShort'));
      return;
    }

    setProcessing(true);
    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        await updateProfile(userCredential.user, { displayName: trimmedName });
        await setDoc(
          doc(db, 'users', userCredential.user.uid),
          {
            uid: userCredential.user.uid,
            displayName: trimmedName,
            email: trimmedEmail,
            isGuest: false,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      }

      router.replace('/(drawer)/home');
    } catch (error) {
      Alert.alert(t('login.errorTitle'), getAuthErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 18}
      >
        {showLanguageMenu ? <Pressable style={styles.backdrop} onPress={() => setShowLanguageMenu(false)} /> : null}

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.languageTrigger}
            onPress={() => setShowLanguageMenu((current) => !current)}
            activeOpacity={0.9}
          >
            <Text style={styles.languageTriggerFlag}>{currentLanguage.flag}</Text>
            <Text style={styles.languageTriggerCode}>{currentLanguage.code.toUpperCase()}</Text>
          </TouchableOpacity>

          {showLanguageMenu ? (
            <View style={styles.languageMenu}>
              {LANGUAGE_OPTIONS.map((option) => {
                const isActive = option.code === language;

                return (
                  <TouchableOpacity
                    key={option.code}
                    style={[styles.languageMenuItem, isActive && styles.languageMenuItemActive]}
                    onPress={() => void handleLanguageSelect(option.code)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.languageMenuFlag}>{option.flag}</Text>
                    <View style={styles.languageMenuTextWrap}>
                      <Text style={[styles.languageMenuCode, isActive && styles.languageMenuCodeActive]}>
                        {option.code.toUpperCase()}
                      </Text>
                      <Text style={styles.languageMenuLabel}>{option.label}</Text>
                    </View>
                    {isActive ? <FontAwesome name="check-circle" size={18} color={BRAND_YELLOW} /> : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <View style={styles.hero}>
            <Image source={require('../assets/images/icon.png')} style={styles.logo} />
            <Text style={styles.title}>{t('login.welcomeTitle')}</Text>

            <View style={styles.formWrap}>
              {mode === 'signup' ? (
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder={t('login.fullNamePlaceholder')}
                  placeholderTextColor="#7A7A7A"
                  style={[styles.input, focusedField === 'fullName' && styles.inputFocused]}
                  autoCapitalize="words"
                  editable={!processing}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField(null)}
                />
              ) : null}

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t('login.emailPlaceholder')}
                placeholderTextColor="#7A7A7A"
                style={[styles.input, focusedField === 'email' && styles.inputFocused]}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!processing}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t('login.passwordPlaceholder')}
                placeholderTextColor="#7A7A7A"
                style={[styles.input, focusedField === 'password' && styles.inputFocused]}
                secureTextEntry
                editable={!processing}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, processing && styles.disabledButton]}
              onPress={handleAuthPress}
              disabled={processing}
              activeOpacity={0.9}
            >
              {processing ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {mode === 'signup' ? t('login.signUpButton') : t('login.logInButton')}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              disabled={processing}
              activeOpacity={0.9}
            >
            <Text style={styles.switchText}>
              <Text style={styles.switchTextBase}>{switchLead}</Text>
              <Text style={styles.switchTextAction}>{switchAction}</Text>
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.guestButton, processing && styles.disabledButton]}
              onPress={handleGuestPress}
              disabled={processing}
              activeOpacity={0.9}
            >
              <Text style={styles.guestButtonText}>{t('login.guestButton')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_BLACK,
  },
  keyboardWrap: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  topBar: {
    position: 'absolute',
    top: 20,
    right: 15,
    zIndex: 10,
  },
  languageTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 92,
    height: 52,
    paddingHorizontal: 14,
    backgroundColor: '#121212',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,204,0,0.45)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  languageTriggerFlag: {
    fontSize: 24,
    marginRight: 8,
  },
  languageTriggerCode: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  languageMenu: {
    marginTop: 12,
    width: 190,
    backgroundColor: '#111111',
    borderRadius: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,204,0,0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 14,
  },
  languageMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 3,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  languageMenuItemActive: {
    backgroundColor: 'rgba(255,204,0,0.12)',
  },
  languageMenuFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageMenuTextWrap: {
    flex: 1,
  },
  languageMenuCode: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  languageMenuCodeActive: {
    color: BRAND_YELLOW,
  },
  languageMenuLabel: {
    color: '#A8A8A8',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  hero: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 42,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
    maxWidth: 360,
    marginBottom: 34,
  },
  formWrap: {
    width: '100%',
    maxWidth: 360,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    maxWidth: 360,
    minHeight: 64,
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 19,
    marginBottom: 14,
  },
  inputFocused: {
    borderColor: BRAND_YELLOW,
    borderWidth: 1.5,
  },
  primaryButton: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: BRAND_YELLOW,
    borderRadius: 18,
    minHeight: 60,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  switchText: {
    width: '100%',
    maxWidth: 360,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  switchTextBase: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  switchTextAction: {
    color: BRAND_YELLOW,
    fontWeight: '800',
  },
  guestButton: {
    width: '100%',
    maxWidth: 360,
    minHeight: 56,
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,204,0,0.24)',
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  guestButtonText: {
    color: '#E9E9E9',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
