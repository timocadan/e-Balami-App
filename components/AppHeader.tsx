import React, { type ReactNode } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BRAND_BLACK, BRAND_YELLOW } from '../constants/colors';

type AppHeaderProps = {
  /** Reserve right space when you add actions later */
  rightSlot?: ReactNode;
};

export function AppHeader({ rightSlot }: AppHeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View style={styles.row}>
      <TouchableOpacity
        accessibilityLabel="Open menu"
        style={styles.side}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <FontAwesome name="bars" size={26} color={BRAND_YELLOW} />
      </TouchableOpacity>
      <View style={styles.center}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.actions}>
        {rightSlot ?? (
          <>
            <TouchableOpacity
              accessibilityLabel="Open notifications"
              style={styles.actionButton}
              onPress={() => router.push('/notifications')}
            >
              <FontAwesome name="bell-o" size={22} color={BRAND_YELLOW} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel="Open profile"
              style={styles.actionButton}
              onPress={() => router.push('/(drawer)/profile')}
            >
              <FontAwesome name="user-circle-o" size={24} color={BRAND_YELLOW} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BRAND_BLACK,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
  },
  side: {
    width: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    minWidth: 88,
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 44,
  },
});
