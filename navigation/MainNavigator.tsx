import React from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Fontisto } from '@expo/vector-icons';
import { RootState } from '@/store';

import AuthScreen from '@/screens/auth-screen';
import HomeScreen from '@/screens/home-screen';
import OptionsScreen from '@/screens/tickets-screen';
import ResultsScreen from '@/screens/results-screen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator для вкладки "Поиск"
function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Поиск"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Результаты поиска"
        component={ResultsScreen}
        options={{ title: 'Результаты поиска' }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator для вкладки "Билеты"
function TicketsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Билеты"
        component={OptionsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Основной Tab Navigator
const MainTabs = React.memo(() => (
  <Tab.Navigator>
    <Tab.Screen
      name="Поиск"
      component={SearchStack}
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Fontisto name="search" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Билеты"
      component={TicketsStack}
      options={{
        tabBarIcon: ({ color }) => (
          <Fontisto name="bus-ticket" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
));

// Основной навигатор приложения
export default function MainNavigator() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Авторизация"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
