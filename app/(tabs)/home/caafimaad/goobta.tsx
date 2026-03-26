// Path: app/(tabs)/home/caafimaad/goobta.tsx

import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { db } from '../../../../firebaseConfig';
import { getSafeErrorMessage } from '../../../../utils/security';
import { MAX_LENGTHS, validateDocumentId } from '../../../../utils/validation';

const magaalooyinka = [
    { id: '1', magaalada: 'Jigjiga', wadan: 'Ethiopia' },
    { id: '2', magaalada: 'Addis Ababa', wadan: 'Ethiopia' },
    { id: '3', magaalada: 'Dire Dawa', wadan: 'Ethiopia' },
    { id: '4', magaalada: 'Harer', wadan: 'Ethiopia' },
    { id: '5', magaalada: 'Hyderabad', wadan: 'India' },
    { id: '6', magaalada: 'Caira', wadan: 'Masar' },
];

export default function GoobtaScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { qabyoId } = useLocalSearchParams<{ qabyoId: string }>();

    const [goobtaRaadinta, setGoobtaRaadinta] = useState('');
    const [goobtaLaDoortay, setGoobtaLaDoortay] = useState<any>(null); // U beddel any

    const magaalooyinkaLaHelay = magaalooyinka.filter(item => 
        item.magaalada.toLowerCase().includes(goobtaRaadinta.toLowerCase())
    );

    const handleNext = async () => {
        if (!goobtaLaDoortay) {
            Alert.alert(t('caafimaad.location.errors.errorTitle'), t('caafimaad.location.errors.noLocationSelected'));
            return;
        }

        // Validate document ID
        const docIdValidation = validateDocumentId(qabyoId);
        if (!docIdValidation.isValid) {
            Alert.alert(t('caafimaad.location.errors.errorTitleCritical'), t('caafimaad.location.errors.noRequestId'));
            return;
        }

        // Validate destination length
        const destination = `${goobtaLaDoortay.magaalada}, ${goobtaLaDoortay.wadan}`;
        if (destination.length > MAX_LENGTHS.destination) {
            Alert.alert(t('caafimaad.location.errors.errorTitle'), 'Destination is too long');
            return;
        }

        try {
            const docRef = doc(db, "dalabyadaAanDhamaystirnayn", docIdValidation.sanitized);
            await updateDoc(docRef, {
                destination: destination.substring(0, MAX_LENGTHS.destination)
            });
            
            router.push({ 
                pathname: '/home/caafimaad/bixinta', 
                params: { qabyoId: docIdValidation.sanitized } 
            });

        } catch(e) {
            const errorMessage = getSafeErrorMessage(e);
            Alert.alert(t('caafimaad.location.errors.firebaseError'), t('caafimaad.location.errors.updateError'));
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                     <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                </TouchableOpacity>

                {/* Hadda ProgressBar-ku waa 75% tallaabadan */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar} />
                </View>

                <Text style={styles.title}>{t('caafimaad.location.title')}</Text>
                
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={24} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('caafimaad.location.placeholder')}
                        placeholderTextColor="#888"
                        value={goobtaRaadinta}
                        onChangeText={setGoobtaRaadinta}
                    />
                </View>

                <FlatList
                    data={magaalooyinkaLaHelay}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={[styles.cityCard, goobtaLaDoortay?.id === item.id && styles.selectedCard]}
                            onPress={() => setGoobtaLaDoortay(item)}
                        >
                            <View>
                                <Text style={styles.cityText}>{t(`caafimaad.location.cities.${item.magaalada}`) || item.magaalada}</Text>
                                <Text style={styles.countryText}>{t(`caafimaad.location.countries.${item.wadan}`) || item.wadan}</Text>
                            </View>
                            {goobtaLaDoortay?.id === item.id && <MaterialIcons name="check-circle" size={28} color="#FFC107" />}
                        </TouchableOpacity>
                    )}
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
         backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
    progressBarContainer: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden', marginBottom: 30, marginTop: 70 },
    // ProgressBar oo la cusbooneysiiyay si uu ula socdo silsiladda cusub
    progressBar: { width: '75%', height: '100%', backgroundColor: '#FFC107' },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, borderWidth: 1, borderColor: '#333'},
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, color: 'white', fontSize: 16, paddingVertical: 15 },
    cityCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 20, borderRadius: 10, marginBottom: 10, borderWidth: 2, borderColor: '#1E1E1E' },
    selectedCard: { borderColor: '#FFC107' },
    cityText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    countryText: { color: '#A9A9A9', fontSize: 14, marginTop: 4 },
    nextButton: { backgroundColor: '#FFC107', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 20 },
    nextButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
});