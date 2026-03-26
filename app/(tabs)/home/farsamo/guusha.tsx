import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function FarsamoGuushaScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { serviceName } = useLocalSearchParams();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.03, duration: 1500, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Animated.View style={[styles.frame, { transform: [{ scale: pulseAnim }] }]}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name="check-circle" size={80} color="#FFC107" />
                    </View>
                    <Text style={styles.title}>{t('farsamo.success.title')}</Text>
                    <Text style={styles.subtitle}>
                        {t('farsamo.success.message').replace('{serviceName}', Array.isArray(serviceName) ? serviceName[0] : serviceName || '')}
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
                        <Text style={styles.buttonText}>{t('farsamo.success.backToHome')}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    frame: {
        width: '100%',
        backgroundColor: '#1E1E1E',
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    iconContainer: { marginBottom: 30 },
    title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 15 },
    subtitle: { fontSize: 16, color: '#A9A9A9', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
    button: { 
        backgroundColor: '#FFC107', 
        paddingVertical: 18, 
        paddingHorizontal: 40, 
        borderRadius: 10, 
        alignItems: 'center', 
    },
    buttonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
});