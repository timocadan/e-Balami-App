// Path: app/(tabs)/home/farsamo/form.tsx

import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection } from "firebase/firestore";
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../../firebaseConfig';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { validateName, validateEmail, validateAddress, validateService, validateLocation, MAX_LENGTHS } from '../../../../utils/validation';
import { getSafeErrorMessage } from '../../../../utils/security';

export default function FarsamoFormScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { adeeg, location } = useLocalSearchParams<{ adeeg: string, location: string }>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [formattedPhone, setFormattedPhone] = useState('');
    const [processing, setProcessing] = useState(false);
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isAddressFocused, setIsAddressFocused] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    const handleNext = async () => {
        // Validate service parameter
        const serviceValidation = validateService(adeeg);
        if (!serviceValidation.isValid) {
            return Alert.alert(t('farsamo.form.errorTitle'), serviceValidation.error || 'Invalid service');
        }

        // Validate location parameter
        const locationValidation = validateLocation(location);
        if (!locationValidation.isValid) {
            return Alert.alert(t('farsamo.form.errorTitle'), locationValidation.error || 'Invalid location');
        }

        // Validate name
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            return Alert.alert(t('farsamo.form.errorTitle'), nameValidation.error || t('farsamo.form.errors.nameRequired'));
        }

        // Email validation - DISABLED (hidden but can be re-enabled later)
        // Uncomment the block below to re-enable email validation
        // const emailValidation = validateEmail(email);
        // if (!emailValidation.isValid) {
        //     return Alert.alert(t('farsamo.form.errorTitle'), emailValidation.error || t('farsamo.form.errors.emailInvalid'));
        // }

        // Validate phone
        if (!phoneInput.current?.isValidNumber(phone)) {
            return Alert.alert(t('farsamo.form.phoneErrorTitle'), t('farsamo.form.errors.phoneInvalid'));
        }

        // Validate address
        const addressValidation = validateAddress(address);
        if (!addressValidation.isValid) {
            return Alert.alert(t('farsamo.form.errorTitle'), addressValidation.error || t('farsamo.form.errors.addressRequired'));
        }

        setProcessing(true);
        try {
            const docRef = await addDoc(collection(db, "dalabyadaFarsamoQabyoAh"), {
                service: serviceValidation.sanitized,
                location: locationValidation.sanitized,
                name: nameValidation.sanitized,
                // email: emailValidation.sanitized, // DISABLED - Uncomment when re-enabling email field
                phone: formattedPhone,
                address: addressValidation.sanitized,
                timestamp: new Date()
            });
            
            router.push({ pathname: '/home/farsamo/faahfaahin', params: { qabyoId: docRef.id } });
            
        } catch (e) {
            const errorMessage = getSafeErrorMessage(e);
            Alert.alert(t('farsamo.form.errors.errorTitle'), t('farsamo.form.errors.firebaseError'));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                 <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><MaterialIcons name="arrow-back-ios" size={24} color="white" /></TouchableOpacity>
                 <View style={styles.progressBarContainer}><View style={styles.progressBar} /></View>
                 
                 {/* ========= TALLAABADA 1AAD: QORAALKII SARE WAA LA SAARAY ========= */}
                 
                 {/* ========= TALLAABADA 2AAD: SANDUUQII HORE WAXAA LAGU BEDDELAY NAQSHADDAN CUSUB EE QURUXDA BADAN ========= */}
                 <View style={styles.locationHeader}>
                    <MaterialIcons name="location-pin" size={24} color="#FFC107" />
                    <Text style={styles.locationHeaderText}>
                        {Array.isArray(location) ? validateLocation(location[0]).sanitized : validateLocation(location).sanitized}
                    </Text>
                 </View>

                 <Text style={styles.label}>{t('farsamo.form.fullName')}</Text>
                 <TextInput 
                     style={[styles.input, isNameFocused && styles.inputFocused]} 
                     placeholder={t('farsamo.form.fullNamePlaceholder')} 
                     placeholderTextColor="#666" 
                     value={name} 
                     onChangeText={setName} 
                     onFocus={() => setIsNameFocused(true)} 
                     onBlur={() => setIsNameFocused(false)}
                     maxLength={MAX_LENGTHS.name}
                 />
                 
                 {/* EMAIL FIELD - HIDDEN (can be re-enabled later by uncommenting) */}
                 {/* 
                 <Text style={styles.label}>{t('farsamo.form.email')}</Text>
                 <TextInput 
                     style={[styles.input, isEmailFocused && styles.inputFocused]} 
                     placeholder={t('farsamo.form.emailPlaceholder')} 
                     placeholderTextColor="#666" 
                     keyboardType='email-address' 
                     value={email} 
                     onChangeText={setEmail} 
                     onFocus={() => setIsEmailFocused(true)} 
                     onBlur={() => setIsEmailFocused(false)}
                     maxLength={MAX_LENGTHS.email}
                     autoCapitalize="none"
                 />
                 */}
                 
                 <Text style={styles.label}>{t('farsamo.form.phone')}</Text>
                 <PhoneInput
                    ref={phoneInput} defaultValue={phone} defaultCode="SO" layout="second"
                    onChangeText={setPhone} onChangeFormattedText={setFormattedPhone} withDarkTheme
                    containerStyle={styles.phoneContainer} textContainerStyle={styles.phoneTextContainer}
                    textInputStyle={{ color: 'white' }} codeTextStyle={{ color: 'white' }} />
                 
                 <Text style={styles.label}>{t('farsamo.form.address')}</Text>
                 <TextInput 
                     style={[styles.input, styles.textArea, isAddressFocused && styles.inputFocused]} 
                     placeholder={t('farsamo.form.addressPlaceholder')} 
                     placeholderTextColor="#666" 
                     multiline 
                     numberOfLines={4} 
                     value={address} 
                     onChangeText={setAddress} 
                     onFocus={() => setIsAddressFocused(true)} 
                     onBlur={() => setIsAddressFocused(false)}
                     maxLength={MAX_LENGTHS.address}
                 />

                 <TouchableOpacity 
                    style={[styles.nextButton, processing && styles.disabledButton]} 
                    onPress={handleNext} disabled={processing}>
                     {processing ? <ActivityIndicator color="#121212" /> : <Text style={styles.nextButtonText}>{t('farsamo.form.next')}</Text>}
                 </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// ========== STYLE-KA OO LA CUSBOONAYSIIYAY SI UU U FULIYO CODSIYADAADA ==========
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    container: { flexGrow: 1, padding: 20 },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
    progressBarContainer: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden', marginBottom: 25, marginTop: 70 }, // Wax yar ayaan beddelnay margin-ka
    progressBar: { width: '33%', height: '100%', backgroundColor: '#FFC107' },
    
    // Naqshadda cusub ee Location-ka oo leh icon
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#333'
    },
    locationHeaderText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },

    label: { color: 'white', fontSize: 16, marginBottom: 8, marginLeft: 5 },
    input: { backgroundColor: '#1E1E1E', color: 'white', padding: 15, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#333', marginBottom: 15 },
    inputFocused: { borderColor: '#FFC107' },
    textArea: { height: 120, textAlignVertical: 'top' },
    phoneContainer: { width: '100%', backgroundColor: '#1E1E1E', borderRadius: 8 },
    phoneTextContainer: { backgroundColor: 'transparent', borderRadius: 8 },
    nextButton: { backgroundColor: '#FFC107', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    nextButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
    disabledButton: { backgroundColor: '#A9A9A9' }
});