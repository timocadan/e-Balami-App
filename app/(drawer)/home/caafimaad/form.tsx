import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc } from "firebase/firestore";
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../../firebaseConfig';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { validateName, validateCity, validateAge, validateDocumentId, MAX_LENGTHS } from '../../../../utils/validation';
import { MEDICAL_FLOW_BACK_TOP, MEDICAL_FLOW_PROGRESS_MARGIN_TOP } from '../../../../constants/BookingData';
import { MEDICAL_FORM_THEME } from '../../../../constants/medicalFormTheme';

export default function MedicalFormScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { user } = useAuth();
    const { qabyoId } = useLocalSearchParams<{qabyoId: string}>(); 
    const [name, setName] = useState('');
    const [age, setAge] = useState(30);
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [formattedPhone, setFormattedPhone] = useState('');
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isCityFocused, setIsCityFocused] = useState(false);
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);
    const [processing, setProcessing] = useState(false);
    const phoneInput = useRef<PhoneInput>(null);

    const handleNext = async () => {
        // Validate document ID first
        const docIdValidation = validateDocumentId(qabyoId);
        if (!docIdValidation.isValid) {
            return Alert.alert(t('caafimaad.form.errors.errorTitleCritical'), t('caafimaad.form.errors.requestIdNotFound'));
        }

        // Validate name
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            return Alert.alert(t('caafimaad.form.errors.errorTitle'), nameValidation.error || t('caafimaad.form.errors.nameRequired'));
        }

        // Email validation - DISABLED (hidden but can be re-enabled later)
        // Uncomment the block below to re-enable email validation
        // const emailValidation = validateEmail(email);
        // if (!emailValidation.isValid) {
        //     return Alert.alert(t('caafimaad.form.errors.errorTitle'), emailValidation.error || t('caafimaad.form.errors.emailInvalid'));
        // }

        // Validate phone
        if (!phoneInput.current?.isValidNumber(phone)) {
            return Alert.alert(t('caafimaad.form.errors.errorTitle'), t('caafimaad.form.errors.phoneInvalid'));
        }

        // Validate age
        const ageValidation = validateAge(age);
        if (!ageValidation.isValid) {
            return Alert.alert(t('caafimaad.form.errors.errorTitle'), ageValidation.error || 'Invalid age');
        }

        // Validate city (optional but should be sanitized if provided)
        const cityValidation = city.trim() ? validateCity(city) : { isValid: true, sanitized: '' };
        if (!cityValidation.isValid) {
            return Alert.alert(t('caafimaad.form.errors.errorTitle'), cityValidation.error || 'Invalid city');
        }

        setProcessing(true);
        try {
            const docRef = doc(db, "dalabyadaAanDhamaystirnayn", docIdValidation.sanitized);
            await updateDoc(docRef, { 
                name: nameValidation.sanitized, 
                // email: emailValidation.sanitized, // DISABLED - Uncomment when re-enabling email field
                age: age, 
                city: cityValidation.sanitized, 
                phone: formattedPhone,
                uid: user?.uid ?? null,
            });
            router.push({ pathname: '/home/caafimaad/goobta', params: { qabyoId: docIdValidation.sanitized } });
        } catch {
            Alert.alert(t('caafimaad.form.errors.firebaseErrorTitle'), t('caafimaad.form.errors.firebaseError'));
        } finally {
            setProcessing(false);
        }
    };
    
    return ( <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                     <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.progressBarContainer}><View style={styles.progressBar} /></View>
        
                <View style={styles.labelRow}>
                    <Text style={styles.label}>{t('caafimaad.form.fullName')}</Text>
                </View>
                <TextInput 
                    style={[styles.input, isNameFocused && styles.inputFocused]} 
                    placeholder={t('caafimaad.form.fullNamePlaceholder')} 
                    placeholderTextColor={MEDICAL_FORM_THEME.placeholder} 
                    value={name} 
                    onChangeText={setName} 
                    onFocus={() => setIsNameFocused(true)} 
                    onBlur={() => setIsNameFocused(false)}
                    maxLength={MAX_LENGTHS.name}
                    selectionColor={MEDICAL_FORM_THEME.inputBorderFocus}
                />
                {/* EMAIL FIELD - HIDDEN (can be re-enabled later by uncommenting) */}
                {/* 
                <View style={styles.labelRow}>
                    <Text style={styles.label}>{t('caafimaad.form.email')}</Text>
                </View>
                <TextInput 
                    style={[styles.input, isEmailFocused && styles.inputFocused]} 
                    placeholder={t('caafimaad.form.emailPlaceholder')} 
                    placeholderTextColor={MEDICAL_FORM_THEME.placeholder} 
                    keyboardType='email-address' 
                    value={email} 
                    onChangeText={setEmail} 
                    onFocus={() => setIsEmailFocused(true)} 
                    onBlur={() => setIsEmailFocused(false)}
                    maxLength={MAX_LENGTHS.email}
                    autoCapitalize="none"
                    selectionColor={MEDICAL_FORM_THEME.inputBorderFocus}
                />
                */}
                <View style={styles.labelRow}>
                    <Text style={styles.label}>{t('caafimaad.form.age')}</Text>
                </View>
                <View style={styles.ageContainer}>
                    <TouchableOpacity onPress={() => setAge(age => Math.max(13, age - 1))} style={styles.ageButton}><Text style={styles.ageButtonText}>-</Text></TouchableOpacity>
                    <Text style={styles.ageText}>{age}</Text>
                    <TouchableOpacity onPress={() => setAge(age => Math.min(100, age + 1))} style={styles.ageButton}><Text style={styles.ageButtonText}>+</Text></TouchableOpacity>
                </View>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>{t('caafimaad.form.city')}</Text>
                </View>
                <TextInput 
                    style={[styles.input, isCityFocused && styles.inputFocused]} 
                    placeholder={t('caafimaad.form.cityPlaceholder')} 
                    placeholderTextColor={MEDICAL_FORM_THEME.placeholder} 
                    value={city} 
                    onChangeText={setCity} 
                    onFocus={() => setIsCityFocused(true)} 
                    onBlur={() => setIsCityFocused(false)}
                    maxLength={MAX_LENGTHS.city}
                    selectionColor={MEDICAL_FORM_THEME.inputBorderFocus}
                />
                <View style={styles.labelRow}>
                    <Text style={styles.label}>{t('caafimaad.form.phone')}</Text>
                </View>
                <PhoneInput
                    ref={phoneInput}
                    defaultValue={phone}
                    defaultCode="SO"
                    layout="second"
                    onChangeText={setPhone}
                    onChangeFormattedText={setFormattedPhone}
                    withDarkTheme
                    containerStyle={[styles.phoneContainer, isPhoneFocused && styles.phoneContainerFocused]}
                    textContainerStyle={styles.phoneTextContainer}
                    textInputStyle={styles.phoneTextInput}
                    codeTextStyle={styles.phoneCodeText}
                    textInputProps={{
                        placeholderTextColor: MEDICAL_FORM_THEME.placeholder,
                        onFocus: () => setIsPhoneFocused(true),
                        onBlur: () => setIsPhoneFocused(false),
                    }}
                />
                <TouchableOpacity style={[styles.nextButton, processing && styles.disabledButton]} onPress={handleNext} disabled={processing}>
                     {processing ? <ActivityIndicator color="#121212" /> : <Text style={styles.nextButtonText}>{t('caafimaad.form.next')}</Text> }
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView> );
}
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: MEDICAL_FORM_THEME.screenBg },
    container: { flexGrow: 1, padding: 20 },
    backButton: {
        position: 'absolute',
        top: MEDICAL_FLOW_BACK_TOP,
        left: 20,
        zIndex: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        borderRadius: 20,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 30,
        marginTop: MEDICAL_FLOW_PROGRESS_MARGIN_TOP,
    },
    progressBar: { width: '50%', height: '100%', backgroundColor: MEDICAL_FORM_THEME.inputBorderFocus },
    title: { fontSize: 24, fontWeight: 'bold', color: MEDICAL_FORM_THEME.text, marginBottom: 25, textAlign: 'center' },
    labelRow: {
        borderLeftWidth: 3,
        borderLeftColor: MEDICAL_FORM_THEME.labelAccent,
        paddingLeft: 10,
        marginBottom: 8,
        marginLeft: 2,
    },
    label: {
        color: MEDICAL_FORM_THEME.labelText,
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    input: {
        backgroundColor: MEDICAL_FORM_THEME.inputBg,
        color: MEDICAL_FORM_THEME.text,
        paddingHorizontal: 15,
        paddingVertical: 14,
        borderRadius: MEDICAL_FORM_THEME.radius,
        fontSize: 16,
        borderWidth: MEDICAL_FORM_THEME.borderWidth,
        borderColor: MEDICAL_FORM_THEME.inputBorder,
        marginBottom: 16,
    },
    inputFocused: { borderColor: MEDICAL_FORM_THEME.inputBorderFocus },
    ageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginBottom: 20,
        backgroundColor: MEDICAL_FORM_THEME.inputBg,
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: MEDICAL_FORM_THEME.radius,
        borderWidth: MEDICAL_FORM_THEME.borderWidth,
        borderColor: MEDICAL_FORM_THEME.inputBorder,
    },
    ageButton: {
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 15,
    },
    ageButtonText: { color: MEDICAL_FORM_THEME.inputBorderFocus, fontSize: 24, fontWeight: 'bold' },
    ageText: { color: MEDICAL_FORM_THEME.text, fontSize: 24, fontWeight: 'bold', width: 60, textAlign: 'center' },
    phoneContainer: {
        width: '100%',
        backgroundColor: MEDICAL_FORM_THEME.inputBg,
        borderRadius: MEDICAL_FORM_THEME.radius,
        borderWidth: MEDICAL_FORM_THEME.borderWidth,
        borderColor: MEDICAL_FORM_THEME.inputBorder,
        overflow: 'hidden',
        marginBottom: 16,
    },
    phoneContainerFocused: { borderColor: MEDICAL_FORM_THEME.inputBorderFocus },
    phoneTextContainer: { backgroundColor: 'transparent' },
    phoneTextInput: { color: MEDICAL_FORM_THEME.text, fontSize: 16, paddingVertical: 0 },
    phoneCodeText: { color: MEDICAL_FORM_THEME.text },
    nextButton: {
        backgroundColor: MEDICAL_FORM_THEME.inputBorderFocus,
        padding: 18,
        borderRadius: MEDICAL_FORM_THEME.radius,
        alignItems: 'center',
        marginTop: 30,
    },
    nextButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
    disabledButton: { backgroundColor: '#A9A9A9' },
});