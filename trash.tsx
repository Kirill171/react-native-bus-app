import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import 'react-native-get-random-values';
import store, { AppDispatch } from '@/store';
import MainNavigator from '@/navigation/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { loadAuthState } from '@/store/authSlice';

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadAuthState());
  }, [dispatch]);

  return <MainNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </Provider>
  );
};