import React from 'react';
import { AppDrawerContent } from '../../components/AppDrawerContent';
import { AppHeader } from '../../components/AppHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { Drawer } from 'expo-router/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DrawerLayout() {
  const { t } = useLanguage();

  return (
    <Drawer
      initialRouteName="home"
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        header: () => (
          <SafeAreaView edges={['top']} style={{ backgroundColor: '#000000' }}>
            <AppHeader />
          </SafeAreaView>
        ),
        drawerStyle: {
          backgroundColor: '#000000',
          width: 300,
        },
        overlayColor: 'rgba(0,0,0,0.65)',
        drawerType: 'front',
      }}
    >
      <Drawer.Screen name="home" />
      <Drawer.Screen name="about" />
      <Drawer.Screen name="contact" />
      <Drawer.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          title: t('notifications.title'),
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}
