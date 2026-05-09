import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND_BLACK, BRAND_YELLOW } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuth();

  const closeAnd = (fn: () => void) => {
    fn();
    props.navigation.closeDrawer();
  };

  const cycleLanguage = () => {
    if (language === 'so') setLanguage('en');
    else if (language === 'en') setLanguage('am');
    else setLanguage('so');
  };

  const getFlagEmoji = () => {
    if (language === 'so') return '🇸🇴';
    if (language === 'en') return '🇬🇧';
    return '🇪🇹';
  };

  const getLanguageName = () => {
    if (language === 'so') return 'Somali';
    if (language === 'en') return 'English';
    return 'Amharic';
  };

  const handleLogout = async () => {
    try {
      await logout();
      props.navigation.closeDrawer();
      router.replace('/login');
    } catch {
      Alert.alert('Error', 'Unable to log out right now.');
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
      style={{ backgroundColor: BRAND_BLACK }}
    >
      <View style={styles.contentTop}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('drawer.menu')}</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => closeAnd(() => router.push('/(drawer)/home'))}
          >
            <FontAwesome name="home" size={22} color={BRAND_YELLOW} style={styles.rowIcon} />
            <Text style={styles.rowText}>{t('tabs.home')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => closeAnd(() => router.push('/(drawer)/about'))}
          >
            <FontAwesome name="info-circle" size={22} color={BRAND_YELLOW} style={styles.rowIcon} />
            <Text style={styles.rowText}>{t('tabs.about')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => closeAnd(() => router.push('/(drawer)/contact'))}
          >
            <FontAwesome name="phone" size={22} color={BRAND_YELLOW} style={styles.rowIcon} />
            <Text style={styles.rowText}>{t('tabs.contact')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('drawer.language')}</Text>
          <TouchableOpacity style={styles.row} onPress={cycleLanguage}>
            <Text style={styles.rowFlag}>{getFlagEmoji()}</Text>
            <Text style={styles.rowText}>{getLanguageName()}</Text>
            <FontAwesome name="exchange" size={16} color={BRAND_YELLOW} style={styles.trailingIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutIconWrap}>
            <FontAwesome name="sign-out" size={18} color={BRAND_BLACK} />
          </View>
          <Text style={styles.logoutText}>{t('drawer.logout')}</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  contentTop: {},
  section: {
    paddingHorizontal: 18,
  },
  sectionLabel: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2a2a',
  },
  rowIcon: {
    marginRight: 14,
    width: 26,
    textAlign: 'center',
  },
  rowText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  rowFlag: {
    fontSize: 22,
    marginRight: 14,
    width: 26,
    textAlign: 'center',
  },
  trailingIcon: {
    marginLeft: 'auto',
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  logoutButton: {
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: 'rgba(255,204,0,0.35)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  logoutIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BRAND_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
