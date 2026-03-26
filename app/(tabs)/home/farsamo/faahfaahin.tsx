import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../../firebaseConfig';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { validateDetails, validateDocumentId, MAX_LENGTHS } from '../../../../utils/validation';
import { getSafeErrorMessage } from '../../../../utils/security';


export default function FaahfaahinScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { qabyoId } = useLocalSearchParams(); // Qabo ID-ga dalabka

    const [faahfaahin, setFaahfaahin] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [processing, setProcessing] = useState(false);
    
    // Si loo xisaabiyo xarafaha harsan
    const xarafahaHarsan = 50 - faahfaahin.length;

    // Shaqada hubinta iyo cusboonaysiinta
    const handleNext = async () => {
        // Validate document ID
        const docIdValidation = validateDocumentId(qabyoId);
        if (!docIdValidation.isValid) {
            Alert.alert(t('farsamo.details.errors.errorTitle'), t('farsamo.details.errors.documentNotFound'));
            return;
        }

        // Validate details
        const detailsValidation = validateDetails(faahfaahin);
        if (!detailsValidation.isValid) {
            Alert.alert(t('farsamo.details.alertTitle'), detailsValidation.error || t('farsamo.details.errors.lengthInvalid'));
            return;
        }
        
        setProcessing(true);
        
        try {
            const docRef = doc(db, "dalabyadaFarsamoQabyoAh", docIdValidation.sanitized);
            await updateDoc(docRef, {
                details: detailsValidation.sanitized
            });

            // U gudub shaashada bixinta
            router.push({
                pathname: '/home/farsamo/bixinta',
                params: { qabyoId: docIdValidation.sanitized }
            });

        } catch(e) {
            const errorMessage = getSafeErrorMessage(e);
            Alert.alert(t('farsamo.details.errors.firebaseError'), t('farsamo.details.errors.updateError'));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={styles.container}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                     <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                </TouchableOpacity>

                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar} />
                </View>

                <Text style={styles.title}>{t('farsamo.details.title')}</Text>
                <Text style={styles.subtitle}>{t('farsamo.details.subtitle')}</Text>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.textArea, isFocused && styles.textAreaFocused]}
                        placeholder={t('farsamo.details.placeholder')}
                        placeholderTextColor="#666"
                        multiline
                        maxLength={MAX_LENGTHS.details}
                        value={faahfaahin}
                        onChangeText={setFaahfaahin}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <Text style={[styles.charCount, xarafahaHarsan < 10 && { color: '#FFC107'}]}>
                        {xarafahaHarsan} {t('farsamo.details.charactersLeft')}
                    </Text>
                </View>
                
                <View style={styles.bottomContainer}>
                    <TouchableOpacity 
                        style={[styles.nextButton, processing && styles.disabledButton]} 
                        onPress={handleNext} 
                        disabled={processing}
                    >
                         {processing 
                            ? <ActivityIndicator color="#121212" />
                            : <Text style={styles.nextButtonText}>{t('farsamo.details.next')}</Text>
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Styling-ka shaashadan
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#121212' },
    container: { flex: 1, paddingHorizontal: 20 },
         backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20 },
    progressBarContainer: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden', marginBottom: 20, marginTop: 70 },
    progressBar: { width: '66%', height: '100%', backgroundColor: '#FFC107' },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#A9A9A9', textAlign: 'center', marginTop: 8, marginBottom: 25 },
    inputContainer: { flex: 1 },
    textArea: {
        backgroundColor: '#1E1E1E',
        color: 'white',
        borderRadius: 12,
        padding: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
        height: 200,
        textAlignVertical: 'top'
    },
    textAreaFocused: { borderColor: '#FFC107' },
    charCount: { color: '#888', textAlign: 'right', marginTop: 8, fontSize: 14 },
    bottomContainer: { paddingBottom: 80 },
    nextButton: { backgroundColor: '#FFC107', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    nextButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
    disabledButton: { backgroundColor: '#A9A9A9' }
});