import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../../../firebaseConfig';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function AdeegyadaScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { dalabNooc, adeeggaLaDoortay } = useLocalSearchParams<{ dalabNooc: string, adeeggaLaDoortay?: string }>();
    
    const ADEEGYADA_LAHELI_KARO = [ 
        t('caafimaad.services.hotelBooking'), 
        t('caafimaad.services.hospitalBooking'), 
        t('caafimaad.services.translator'), 
        t('caafimaad.services.airportTaxi') 
    ];
    const [adeegyadaLaDoortay, setAdeegyadaLaDoortay] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    
    useEffect(() => {
        if (dalabNooc === 'package') {
            setAdeegyadaLaDoortay(ADEEGYADA_LAHELI_KARO);
        } else if (dalabNooc === 'single' && adeeggaLaDoortay) {
            setAdeegyadaLaDoortay([adeeggaLaDoortay]);
        }
    }, [dalabNooc, adeeggaLaDoortay, t]);

    const handleToggleService = (serviceName: string) => {
        if (dalabNooc === 'single' && serviceName === adeeggaLaDoortay) {
            Alert.alert(t('caafimaad.servicesSelection.errors.cannotRemoveTitle'), t('caafimaad.servicesSelection.errors.cannotRemove'));
            return;
        }
        setAdeegyadaLaDoortay(prev => 
            prev.includes(serviceName) ? prev.filter(s => s !== serviceName) : [...prev, serviceName]
        );
    };

    const handleNext = async () => {
        if (adeegyadaLaDoortay.length === 0) return Alert.alert(t('caafimaad.servicesSelection.errors.errorTitle'), t('caafimaad.servicesSelection.errors.noServiceSelected'));
        setProcessing(true);
        try {
            const docRef = await addDoc(collection(db, "dalabyadaAanDhamaystirnayn"), {
                services: adeegyadaLaDoortay, nooca_dalabka: 'caafimaad', timestamp: new Date()
            });
            router.push({ pathname: '/home/caafimaad/form', params: { qabyoId: docRef.id } });
        } catch (error) {
            // Use safe error message to avoid leaking sensitive information
            Alert.alert(t('caafimaad.servicesSelection.errors.firebaseErrorTitle'), t('caafimaad.servicesSelection.errors.firebaseError'));
        } finally {
            setProcessing(false);
        }
    };
    
    return ( <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.progressBarContainer}><View style={styles.progressBar} /></View>
                <Text style={styles.title}>{dalabNooc === 'package' ? t('caafimaad.servicesSelection.packageTitle') : t('caafimaad.servicesSelection.singleTitle')}</Text>
                <Text style={styles.subtitle}>{dalabNooc === 'package' ? t('caafimaad.servicesSelection.packageSubtitle') : t('caafimaad.servicesSelection.singleSubtitle')}</Text>
                {dalabNooc === 'single' && adeeggaLaDoortay && (
                    <View style={styles.mainServiceCard}>
                        <FontAwesome5 name="check-circle" size={24} color="#121212" />
                        <Text style={styles.mainServiceText}>{adeeggaLaDoortay}</Text>
                    </View>
                )}
                <View style={styles.servicesList}>
                    {ADEEGYADA_LAHELI_KARO.map(service => {
                        if (dalabNooc === 'single' && service === adeeggaLaDoortay) return null;
                        const isSelected = adeegyadaLaDoortay.includes(service);
                        return ( <TouchableOpacity key={service} style={styles.serviceItem} onPress={() => handleToggleService(service)}>
                                <MaterialIcons name={isSelected ? 'check-box' : 'check-box-outline-blank'} size={28} color={isSelected ? '#FFC107' : '#888'} />
                                <Text style={styles.serviceText}>{service}</Text>
                            </TouchableOpacity> );
                    })}
                </View>
                <TouchableOpacity style={[styles.nextButton, processing && styles.disabledButton]} onPress={handleNext} disabled={processing}>
                    {processing ? <ActivityIndicator color="#121212" /> : <Text style={styles.nextButtonText}>{t('caafimaad.servicesSelection.next')}</Text> }
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView> );
}
// Styles had an extra `s` - I will just include the necessary parts
const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: '#121212' }, container: { flexGrow: 1, paddingHorizontal: 20 }, backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 }, progressBarContainer: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden', marginBottom: 20, marginTop: 70 }, progressBar: { width: '25%', height: '100%', backgroundColor: '#FFC107' }, title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' }, subtitle: { fontSize: 16, color: '#A9A9A9', textAlign: 'center', marginTop: 8, marginBottom: 25 }, mainServiceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFC107', paddingVertical: 20, paddingHorizontal: 25, borderRadius: 12, marginBottom: 20, }, mainServiceText: { color: '#121212', fontSize: 18, fontWeight: 'bold', marginLeft: 15 }, servicesList: { width: '100%' }, serviceItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 20, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#333' }, serviceText: { color: 'white', fontSize: 16, marginLeft: 15 }, nextButton: { backgroundColor: '#FFC107', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 40 }, nextButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' }, disabledButton: { backgroundColor: '#A9A9A9' } });