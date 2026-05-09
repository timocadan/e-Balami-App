// Path: app/(tabs)/home/caafimaad/index.tsx

// Tallaabada 1: Hubi in dhammaan agabkan la soo dhoofiyay
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../../contexts/LanguageContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CaafimaadScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // Tallaabada 2: Cusbooneysii liiska adeegyada si ay ugu jiraan kuwa cusub
  const services = [
    { text: t('caafimaad.services.hotelBooking'), key: 'hotelBooking', icon: 'hotel', iconFamily: FontAwesome5, type: 'navigate' },
    { text: t('caafimaad.services.hospitalBooking'), key: 'hospitalBooking', icon: 'hospital', iconFamily: FontAwesome5, type: 'navigate' },
    { text: t('caafimaad.services.translator'), key: 'translator', icon: 'headset', iconFamily: MaterialIcons, type: 'navigate' },
    { text: t('caafimaad.services.airportTaxi'), key: 'airportTaxi', icon: 'taxi', iconFamily: FontAwesome, type: 'navigate' },
    // Labada adeeg ee cusub ee lagu daray:
    { text: t('caafimaad.services.flightTicket'), key: 'flightTicket', icon: 'plane-departure', iconFamily: FontAwesome5, type: 'whatsapp' },
    { text: t('caafimaad.services.other'), key: 'other', icon: 'add-circle', iconFamily: MaterialIcons, type: 'modal' },
  ];

  const glowAnim = useRef(new Animated.Value(1)).current;
  const scrollAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [textWidth, setTextWidth] = useState(0);

  // Tallaabada 3: Ku dar state-ka maamulaya Modal-ka (popup-ka)
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    const startMarqueeAnimation = () => {
        scrollAnim.setValue(SCREEN_WIDTH);
        Animated.loop(
            Animated.timing(scrollAnim, {
                toValue: -textWidth,
                duration: 15000,
                useNativeDriver: true,
            })
        ).start();
    };

    if (textWidth > 0) startMarqueeAnimation();
  }, [glowAnim, scrollAnim, textWidth]);

  // ========== TALLAABADA 4: KU DAR SHAQADA FURAYSA WHATSAPP-KA ==========
  const openWhatsApp = (message: string) => {
    const phoneNumber = '+251991301950';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(t('caafimaad.whatsappErrorTitle'), t('caafimaad.whatsappError'));
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>
        
        <Image source={require('../../../../assets/images/medical-banner.png')} style={styles.bannerImage} />
        
        <View style={styles.headerContainer}>
            <Animated.Text numberOfLines={1} style={[ styles.headerTitle, { transform: [{ translateX: scrollAnim }] }]} onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}>
                {t('caafimaad.marquee')}
            </Animated.Text>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>{t('caafimaad.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('caafimaad.subtitle')}</Text>

          <View style={styles.servicesGrid}>
            {services.map((service, index) => {
              const IconComponent = service.iconFamily;
              
              // ========== TALLAABADA 5: SAMAYNTA MASKAXDA KALA DOORANAYSA SHAQOOYINKA ==========
              let onPressAction;
              switch (service.type) {
                case 'navigate':
                  onPressAction = () => router.push({
                    pathname: '/home/caafimaad/adeegyada',
                    params: {
                      dalabNooc: 'single',
                      adeeggaLaDoortay: service.text,
                      adeeggaKey: service.key,
                    },
                  });
                  break;
                case 'whatsapp':
                  onPressAction = () => openWhatsApp(t('caafimaad.whatsapp.flightMessage'));
                  break;
                case 'modal':
                  onPressAction = () => setIsModalVisible(true);
                  break;
                default:
                  onPressAction = () => {};
              }

              return (
                <TouchableOpacity key={index} style={styles.card} onPress={onPressAction}>
                  <IconComponent name={service.icon as any} size={28} color="#FFCC00" />
                  <Text style={styles.cardText}>{service.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
            <TouchableOpacity style={styles.mainButton} onPress={() => {
              router.push({
                pathname: '/home/caafimaad/adeegyada',
                params: { dalabNooc: 'package' }
              });
            }}>
              <Text style={styles.mainButtonText}>{t('caafimaad.bookPackage')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        {/* ========== TALLAABADA 6: KU DAR QAYBTA MODAL-KA (POPUP-KA) ========== */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
        >
            <Pressable style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{t('caafimaad.additionalServices.title')}</Text>
                    
                    <TouchableOpacity style={styles.modalButton} onPress={() => openWhatsApp(t('caafimaad.whatsapp.visaMessage'))}>
                        <Text style={styles.modalButtonText}>{t('caafimaad.additionalServices.visaHelp')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={() => openWhatsApp(t('caafimaad.whatsapp.embassyMessage'))}>
                        <Text style={styles.modalButtonText}>{t('caafimaad.additionalServices.embassyBooking')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.closeButtonText}>{t('caafimaad.additionalServices.close')}</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

// ========== TALLAABADA 7: KU DAR STYLE-KA LOOGU TALAGALAY MODAL-KA ==========
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  scrollView: { paddingBottom: 40 },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
  bannerImage: { width: '100%', height: 335, resizeMode: 'cover' },
  headerContainer: { marginTop: -70, width: '100%', overflow: 'hidden', paddingVertical: 20 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  contentContainer: { padding: 20, paddingTop: 10 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFCC00', marginTop: 10, textAlign: 'center' },
  sectionSubtitle: { fontSize: 16, color: '#A9A9A9', marginTop: 8, marginBottom: 20, textAlign: 'center' },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 15, justifyContent: 'center', height: 120 },
  cardText: { color: 'white', marginTop: 10, fontSize: 14, textAlign: 'center' },
  mainButton: { backgroundColor: '#FFCC00', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginHorizontal: 20, marginTop: 20 },
  mainButtonText: { color: '#000000', fontSize: 18, fontWeight: 'bold' },
  // Styles-ka cusub ee Modal-ka
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1E1E1E', width: '85%', padding: 20, borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFCC00', marginBottom: 20 },
  modalButton: { backgroundColor: '#333', width: '100%', paddingVertical: 15, borderRadius: 10, marginBottom: 10 },
  modalButtonText: { color: 'white', fontSize: 16, textAlign: 'center' },
  closeButton: { marginTop: 10, padding: 10 },
  closeButtonText: { color: '#A9A9A9', fontSize: 14 }
});