import { collection, getDocs, or, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BRAND_BLACK, BRAND_YELLOW } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../firebaseConfig';

type NotificationItem = {
  id: string;
  title?: string | null;
  body?: string | null;
  target?: string | null;
  userId?: string | null;
  createdAt?: { seconds?: number } | Date | null;
};

export default function NotificationsScreen() {
  const { user, isAuthLoading } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (isAuthLoading) return;

      setLoading(true);
      try {
        const notificationsRef = collection(db, 'notifications');
        const notificationsQuery = user?.uid
          ? query(
              notificationsRef,
              or(where('target', '==', 'all'), where('userId', '==', user.uid))
            )
          : query(notificationsRef, where('target', '==', 'all'));

        const snapshot = await getDocs(notificationsQuery);
        const rows = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<NotificationItem, 'id'>),
        }));

        rows.sort((a, b) => getNotificationTime(b.createdAt) - getNotificationTime(a.createdAt));
        setNotifications(rows);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [isAuthLoading, user?.uid]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.screenTitle}>{t('notifications.title')}</Text>

        {loading ? <Text style={styles.helperText}>{t('common.loading')}</Text> : null}

        {!loading && notifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('notifications.empty')}</Text>
          </View>
        ) : null}

        {!loading
          ? notifications.map((notification) => (
              <View key={notification.id} style={styles.card}>
                <Text style={styles.title}>{notification.title || '-'}</Text>
                <Text style={styles.body}>{notification.body || '-'}</Text>
              </View>
            ))
          : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function getNotificationTime(value: NotificationItem['createdAt']) {
  if (value instanceof Date) return value.getTime();
  return (value?.seconds ?? 0) * 1000;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_BLACK,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  helperText: {
    color: '#A5A5A5',
    fontSize: 14,
    lineHeight: 21,
  },
  emptyCard: {
    backgroundColor: '#111111',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#232323',
    padding: 18,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#232323',
    padding: 18,
    marginBottom: 14,
  },
  title: {
    color: BRAND_YELLOW,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  body: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
});
