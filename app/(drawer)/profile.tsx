import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CITY_TRANSLATION_SLUG, COUNTRY_TRANSLATION_SLUG, MEDICAL_SERVICE_KEYS } from '../../constants/BookingData';
import { BRAND_BLACK, BRAND_YELLOW } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../firebaseConfig';

type BookingItem = {
  id: string;
  name?: string | null;
  services?: string[];
  serviceKeys?: string[];
  destination?: string | null;
  city?: string | null;
  country?: string | null;
  timestamp_dhamaystiran?: { seconds?: number } | Date | null;
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleCreatePermanentAccount = async () => {
    await logout();
    router.replace('/login');
  };

  const isGuest = Boolean(user?.isAnonymous);
  const displayName = isGuest ? t('profile.guestUser') : user?.displayName || '-';
  const email = isGuest ? null : user?.email || '-';

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.uid) {
        setBookings([]);
        setLoadingBookings(false);
        return;
      }

      setLoadingBookings(true);
      try {
        const snapshot = await getDocs(
          query(collection(db, 'dalabyadaDhamaystiran'), where('uid', '==', user.uid))
        );

        const rows = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<BookingItem, 'id'>),
        }));

        rows.sort((a, b) => {
          const aTime =
            a.timestamp_dhamaystiran instanceof Date
              ? a.timestamp_dhamaystiran.getTime()
              : (a.timestamp_dhamaystiran?.seconds ?? 0) * 1000;
          const bTime =
            b.timestamp_dhamaystiran instanceof Date
              ? b.timestamp_dhamaystiran.getTime()
              : (b.timestamp_dhamaystiran?.seconds ?? 0) * 1000;

          return bTime - aTime;
        });

        setBookings(rows);
      } catch {
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookings();
  }, [user?.uid]);

  const formatDate = (value: BookingItem['timestamp_dhamaystiran']) => {
    const date =
      value instanceof Date ? value : value?.seconds ? new Date(value.seconds * 1000) : null;

    if (!date) return '-';

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const countryLabel = (country?: string | null) => {
    if (!country) return '-';
    const countrySlug = COUNTRY_TRANSLATION_SLUG[country];
    return countrySlug ? t(`caafimaad.location.countries.${countrySlug}`) : country;
  };

  const cityLabel = (city?: string | null) => {
    if (!city) return null;
    const citySlug = CITY_TRANSLATION_SLUG[city];
    return citySlug ? t(`caafimaad.location.cities.${citySlug}`) : city;
  };

  const servicesLabel = (booking: BookingItem) => {
    const labels =
      Array.isArray(booking.serviceKeys) && booking.serviceKeys.length > 0
        ? booking.serviceKeys.map((key) => {
            const serviceKey = MEDICAL_SERVICE_KEYS.includes(key as (typeof MEDICAL_SERVICE_KEYS)[number])
              ? (key as (typeof MEDICAL_SERVICE_KEYS)[number])
              : null;
            return serviceKey ? t(`caafimaad.services.${serviceKey}`) : key;
          })
        : Array.isArray(booking.services)
          ? booking.services
          : [];

    return labels.length > 0 ? labels : [t('profile.noServices')];
  };

  const mainDestinationLabel = (booking: BookingItem) => {
    if (booking.destination) return booking.destination;

    const city = cityLabel(booking.city);
    const country = countryLabel(booking.country);

    if (city && booking.country) return `${city}, ${country}`;
    return city || country;
  };

  const bookingCards = bookings.map((booking) => ({
    id: booking.id,
    dateText: formatDate(booking.timestamp_dhamaystiran),
    destinationText: mainDestinationLabel(booking),
  }));

  const handleDeleteBooking = (bookingId: string) => {
    Alert.alert(t('profile.confirmDelete'), t('profile.deleteBookingPrompt'), [
      { text: t('caafimaad.additionalServices.close'), style: 'cancel' },
      {
        text: t('profile.deleteBooking'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'dalabyadaDhamaystiran', bookingId));
            setBookings((current) => current.filter((item) => item.id !== bookingId));
            setSelectedBooking((current) => (current?.id === bookingId ? null : current));
          } catch {
            Alert.alert(t('profile.deleteFailedTitle'), t('profile.deleteFailedMessage'));
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('profile.title')}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('profile.fullName')}</Text>
            <Text style={styles.value}>{displayName}</Text>
          </View>

          {!isGuest ? (
            <View style={styles.rowLast}>
              <Text style={styles.label}>{t('profile.email')}</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>
            {t('profile.bookingRequests')} ({bookings.length})
          </Text>

          {loadingBookings ? <Text style={styles.helperText}>{t('profile.loadingBookings')}</Text> : null}

          {!loadingBookings && bookingCards.length > 0
            ? bookingCards.map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <TouchableOpacity
                    style={styles.bookingContent}
                    onPress={() => setSelectedBooking(bookings.find((item) => item.id === booking.id) ?? null)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.bookingLabel}>{t('profile.bookingDate')}</Text>
                    <Text style={styles.bookingValue}>{booking.dateText}</Text>

                    <Text style={[styles.bookingLabel, styles.bookingSpacing]}>{t('profile.mainDestination')}</Text>
                    <Text style={styles.destinationValue}>{booking.destinationText}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteBooking(booking.id)}
                    activeOpacity={0.9}
                  >
                    <FontAwesome name="trash" size={18} color={BRAND_YELLOW} />
                  </TouchableOpacity>
                </View>
              ))
            : null}

          {!loadingBookings && bookingCards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('profile.noBookings')}</Text>
              {isGuest ? <Text style={styles.helperText}>{t('profile.guestPrompt')}</Text> : null}
            </View>
          ) : null}
        </View>

        {isGuest ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleCreatePermanentAccount} activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>{t('profile.createPermanentAccount')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogout} activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>{t('profile.signOut')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={Boolean(selectedBooking)} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedBooking(null)} activeOpacity={0.9}>
              <Text style={styles.closeButtonText}>{t('profile.bookingDetails')}</Text>
              <Text style={styles.closeButtonAction}>{t('caafimaad.additionalServices.close')}</Text>
            </TouchableOpacity>

            {selectedBooking ? (
              <View style={styles.summaryCard}>
                <View style={styles.infoRow}>
                  <FontAwesome name="user-circle" size={24} color={BRAND_YELLOW} style={styles.icon} />
                  <View style={styles.textContainer}>
                    <Text style={styles.itemTitle}>{t('caafimaad.bixinta.customer')}</Text>
                    <Text style={styles.itemValue}>
                      {selectedBooking.name || user?.displayName || t('profile.guestUser')}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <MaterialIcons name="place" size={24} color={BRAND_YELLOW} style={styles.icon} />
                  <View style={styles.textContainer}>
                    <Text style={styles.itemTitle}>{t('caafimaad.bixinta.destination')}</Text>
                    <Text style={styles.itemValue}>{mainDestinationLabel(selectedBooking)}</Text>
                    <Text style={styles.itemSub}>
                      {t('profile.country')}: {countryLabel(selectedBooking.country)}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <MaterialIcons name="format-list-bulleted" size={24} color={BRAND_YELLOW} style={styles.icon} />
                  <View style={styles.textContainer}>
                    <Text style={styles.itemTitle}>{t('caafimaad.bixinta.services')}</Text>
                    {servicesLabel(selectedBooking).map((service) => (
                      <View key={service} style={styles.serviceRow}>
                        <MaterialIcons name="check" size={18} color={BRAND_YELLOW} />
                        <Text style={styles.serviceText}>{service}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_BLACK,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#232323',
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2A2A2A',
  },
  rowLast: {
    paddingVertical: 16,
  },
  label: {
    color: '#9E9E9E',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#232323',
    marginBottom: 22,
  },
  bookingCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#232323',
    paddingLeft: 18,
    paddingRight: 12,
    paddingVertical: 15,
    marginBottom: 14,
    flexDirection: 'row',
  },
  bookingContent: {
    flex: 1,
    paddingRight: 12,
  },
  bookingSpacing: {
    marginTop: 16,
  },
  bookingLabel: {
    color: '#9E9E9E',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookingValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  destinationValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  deleteButton: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
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
  helperText: {
    color: '#A5A5A5',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: BRAND_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  modalContainer: {
    flexGrow: 1,
    padding: 20,
  },
  closeButton: {
    marginBottom: 18,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  closeButtonAction: {
    color: BRAND_YELLOW,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 16,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    color: '#A9A9A9',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  itemValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  itemSub: {
    color: '#B8B8B8',
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginVertical: 18,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  serviceText: {
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
});
