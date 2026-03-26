import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc } from "firebase/firestore";
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../../firebaseConfig';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { validateName, validateEmail, validateCity, validateAge, validateDocumentId, MAX_LENGTHS } from '../../../../utils/validation';
import { getSafeErrorMessage } from '../../../../utils/security';

export default function MedicalFormScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { qabyoId } = useLocalSearchParams<{qabyoId: string}>(); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(30);
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [formattedPhone, setFormattedPhone] = useState('');
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isCityFocused, setIsCityFocused] = useState(false);
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
                phone: formattedPhone 
            });
            router.push({ pathname: '/home/caafimaad/goobta', params: { qabyoId: docIdValidation.sanitized } });
        } catch (e) {
            const errorMessage = getSafeErrorMessage(e);
            Alert.alert(t('caafimaad.form.errors.firebaseErrorTitle'), t('caafimaad.form.errors.firebaseError'));
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
        
                <Text style={styles.label}>{t('caafimaad.form.fullName')}</Text>
                <TextInput 
                    style={[styles.input, isNameFocused && styles.inputFocused]} 
                    placeholder={t('caafimaad.form.fullNamePlaceholder')} 
                    placeholderTextColor="#666" 
                    value={name} 
                    onChangeText={setName} 
                    onFocus={() => setIsNameFocused(true)} 
                    onBlur={() => setIsNameFocused(false)}
                    maxLength={MAX_LENGTHS.name}
                />
                {/* EMAIL FIELD - HIDDEN (can be re-enabled later by uncommenting) */}
                {/* 
                <Text style={styles.label}>{t('caafimaad.form.email')}</Text>
                <TextInput 
                    style={[styles.input, isEmailFocused && styles.inputFocused]} 
                    placeholder={t('caafimaad.form.emailPlaceholder')} 
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
                <Text style={styles.label}>{t('caafimaad.form.age')}</Text>
                <View style={styles.ageContainer}>
                    <TouchableOpacity onPress={() => setAge(age => Math.max(13, age - 1))} style={styles.ageButton}><Text style={styles.ageButtonText}>-</Text></TouchableOpacity>
                    <Text style={styles.ageText}>{age}</Text>
                    <TouchableOpacity onPress={() => setAge(age => Math.min(100, age + 1))} style={styles.ageButton}><Text style={styles.ageButtonText}>+</Text></TouchableOpacity>
                </View>
                <Text style={styles.label}>{t('caafimaad.form.city')}</Text>
                <TextInput 
                    style={[styles.input, isCityFocused && styles.inputFocused]} 
                    placeholder={t('caafimaad.form.agePlaceholder')} 
                    placeholderTextColor="#666" 
                    value={city} 
                    onChangeText={setCity} 
                    onFocus={() => setIsCityFocused(true)} 
                    onBlur={() => setIsCityFocused(false)}
                    maxLength={MAX_LENGTHS.city}
                />
                <Text style={styles.label}>{t('caafimaad.form.phone')}</Text>
                <PhoneInput ref={phoneInput} defaultValue={phone} defaultCode="SO" layout="second" onChangeText={setPhone} onChangeFormattedText={setFormattedPhone} withDarkTheme containerStyle={styles.phoneContainer} textContainerStyle={styles.phoneTextContainer} textInputStyle={{ color: 'white' }} codeTextStyle={{ color: 'white' }} />
                <TouchableOpacity style={[styles.nextButton, processing && styles.disabledButton]} onPress={handleNext} disabled={processing}>
                     {processing ? <ActivityIndicator color="#121212" /> : <Text style={styles.nextButtonText}>{t('caafimaad.form.next')}</Text> }
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView> );
}
// Paste the old styles here
const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: '#121212' }, container: { flexGrow: 1, padding: 20 }, backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 }, progressBarContainer: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden', marginBottom: 30, marginTop: 70 }, progressBar: { width: '50%', height: '100%', backgroundColor: '#FFC107' }, title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 25, textAlign: 'center' }, label: { color: 'white', fontSize: 16, marginBottom: 8, marginLeft: 5 }, input: { backgroundColor: '#1E1E1E', color: 'white', padding: 15, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#333', marginBottom: 15 }, inputFocused: { borderColor: '#FFC107' }, ageContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10, marginBottom: 20, backgroundColor: '#1E1E1E', padding: 5, borderRadius: 8, }, ageButton: { backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginHorizontal: 15 }, ageButtonText: { color: '#FFC107', fontSize: 24, fontWeight: 'bold' }, ageText: { color: 'white', fontSize: 24, fontWeight: 'bold', width: 60, textAlign: 'center' }, phoneContainer: { width: '100%', backgroundColor: '#1E1E1E', borderRadius: 8 }, phoneTextContainer: { backgroundColor: 'transparent', borderRadius: 8 }, nextButton: { backgroundColor: '#FFC107', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 30 }, nextButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' }, disabledButton: { backgroundColor: '#A9A9A9' } });