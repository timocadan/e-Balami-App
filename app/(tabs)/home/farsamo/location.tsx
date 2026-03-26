import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../../contexts/LanguageContext';

const MAGAALOOYINKA_LAGA_SHAQEEYO = [
    { id: '1', magaalada: 'Jigjiga' },   { id: '2', magaalada: 'Dire Dawa' },
    { id: '3', magaalada: 'Mogadishu' }, { id: '4', magaalada: 'Hargaysa' },
    { id: '5', magaalada: 'Garoowe' },   { id: '6', magaalada: 'Bosaso' },
];

// <<< SAX >>> HALKAN WAA CILADDII UGU HORREYSAY. WAA IN LAGU DARAA 'export default'
export default function FarsamoLocationScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { adeeg } = useLocalSearchParams<{ adeeg: string }>();
    const [goobtaRaadinta, setGoobtaRaadinta] = useState('');
    const [goobtaLaDoortay, setGoobtaLaDoortay] = useState<any>(null);

    const magaalooyinkaLaHelay = MAGAALOOYINKA_LAGA_SHAQEEYO.filter(item => 
        item.magaalada.toLowerCase().includes(goobtaRaadinta.toLowerCase())
    );

    const handleNext = () => { // Looma baahna 'async' halkan
        if (!goobtaLaDoortay) {
            return Alert.alert(t('farsamo.location.errors.alertTitle'), t('farsamo.location.errors.alert'));
        }
        
        // Hadda waxaan isticmaalaynaa magaca 'location' sidaad adigu u rabtay
        router.push({ 
            pathname: '/home/farsamo/form', 
            params: { 
                adeeg: adeeg,
                location: goobtaLaDoortay.magaalada 
            } 
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                 <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><MaterialIcons name="arrow-back-ios" size={24} color="white" /></TouchableOpacity>
                 <View style={styles.progressBarContainer}><View style={styles.progressBar} /></View>
                 <Text style={styles.title}>{t('farsamo.location.title')}</Text>
                 <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={24} color="#888" style={styles.searchIcon} />
                    <TextInput style={styles.searchInput} placeholder={t('farsamo.location.placeholder')} placeholderTextColor="#888" value={goobtaRaadinta} onChangeText={setGoobtaRaadinta} />
                 </View>
                 <FlatList data={magaalooyinkaLaHelay} keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={[styles.cityCard, goobtaLaDoortay?.id === item.id && styles.selectedCard]}
                            onPress={() => setGoobtaLaDoortay(item)}>
                            <Text style={styles.cityText}>{t(`farsamo.location.cities.${item.magaalada}`) || item.magaalada}</Text>
                            {goobtaLaDoortay?.id === item.id && <MaterialIcons name="check-circle" size={28} color="#FFC107" />}
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }} />
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}><Text style={styles.nextButtonText}>{t('farsamo.location.next')}</Text></TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Styles waa sidii hore (waxba lagama beddelin)
const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: '#121212' }, container: { flex: 1, paddingHorizontal: 20 }, backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 }, progressBarContainer: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden', marginBottom: 30, marginTop: 70 }, progressBar: { width: '33%', height: '100%', backgroundColor: '#FFC107' }, title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center' }, searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, borderWidth: 1, borderColor: '#333'}, searchIcon: { marginRight: 10 }, searchInput: { flex: 1, color: 'white', fontSize: 16, paddingVertical: 15 }, cityCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E1E1E', paddingVertical: 25, paddingHorizontal: 20, borderRadius: 10, marginBottom: 10, borderWidth: 2, borderColor: '#1E1E1E' }, selectedCard: { borderColor: '#FFC107' }, cityText: { color: 'white', fontSize: 18, fontWeight: 'bold' }, nextButton: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#FFC107', padding: 18, borderRadius: 10, alignItems: 'center' }, nextButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' }, });