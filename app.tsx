import React from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import MainNavigator from '@/navigation/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-get-random-values';


export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
};