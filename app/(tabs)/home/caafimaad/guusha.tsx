import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Waxaan ku darnay qalabka Animation-ka
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function GuushaScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    // Diyaarinta maskaxda Animation-ka
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Ku bilow animation-ka qaab loop ah (aan istaagayn)
        Animated.loop(
            Animated.sequence([
                // Si tartiib ah u weynee
                Animated.timing(pulseAnim, {
                    toValue: 1.03,
                    duration: 1500, // Wakhti dheer si uu u jilco
                    useNativeDriver: true,
                }),
                // Ku soo celi cabirkiisii hore
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* WAA KAN SANDUUQA CUSUB OO AANU KU DABBAQNAY ANIMATION-KA */}
                <Animated.View style={[styles.frame, { transform: [{ scale: pulseAnim }] }]}>
                    
                    {/* Intii hore oo dhan hadda sanduuqan ayay ku jiraan */}
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name="check-circle" size={80} color="#FFC107" />
                    </View>
                    <Text style={styles.title}>{t('caafimaad.success.title')}</Text>
                    <Text style={styles.subtitle}>
                        {t('caafimaad.success.message')}
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
                        <Text style={styles.buttonText}>{t('caafimaad.success.backToHome')}</Text>
                    </TouchableOpacity>
                    
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

// STYLES OO LA CUSBOONAYSIIYAY
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    
    // QAABKA SANDUUQA CUSUB EE NOOL (GLOWING & PULSING)
    frame: {
        width: '100%',
        backgroundColor: '#1E1E1E', // Midab khafiif ah si uu uga soocmo shaashadda
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        // Hooska iftiimaya (Glowing effect)
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 12, // Kani waa hooska Android
    },
    
    // Intii hore waa sidii oo kale
    iconContainer: { marginBottom: 30 },
    title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 15 },
    subtitle: { fontSize: 16, color: '#A9A9A9', textAlign: 'center', marginBottom: 40 },
    button: { 
        backgroundColor: '#FFC107', 
        paddingVertical: 18, 
        paddingHorizontal: 40, 
        borderRadius: 10, 
        alignItems: 'center', 
    },
    buttonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
});