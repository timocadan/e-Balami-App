import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../../contexts/LanguageContext';

const BRAND_YELLOW = '#FFCC00';
const BRAND_BLACK = '#000000';

export default function WelcomeScreen() {
  const { t } = useLanguage();
  const { height: windowHeight } = useWindowDimensions();
  // Pull artwork upward so less empty band sits under the app header (~7% of screen).
  const imageShiftY = -Math.round(windowHeight * 0.09);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.heroWrap}>
        <ImageBackground
          source={require('../../../assets/images/hero_bg.png')}
          style={styles.heroImage}
          imageStyle={[
            styles.heroImageFill,
            { transform: [{ translateY: imageShiftY }] },
          ]}
          resizeMode="cover"
        >
          {/* Top: solid black over header zone → fade to clear. Bottom: clear → black from CTA zone down. */}
          <LinearGradient
            colors={[
              BRAND_BLACK,
              'rgba(0,0,0,0)',
              'rgba(0,0,0,0)',
              BRAND_BLACK,
            ]}
            locations={[0, 0.001, 0.76, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.heroContent}>
            <Text style={styles.welcomeTitle}>{t('home.welcomeTitle')}</Text>
            <Link href="/home/caafimaad" asChild>
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
                <Text style={styles.ctaText}>{t('home.startBooking')}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_BLACK,
  },
  heroWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  heroImage: {
    flex: 1,
    width: '104%',
    justifyContent: 'flex-end',
  },
  heroImageFill: {
    width: '100%',
    // Slightly taller than the frame so shifting up doesn’t leave a gap at the bottom.
    height: '100%',
  },
  heroContent: {
    paddingHorizontal: 24,
    paddingBottom: 110,
    paddingTop: 16,
    // Sits in a flex-end column; nudge the whole block up to close the gap under the artwork.
    marginBottom: -28,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 45,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  ctaButton: {
    alignSelf: 'center',
    backgroundColor: BRAND_YELLOW,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    minWidth: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaText: {
    color: BRAND_BLACK,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
