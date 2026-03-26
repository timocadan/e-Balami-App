import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AboutScreen() {
    const { t } = useLanguage();
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>{t('about.title')}</Text>
                
                <Text style={styles.paragraph}>
                    {t('about.description')}
                </Text>

                <View style={styles.section}>
                    <FontAwesome5 name="bullseye" size={24} color="#FFC107" />
                    <Text style={styles.sectionTitle}>{t('about.missionTitle')}</Text>
                    <Text style={styles.paragraph}>
                    {t('about.missionDescription')}
                    </Text>
                </View>

                 <View style={styles.section}>
                    <FontAwesome5 name="lightbulb" size={24} color="#FFC107" />
                    <Text style={styles.sectionTitle}>{t('about.valuesTitle')}</Text>
                     <Text style={styles.valuePoint}>• {t('about.values.trust')}</Text>
                     <Text style={styles.valuePoint}>• {t('about.values.care')}</Text>
                     <Text style={styles.valuePoint}>• {t('about.values.service')}</Text>
                     <Text style={styles.valuePoint}>• {t('about.values.expertise')}</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    container: { alignItems: 'center', padding: 20 },
    logo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 15 },
    paragraph: { fontSize: 16, color: '#A9A9A9', textAlign: 'center', lineHeight: 24, marginBottom: 20 },
    section: { width: '100%', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 12, padding: 20, marginBottom: 15 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFC107', marginTop: 10, marginBottom: 10 },
    valuePoint: { fontSize: 16, color: '#E0E0E0', textAlign: 'center', marginBottom: 5}
});