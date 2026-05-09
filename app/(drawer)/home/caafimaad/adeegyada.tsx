import {
  MEDICAL_FLOW_BACK_TOP,
  MEDICAL_FLOW_PROGRESS_MARGIN_TOP,
  MEDICAL_SERVICE_KEYS,
  type MedicalServiceKey,
} from '../../../../constants/BookingData';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../../firebaseConfig';
import { useLanguage } from '../../../../contexts/LanguageContext';

function isMedicalServiceKey(s: string): s is MedicalServiceKey {
  return (MEDICAL_SERVICE_KEYS as readonly string[]).includes(s);
}

export default function AdeegyadaScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { dalabNooc, adeeggaLaDoortay, adeeggaKey } = useLocalSearchParams<{
    dalabNooc: string;
    adeeggaLaDoortay?: string;
    adeeggaKey?: string;
  }>();

  const [selectedKeys, setSelectedKeys] = useState<MedicalServiceKey[]>([]);
  const [processing, setProcessing] = useState(false);

  const primaryKey = useMemo(() => {
    if (adeeggaKey && isMedicalServiceKey(adeeggaKey)) return adeeggaKey;
    if (!adeeggaLaDoortay) return undefined;
    const found = MEDICAL_SERVICE_KEYS.find((k) => t(`caafimaad.services.${k}`) === adeeggaLaDoortay);
    return found;
  }, [adeeggaKey, adeeggaLaDoortay, t]);

  useEffect(() => {
    if (dalabNooc === 'package') {
      setSelectedKeys([...MEDICAL_SERVICE_KEYS]);
    } else if (dalabNooc === 'single' && primaryKey) {
      setSelectedKeys([primaryKey]);
    } else if (dalabNooc === 'single' && adeeggaLaDoortay) {
      const found = MEDICAL_SERVICE_KEYS.find((k) => t(`caafimaad.services.${k}`) === adeeggaLaDoortay);
      setSelectedKeys(found ? [found] : []);
    }
  }, [dalabNooc, primaryKey, adeeggaLaDoortay, t]);

  const labelsForKeys = (keys: MedicalServiceKey[]) =>
    keys.map((k) => t(`caafimaad.services.${k}`));

  const handleToggleService = (serviceKey: MedicalServiceKey) => {
    if (dalabNooc === 'single' && primaryKey && serviceKey === primaryKey) {
      Alert.alert(
        t('caafimaad.servicesSelection.errors.cannotRemoveTitle'),
        t('caafimaad.servicesSelection.errors.cannotRemove')
      );
      return;
    }
    setSelectedKeys((prev) =>
      prev.includes(serviceKey) ? prev.filter((s) => s !== serviceKey) : [...prev, serviceKey]
    );
  };

  const handleNext = async () => {
    if (selectedKeys.length === 0) {
      return Alert.alert(
        t('caafimaad.servicesSelection.errors.errorTitle'),
        t('caafimaad.servicesSelection.errors.noServiceSelected')
      );
    }
    setProcessing(true);
    try {
      const labels = labelsForKeys(selectedKeys);
      const flightTicketIncluded = selectedKeys.includes('flightTicket');
      const docRef = await addDoc(collection(db, 'dalabyadaAanDhamaystirnayn'), {
        services: labels,
        serviceKeys: selectedKeys,
        flightTicketIncluded,
        nooca_dalabka: 'caafimaad',
        timestamp: new Date(),
      });
      router.push({ pathname: '/home/caafimaad/form', params: { qabyoId: docRef.id } });
    } catch {
      Alert.alert(
        t('caafimaad.servicesSelection.errors.firebaseErrorTitle'),
        t('caafimaad.servicesSelection.errors.firebaseError')
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
        <Text style={styles.title}>
          {dalabNooc === 'package'
            ? t('caafimaad.servicesSelection.packageTitle')
            : t('caafimaad.servicesSelection.singleTitle')}
        </Text>
        <Text style={styles.subtitle}>
          {dalabNooc === 'package'
            ? t('caafimaad.servicesSelection.packageSubtitle')
            : t('caafimaad.servicesSelection.singleSubtitle')}
        </Text>
        {dalabNooc === 'single' && primaryKey && (
          <View style={styles.mainServiceCard}>
            <FontAwesome5 name="check-circle" size={24} color="#121212" />
            <Text style={styles.mainServiceText}>{t(`caafimaad.services.${primaryKey}`)}</Text>
          </View>
        )}
        <View style={styles.servicesList}>
          {MEDICAL_SERVICE_KEYS.map((serviceKey) => {
            if (dalabNooc === 'single' && serviceKey === primaryKey) return null;
            const isSelected = selectedKeys.includes(serviceKey);
            return (
              <TouchableOpacity
                key={serviceKey}
                style={styles.serviceItem}
                onPress={() => handleToggleService(serviceKey)}
              >
                <MaterialIcons
                  name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                  size={28}
                  color={isSelected ? '#FFCC00' : '#888'}
                />
                <Text style={styles.serviceText}>{t(`caafimaad.services.${serviceKey}`)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={[styles.nextButton, processing && styles.disabledButton]}
          onPress={handleNext}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <Text style={styles.nextButtonText}>{t('caafimaad.servicesSelection.next')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flexGrow: 1, paddingHorizontal: 20 },
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
    marginBottom: 20,
    marginTop: MEDICAL_FLOW_PROGRESS_MARGIN_TOP,
  },
  progressBar: { width: '25%', height: '100%', backgroundColor: '#FFCC00' },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#A9A9A9', textAlign: 'center', marginTop: 8, marginBottom: 25 },
  mainServiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFCC00',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 20,
  },
  mainServiceText: { color: '#121212', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  servicesList: { width: '100%' },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  serviceText: { color: 'white', fontSize: 16, marginLeft: 15 },
  nextButton: {
    backgroundColor: '#FFCC00',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  nextButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#A9A9A9' },
});
