import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';

import { BottomSheetProvider } from 'lib/contexts/bottom-sheet';
import { AppDrawer } from 'navigators/app-drawer';

import { store, persistor } from 'state/store';
import linking from 'lib/linking';
import { theme } from 'lib/theme';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <BottomSheetProvider>
              <NavigationContainer linking={linking}>
                <AppDrawer />
              </NavigationContainer>
            </BottomSheetProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;
