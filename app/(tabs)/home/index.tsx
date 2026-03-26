import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Link wuxuu noo suuragelinayaa inaan shaashadaha isu gudubno
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function WelcomeScreen() {
  const { language, setLanguage, t } = useLanguage();
  
  const cycleLanguage = () => {
    if (language === 'so') {
      setLanguage('en');
    } else if (language === 'en') {
      setLanguage('am');
    } else {
      setLanguage('so');
    }
  };

  const getFlagEmoji = () => {
    if (language === 'so') return '🇸🇴';
    if (language === 'en') return '🇬🇧';
    return '🇪🇹';
  };

  const getLanguageText = () => {
    if (language === 'so') return 'SO';
    if (language === 'en') return 'EN';
    return 'AM';
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Language Toggle Button */}
      <TouchableOpacity 
        style={styles.languageToggle}
        onPress={cycleLanguage}
      >
        <Text style={styles.flagEmoji}>{getFlagEmoji()}</Text>
        <Text style={styles.languageText}>{getLanguageText()}</Text>
      </TouchableOpacity>
      
      <View style={styles.container}>
        {/* Qaybta sare: Logo-ga iyo qoraalka */}
        <View style={styles.topContainer}>
          {/* Halkan ayaan ku darnay sawirka logo-ga */}
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logo} 
          />
          <Text style={styles.title}>{t('home.title')}</Text>
        </View>

        {/* Qaybta hoose: Labada badhan oo loo qaabeeyey si waafaqsan naqshada */}
        <View style={styles.bottomContainer}>
          
          <Link href="/home/caafimaad" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>{t('home.medicalServices')}</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/home/farsamo" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>{t('home.technicalServices')}</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </View>
    </SafeAreaView>
  );
}

// Styling-ka cusub oo aad ugu dhow naqshadaada
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', 
    position: 'relative',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  languageToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#FFC107',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    paddingBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: '#FFFFFF', 
    textAlign: 'center',
    fontFamily: 'sans-serif', // Isticmaal font qurxoon
  },
  button: {
    backgroundColor: '#FFC107', 
    paddingVertical: 20,
    borderRadius: 16, // Geesaha ka dhig kuwo aad u wareegsan
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#121212', 
    fontSize: 18,
    fontWeight: 'bold',
  }
});