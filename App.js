import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/ReduxStore';
import { Provider } from 'react-redux';
import RootNavigation from './src/Navigation/RootNavigation';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'elephant': require('./assets/fonts/ElephantRegular.ttf'),
    'inter': require('./assets/fonts/Inter-Regular.ttf'),
    'space-grotesk': require('./assets/fonts/SpaceGrotesk-Regular.ttf'),
    'space-grotesk-bold': require('./assets/fonts/SpaceGrotesk-Bold.ttf')
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Provider store={store}>
          <View style={styles.container} onLayout={onLayoutRootView}>
            <RootNavigation />
          </View>
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
