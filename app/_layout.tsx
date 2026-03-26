// Path: app/_layout.tsx

// TALLAABADA 1: Hubi in xariiqdani ay tahay TAN UGU HORREYSA faylka dhexdiisa. Waa muhiim.
import 'react-native-gesture-handler';

import { Stack } from "expo-router";
// TALLAABADA 2: Soo dhoofi Maamulaha Guud
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
  return (
    // TALLAABADA 3: App-ka oo dhan geli weelka Maamulaha Guud
    <LanguageProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
    </LanguageProvider>
  );
}