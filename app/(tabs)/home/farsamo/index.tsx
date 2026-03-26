import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
// Waxaan ku darnay 'Dimensions'
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function FarsamoScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    
    const services = [
        { text: t('farsamo.services.homeOfficeRepair'), key: 'homeOfficeRepair', icon: 'wrench-outline', iconFamily: MaterialCommunityIcons },
        { text: t('farsamo.services.electrician'), key: 'electrician', icon: 'flash', iconFamily: MaterialCommunityIcons },
        { text: t('farsamo.services.plumber'), key: 'plumber', icon: 'water-pump', iconFamily: MaterialCommunityIcons },
        { text: t('farsamo.services.construction'), key: 'construction', icon: 'hard-hat', iconFamily: FontAwesome5 },
        { text: t('farsamo.services.technology'), key: 'technology', icon: 'laptop', iconFamily: MaterialIcons },
        { text: t('farsamo.services.carRepair'), key: 'carRepair', icon: 'car-wrench', iconFamily: MaterialCommunityIcons },
        { text: t('farsamo.services.events'), key: 'events', icon: 'party-popper', iconFamily: MaterialCommunityIcons },
        { text: t('farsamo.services.other'), key: 'other', icon: 'dots-horizontal', iconFamily: MaterialCommunityIcons },
    ];

const screenWidth = Dimensions.get('window').width; // Waxaan u baahanahay balaca shaashadda
    const glowAnim = useRef(new Animated.Value(1)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    // Waxaan ku darnay state-ka iyo animation-ka qoraalka socda
    const scrollAnim = useRef(new Animated.Value(screenWidth)).current;
    const [textWidth, setTextWidth] = useState(0);

    useEffect(() => {
        // Animation-ka badhanka weyn
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();

        // Animation-ka qoraalka socda (Marquee)
        const startMarqueeAnimation = () => {
            scrollAnim.setValue(screenWidth);
            Animated.loop(
                Animated.timing(scrollAnim, {
                    toValue: -textWidth,
                    duration: 15000,
                    useNativeDriver: true,
                })
            ).start();
        };

        if (textWidth > 0) {
            startMarqueeAnimation();
        }
    }, [textWidth]); // Waxaan ku xirnay textWidth si animation-ku u bilowdo marka cabirka la helo

    const scrollToServices = () => {
        scrollViewRef.current?.scrollTo({ y: 300, animated: true });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollView}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                     <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                </TouchableOpacity>

                <View style={styles.heroSection}>
                    <Image source={require('../../../../assets/images/technician-banner.png')} style={styles.bannerImage} />
                    <View style={styles.overlay} />
                    <View style={styles.heroContent}>
                        {/* Cinwaankan hadda waa mid gaaban oo ka duwan kii hore */}
                        <Text style={styles.heroTitle}></Text>
                        <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
                            <TouchableOpacity style={styles.mainButton} onPress={scrollToServices}>
                                <Text style={styles.mainButtonText}>{t('farsamo.bookNow')}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* ISBEDDEL #1: HALKAN AYAAN KEENAY QORAALKII SOCDAY */}
                    <View style={styles.marqueeContainer}>
                        <Animated.Text
                            numberOfLines={1}
                            style={[styles.marqueeText, { transform: [{ translateX: scrollAnim }] }]}
                            onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
                        >
                         {t('farsamo.marquee')}
                        </Animated.Text>
                    </View>
                    
                    <Text style={styles.sectionTitle}>{t('farsamo.title')}</Text>
                    <Text style={styles.sectionSubtitle}>{t('farsamo.subtitle')}</Text>
                    <View style={styles.servicesGrid}>
                        {services.map((service, index) => {
                            const IconComponent = service.iconFamily;
                            return (
                                <TouchableOpacity 
    key={index} 
    style={styles.card}
    onPress={() => router.push({ 
        pathname: '/home/farsamo/location', 
        params: { adeeg: service.text } // U dir magaca adeega foomka
    })}
>
                                    <IconComponent name={service.icon as any} size={32} color="#FFC107" />
                                    <Text style={styles.cardText}>{service.text}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styling-ka oo la cusboonaysiiyay
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    scrollView: { paddingBottom: 40 },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
    heroSection: { height: 400, justifyContent: 'center', alignItems: 'center' },
    bannerImage: { width: '100%', height: '100%', position: 'absolute' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18, 18, 18, 0.6)' },
    heroContent: { alignItems: 'center' },
    heroTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 260, textShadowColor: 'rgba(0,0,0,0.7)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 5},
    // ISBEDDEL #3: Badhanka oo la yareeyay
    mainButton: { backgroundColor: '#FFC107', paddingVertical: 16, paddingHorizontal: 35, borderRadius: 12 },
    mainButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
    contentContainer: { padding: 20 },
    // ISBEDDEL #2: Qurxinta qoraalka socda iyo meeshiisa
    marqueeContainer: {
        width: '100%',
        overflow: 'hidden',
        marginBottom: 25,
    },
    marqueeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFC107',
        width: 'auto',
    },
    sectionTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    sectionSubtitle: { color: '#A9A9A9', fontSize: 15, textAlign: 'center', marginTop: 8, marginBottom: 25 },
    servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { width: '48%', backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 15, height: 130, justifyContent: 'center' },
    cardText: { color: 'white', marginTop: 12, fontSize: 14, textAlign: 'center', fontWeight: '600' }
});