// Path: app/(tabs)/home/farsamo/bixinta.tsx

import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { db } from '../../../../firebaseConfig';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { validateDocumentId } from '../../../../utils/validation';
import { getSafeErrorMessage } from '../../../../utils/security';

export default function FarsamoBixintaScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { qabyoId } = useLocalSearchParams<{qabyoId: string}>();

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
                const docRef = doc(db, 'dalabyadaFarsamoQabyoAh', docIdValidation.sanitized);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDalabData({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                const errorMessage = getSafeErrorMessage(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDalabka();
    }, [qabyoId]);

    const handleConfirm = async () => {
        if (!dalabData) return;

        // Validate document ID
        const docIdValidation = validateDocumentId(qabyoId);
        if (!docIdValidation.isValid) {
            return;
        }

        setProcessing(true);
        try {
            await addDoc(collection(db, "dalabyadaFarsamada"), { ...dalabData, status: 'xaqiijiyay', timestamp_dhamaystiran: new Date() });
            await deleteDoc(doc(db, "dalabyadaFarsamoQabyoAh", docIdValidation.sanitized));
            router.replace({ pathname: '/home/farsamo/guusha' });
        } catch (error) {
            const errorMessage = getSafeErrorMessage(error);
            setProcessing(false);
        }
    };

    if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#FFC107" /></View>;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                </TouchableOpacity>

                <View style={styles.progressBarContainer}><View style={styles.progressBar} /></View>
                <Text style={styles.title}>{t('farsamo.bixinta.title')}</Text>

                {/* === QAAB-DHISMEEDKA CUSUB EE SOO JIIDASHADA LEH === */}
                <View style={styles.summaryCard}>
                    
                    <View style={styles.infoRow}>
                        <FontAwesome name="user-circle" size={24} color="#FFC107" style={styles.icon}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.itemTitle}>{t('farsamo.bixinta.customer')}</Text>
                            <Text style={styles.itemValue}>{dalabData?.name}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <FontAwesome5 name="concierge-bell" size={24} color="#FFC107" style={styles.icon}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.itemTitle}>{t('farsamo.bixinta.service')}</Text>
                            <Text style={styles.itemValue}>{dalabData?.service}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.infoRow}>
                        <MaterialIcons name="notes" size={24} color="#FFC107" style={styles.icon}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.itemTitle}>{t('farsamo.bixinta.details')}</Text>
                            <Text style={[styles.itemValue, {fontStyle: 'italic', fontWeight: 'normal'}]}>"{dalabData?.details}"</Text>
                        </View>
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={[styles.confirmButton, processing && styles.disabledButton]} 
                    onPress={handleConfirm} disabled={processing}>
                    {processing ? <ActivityIndicator color="#121212" /> : <Text style={styles.confirmButtonText}>{t('farsamo.bixinta.confirmButton')}</Text>}
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
         backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
    progressBarContainer: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden', marginBottom: 30, marginTop: 70 },
    progressBar: { width: '100%', height: '100%', backgroundColor: '#FFC107' },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 25 },
    summaryCard: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 25, borderWidth: 1, borderColor: '#333' },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 10 },
    icon: { width: 30, marginRight: 15, marginTop: 2 },
    textContainer: { flex: 1 },
    itemTitle: { color: '#A9A9A9', fontSize: 13, fontWeight: 'bold', marginBottom: 4, letterSpacing: 0.5 },
    itemValue: { color: 'white', fontSize: 17, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#333', marginVertical: 15 },
    confirmButton: { backgroundColor: '#FFC107', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30 },
    confirmButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
    disabledButton: { backgroundColor: '#A9A9A9' }
});