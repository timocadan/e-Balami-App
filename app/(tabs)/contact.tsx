import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/LanguageContext';

// HALKAN KU BEDDEL MACLUUMAADKAAGA SAXDA AH
const CONTACT_INFO = {
    phone: "025 278 8887",
    whatsapp: "https://wa.me/251991301950?text=Waan%20idin%20salaamey%2C%20waxaan%20ka%20socdaa%20dhanka%20e-Balamai%20App",
    email: "ebalamiservices@gmail.com",
    website: "https://www.ebalami.com",
};

export default function ContactScreen() {
    const { t } = useLanguage();
    const openLink = (url: string) => Linking.openURL(url);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>{t('contact.title')}</Text>
                <Text style={styles.subtitle}>
                    {t('contact.subtitle')}
                </Text>

                <View style={styles.card}>
                    <TouchableOpacity style={styles.row} onPress={() => openLink(`tel:${CONTACT_INFO.phone}`)}>
                        <FontAwesome name="phone" size={24} color="#FFC107" style={styles.icon}/>
                        <Text style={styles.text}>{t('contact.phone')}</Text>
                    </TouchableOpacity>
                   <TouchableOpacity style={styles.row} onPress={() => openLink(CONTACT_INFO.whatsapp)}>
                        <FontAwesome name="whatsapp" size={24} color="#FFC107" style={styles.icon}/>
                        <Text style={styles.text}>{t('contact.whatsapp')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => openLink(`mailto:${CONTACT_INFO.email}`)}>
                        <FontAwesome name="envelope" size={24} color="#FFC107" style={styles.icon}/>
                        <Text style={styles.text}>{t('contact.email')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => openLink(CONTACT_INFO.website)}>
                        <FontAwesome name="globe" size={24} color="#FFC107" style={styles.icon}/>
                        <Text style={styles.text}>{t('contact.website')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#A9A9A9', textAlign: 'center', marginBottom: 30 },
    card: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 20 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
    icon: { width: 40, },
    text: { color: 'white', fontSize: 18 }
});