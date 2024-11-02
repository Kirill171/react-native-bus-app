import React from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from '@/store';
import AuthScreen from '@/screens/auth-screen';
import HomeScreen from '@/screens/home-screen';
import OptionsScreen from '@/screens/options-screen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {() => (
            <Tab.Navigator>
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Options" component={OptionsScreen} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};
