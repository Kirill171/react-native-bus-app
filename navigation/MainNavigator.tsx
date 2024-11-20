import React from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Fontisto } from '@expo/vector-icons';
import { RootState } from '@/store';

import AuthScreen from '@/screens/auth-screen';
import HomeScreen from '@/screens/home-screen';
import TicketsScreen from '@/screens/tickets-screen';
import ResultsScreen from '@/screens/results-screen';
import TicketScreen from '@/screens/ticket-screen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Поиск рейсов"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Результаты поиска"
        component={ResultsScreen}
        options={{ title: 'Рейсы' }}
      />
      <Stack.Screen
        name="Бронирование билета"
        component={TicketScreen}
        options={{ title: 'Бронирование билета' }}
      />
    </Stack.Navigator>
  );
}

function TicketsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Мои билеты"
        component={TicketsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

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
