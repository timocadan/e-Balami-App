import {
  CITY_TRANSLATION_SLUG,
  COUNTRY_TRANSLATION_SLUG,
  LOCATIONS_BY_COUNTRY,
  MEDICAL_FLOW_BACK_TOP,
  MEDICAL_FLOW_PROGRESS_MARGIN_TOP,
} from '../../../../constants/BookingData';
import { MEDICAL_FORM_THEME } from '../../../../constants/medicalFormTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { db } from '../../../../firebaseConfig';
import { getSafeErrorMessage } from '../../../../utils/security';
import { MAX_LENGTHS, validateDocumentId } from '../../../../utils/validation';

type LocationRow = {
  id: string;
  city: string;
  country: string;
};

function buildSections(): { country: string; data: LocationRow[] }[] {
  const out: { country: string; data: LocationRow[] }[] = [];
  for (const [country, cities] of Object.entries(LOCATIONS_BY_COUNTRY)) {
    const data: LocationRow[] = cities.map((city) => ({
      id: `${country}::${city}`,
      city,
      country,
    }));
    out.push({ country, data });
  }
  return out;
}

export default function GoobtaScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { qabyoId } = useLocalSearchParams<{ qabyoId: string }>();

  const [goobtaRaadinta, setGoobtaRaadinta] = useState('');
  const [goobtaLaDoortay, setGoobtaLaDoortay] = useState<LocationRow | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const allSections = useMemo(() => buildSections(), []);

  const filteredSections = useMemo(() => {
    const q = goobtaRaadinta.trim().toLowerCase();
    if (!q) return allSections;
    return allSections
      .map((section) => {
        const countrySlug = COUNTRY_TRANSLATION_SLUG[section.country];
        const countryLabel = countrySlug
          ? t(`caafimaad.location.countries.${countrySlug}`)
          : section.country;
        const data = section.data.filter((row) => {
          const citySlug = CITY_TRANSLATION_SLUG[row.city];
          const cityLabel = citySlug
            ? t(`caafimaad.location.cities.${citySlug}`)
            : row.city;
          return (
            row.city.toLowerCase().includes(q) ||
            cityLabel.toLowerCase().includes(q) ||
            section.country.toLowerCase().includes(q) ||
            countryLabel.toLowerCase().includes(q)
          );
        });
        return { ...section, data };
      })
      .filter((s) => s.data.length > 0);
  }, [allSections, goobtaRaadinta, t]);

  const countryHeaderText = (country: string) => {
    const slug = COUNTRY_TRANSLATION_SLUG[country];
    const label = slug ? t(`caafimaad.location.countries.${slug}`) : country;
    return label.toUpperCase();
  };

  const cityRowLabel = (city: string) => {
    const slug = CITY_TRANSLATION_SLUG[city];
    if (!slug) return city;
    const key = `caafimaad.location.cities.${slug}`;
    const translated = t(key);
    return translated === key ? city : translated;
  };

  const countrySubLabel = (country: string) => {
    const slug = COUNTRY_TRANSLATION_SLUG[country];
    if (!slug) return country;
    const key = `caafimaad.location.countries.${slug}`;
    const translated = t(key);
    return translated === key ? country : translated;
  };

  const handleNext = async () => {
    if (!goobtaLaDoortay) {
      Alert.alert(t('caafimaad.location.errors.errorTitle'), t('caafimaad.location.errors.noLocationSelected'));
      return;
    }

    const docIdValidation = validateDocumentId(qabyoId);
    if (!docIdValidation.isValid) {
      Alert.alert(t('caafimaad.location.errors.errorTitleCritical'), t('caafimaad.location.errors.noRequestId'));
      return;
    }

    const destination = `${goobtaLaDoortay.city}, ${goobtaLaDoortay.country}`;
    if (destination.length > MAX_LENGTHS.destination) {
      Alert.alert(t('caafimaad.location.errors.errorTitle'), t('caafimaad.location.errors.destinationTooLong'));
      return;
    }

    try {
      const docRef = doc(db, 'dalabyadaAanDhamaystirnayn', docIdValidation.sanitized);
      await updateDoc(docRef, {
        destination: destination.substring(0, MAX_LENGTHS.destination),
        country: goobtaLaDoortay.country,
        city: goobtaLaDoortay.city,
      });

      router.push({
        pathname: '/home/caafimaad/bixinta',
        params: { qabyoId: docIdValidation.sanitized },
      });
    } catch (e) {
      getSafeErrorMessage(e);
      Alert.alert(t('caafimaad.location.errors.firebaseError'), t('caafimaad.location.errors.updateError'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>

        <Text style={styles.title}>{t('caafimaad.location.title')}</Text>

        <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
          <MaterialIcons name="search" size={24} color={MEDICAL_FORM_THEME.placeholder} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('caafimaad.location.placeholder')}
            placeholderTextColor={MEDICAL_FORM_THEME.placeholder}
            value={goobtaRaadinta}
            onChangeText={setGoobtaRaadinta}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            selectionColor={MEDICAL_FORM_THEME.inputBorderFocus}
          />
        </View>

        <SectionList
          sections={filteredSections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <Text style={styles.countryHeader}>{countryHeaderText(section.country)}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.cityCard, goobtaLaDoortay?.id === item.id && styles.selectedCard]}
              onPress={() => setGoobtaLaDoortay(item)}
            >
              <View>
                <Text style={styles.cityText}>{cityRowLabel(item.city)}</Text>
                <Text style={styles.countryText}>{countrySubLabel(item.country)}</Text>
              </View>
              {goobtaLaDoortay?.id === item.id && (
                <MaterialIcons name="check-circle" size={28} color="#FFCC00" />
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('caafimaad.location.errors.noSearchResults')}</Text>
          }
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{t('caafimaad.location.next')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, paddingHorizontal: 20 },
  backButton: {
    position: 'absolute',
    top: MEDICAL_FLOW_BACK_TOP,
    left: 20,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 30,
    marginTop: MEDICAL_FLOW_PROGRESS_MARGIN_TOP,
  },
  progressBar: { width: '75%', height: '100%', backgroundColor: '#FFCC00' },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MEDICAL_FORM_THEME.inputBg,
    borderRadius: MEDICAL_FORM_THEME.radius,
    paddingHorizontal: 15,
    marginBottom: 16,
    borderWidth: MEDICAL_FORM_THEME.borderWidth,
    borderColor: MEDICAL_FORM_THEME.inputBorder,
  },
  searchContainerFocused: {
    borderColor: MEDICAL_FORM_THEME.inputBorderFocus,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: MEDICAL_FORM_THEME.text, fontSize: 16, paddingVertical: 15 },
  listContent: { paddingBottom: 12 },
  countryHeader: {
    color: '#FFCC00',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 8,
    marginBottom: 10,
  },
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: MEDICAL_FORM_THEME.inputBg,
    padding: 20,
    borderRadius: MEDICAL_FORM_THEME.radius,
    marginBottom: 10,
    borderWidth: MEDICAL_FORM_THEME.borderWidth,
    borderColor: MEDICAL_FORM_THEME.inputBg,
  },
  selectedCard: { borderColor: '#FFCC00' },
  cityText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  countryText: { color: '#A9A9A9', fontSize: 14, marginTop: 4 },
  emptyText: {
    color: MEDICAL_FORM_THEME.error,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: MEDICAL_FORM_THEME.inputBorderFocus,
    padding: 18,
    borderRadius: MEDICAL_FORM_THEME.radius,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  nextButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
});
