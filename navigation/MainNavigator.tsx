import React from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Fontisto } from '@expo/vector-icons';
import { RootState } from '@/store';
import AuthScreen from '@/screens/auth-screen';
import HomeScreen from '@/screens/home-screen';
import OptionsScreen from '@/screens/tickets-screen';

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
              <Tab.Screen name="Поиск" component={HomeScreen} options={{
                headerShown: false,
                tabBarIcon: ({ color }) => (
                  <Fontisto name="search" size={24} color={color} />
                ),
              }} />

              <Tab.Screen name="Билеты" component={OptionsScreen} options={{
                tabBarIcon: ({ color }) => (
                  <Fontisto name="bus-ticket" size={24} color={color} />
                ),
              }} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Авторизация" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};