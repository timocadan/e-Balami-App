// Path: app/(tabs)/home/caafimaad/bixinta.tsx

import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { db } from '../../../../firebaseConfig';
import {
  CITY_TRANSLATION_SLUG,
  COUNTRY_TRANSLATION_SLUG,
  MEDICAL_FLOW_BACK_TOP,
  MEDICAL_FLOW_PROGRESS_MARGIN_TOP,
} from '../../../../constants/BookingData';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { validateDocumentId } from '../../../../utils/validation';

export default function BixintaScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { qabyoId } = useLocalSearchParams<{ qabyoId: string }>();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [dalabData, setDalabData] = useState<any>(null);

    useEffect(() => {
        const fetchDalabka = async () => {
            // Validate document ID before fetching
            const docIdValidation = validateDocumentId(qabyoId);
            if (!docIdValidation.isValid) {
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'dalabyadaAanDhamaystirnayn', docIdValidation.sanitized);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDalabData({ id: docSnap.id, ...docSnap.data() });
                }
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchDalabka();
    }, [qabyoId]);

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

    const hasFullLocation = Boolean(dalabData?.city && dalabData?.country);
    const destinationDisplay =
        dalabData?.city && dalabData?.country
            ? `${cityRowLabel(dalabData.city)}, ${countrySubLabel(dalabData.country)}`
            : (dalabData?.destination ?? '');

    const handleConfirm = async () => {
        if (!dalabData) return;

        // Validate document ID
        const docIdValidation = validateDocumentId(qabyoId);
        if (!docIdValidation.isValid) {
            return;
        }

        setProcessing(true);
        try {
            const { id: _draftListId, ...draftPayload } = dalabData;
            const flightTicketIncluded =
                typeof dalabData.flightTicketIncluded === 'boolean'
                    ? dalabData.flightTicketIncluded
                    : Array.isArray(dalabData.serviceKeys)
                      ? dalabData.serviceKeys.includes('flightTicket')
                      : Array.isArray(dalabData.services) &&
                        dalabData.services.includes(t('caafimaad.services.flightTicket'));

            await addDoc(collection(db, 'dalabyadaDhamaystiran'), {
                ...draftPayload,
                country: dalabData.country ?? null,
                city: dalabData.city ?? null,
                destination: dalabData.destination ?? null,
                flightTicketIncluded,
                status: 'xaqiijiyay',
                timestamp_dhamaystiran: new Date(),
            });
            await deleteDoc(doc(db, "dalabyadaAanDhamaystirnayn", docIdValidation.sanitized));
            router.replace({ pathname: '/home/caafimaad/guusha' });
        } catch {
            setProcessing(false);
        }
    };
    
    if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#FFC107" /></View>;

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                </TouchableOpacity>

                <View style={styles.progressBarContainer}><View style={styles.progressBar} /></View>
                <Text style={styles.title}>{t('caafimaad.bixinta.title')}</Text>

                {/* === QAAB-DHISMEEDKA CUSUB EE SOO JIIDASHADA LEH === */}
                <View style={styles.summaryCard}>
                    
                    <View style={styles.infoRow}>
                        <FontAwesome name="user-circle" size={24} color="#FFC107" style={styles.icon}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.itemTitle}>{t('caafimaad.bixinta.customer')}</Text>
                            <Text style={styles.itemValue}>{dalabData?.name}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />

                    {(destinationDisplay || dalabData?.city || dalabData?.country) ? (
                        <>
                            <View style={styles.infoRow}>
                                <MaterialIcons name="place" size={24} color="#FFC107" style={styles.icon} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{t('caafimaad.bixinta.destination')}</Text>
                                    {destinationDisplay ? (
                                        <Text style={styles.itemValue}>{destinationDisplay}</Text>
                                    ) : null}
                                    {dalabData?.country && !hasFullLocation ? (
                                        <Text style={styles.itemSub}>
                                            {t('caafimaad.bixinta.country')}: {countrySubLabel(dalabData.country)}
                                        </Text>
                                    ) : null}
                                    {dalabData?.city && !hasFullLocation ? (
                                        <Text style={styles.itemSub}>
                                            {t('caafimaad.bixinta.city')}: {cityRowLabel(dalabData.city)}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                            <View style={styles.divider} />
                        </>
                    ) : null}

                    <View style={styles.infoRow}>
                         <MaterialIcons name="format-list-bulleted" size={24} color="#FFC107" style={styles.icon}/>
                         <View style={styles.textContainer}>
                            <Text style={styles.itemTitle}>{t('caafimaad.bixinta.services')}</Text>
                            {dalabData?.services?.map((adeeg: string) => (
                                <View key={adeeg} style={styles.serviceRow}>
                                    <MaterialIcons name="check" size={18} color="#FFC107" />
                                    <Text style={styles.serviceText}>{adeeg}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <MaterialIcons name="flight" size={24} color="#FFC107" style={styles.icon} />
                        <View style={styles.textContainer}>
                            <Text style={styles.itemTitle}>{t('caafimaad.bixinta.flightTicket')}</Text>
                            <Text style={styles.itemValue}>
                                {typeof dalabData?.flightTicketIncluded === 'boolean'
                                    ? dalabData.flightTicketIncluded
                                        ? t('caafimaad.bixinta.yes')
                                        : t('caafimaad.bixinta.no')
                                    : Array.isArray(dalabData?.serviceKeys) && dalabData.serviceKeys.includes('flightTicket')
                                      ? t('caafimaad.bixinta.yes')
                                      : t('caafimaad.bixinta.no')}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.confirmButton, processing && styles.disabledButton]} 
                    onPress={handleConfirm} disabled={processing}>
                    {processing ? <ActivityIndicator color="#121212" /> : <Text style={styles.confirmButtonText}>{t('caafimaad.bixinta.confirmButton')}</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// === STYLE-KA CUSUB EE QURUXDA BADAN ===
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    container: { flexGrow: 1, padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212'},
    backButton: { position: 'absolute', top: MEDICAL_FLOW_BACK_TOP, left: 20, zIndex: 20, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
    progressBarContainer: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden', marginBottom: 30, marginTop: MEDICAL_FLOW_PROGRESS_MARGIN_TOP },
    progressBar: { width: '100%', height: '100%', backgroundColor: '#FFC107' },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 25 },
    summaryCard: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 25, borderWidth: 1, borderColor: '#333' },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 10 },
    icon: { width: 30, marginRight: 15, marginTop: 2 },
    textContainer: { flex: 1 },
    itemTitle: { color: '#A9A9A9', fontSize: 13, fontWeight: 'bold', marginBottom: 8, letterSpacing: 0.5 },
    itemValue: { color: 'white', fontSize: 17, fontWeight: 'bold' },
    itemSub: { color: '#CFCFCF', fontSize: 15, marginTop: 6 },
    divider: { height: 1, backgroundColor: '#333', marginVertical: 15 },
    serviceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    serviceText: { color: '#E0E0E0', fontSize: 16, marginLeft: 10 },
    confirmButton: { backgroundColor: '#FFC107', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30 },
    confirmButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
    disabledButton: { backgroundColor: '#A9A9A9' }
});