/* eslint-disable @typescript-eslint/no-use-before-define */
import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StatusBar, StyleSheet } from 'react-native';

import AppProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />
    <AppProvider>
      <View style={styles.app}>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);

export default App;

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#312e38',
  },
});
