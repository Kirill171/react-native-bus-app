import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Fontisto } from '@expo/vector-icons';
import { RootState } from '@/store';
import Parse from 'parse/react-native';
import { ActivityIndicator, View } from 'react-native';

import AuthScreen from '@/screens/auth-screen';
import HomeScreen from '@/screens/home-screen';
import BookedScreen from '@/screens/booked-screen';
import ResultsScreen from '@/screens/results-screen';
import BookingScreen from '@/screens/booking-screen';
import UsersScreen from '@/screens/user-screen';
import TripsScreen from '@/screens/trips-screen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface Role {
  get: (key: string) => any;
}

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
        component={BookingScreen}
        options={{ title: 'Бронирование билета' }}
      />
    </Stack.Navigator>
  );
}

function BookedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Мои билеты"
        component={BookedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Бронирование билета"
        component={BookingScreen}
        options={{ title: 'Бронирование билета', headerBackTitle: 'Назад' }}
      />
    </Stack.Navigator>
  );
}

const MainTabs = React.memo(() => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRoles = async () => {
      try {
        const currentUser = await Parse.User.currentAsync();

        if (currentUser) {
          const rolesQuery = new Parse.Query('_Role');
          rolesQuery.equalTo('users', currentUser);
          const roles = await rolesQuery.find();

          setIsSuperAdmin(roles.some(role => role.get('name') === 'Super Admin'));
          setIsAdmin(roles.some(role => role.get('name') === 'Admin'));
        }
      } catch (error) {
        console.error('Ошибка при получении ролей пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRoles();
  }, []);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Поиск"
        component={SearchStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Fontisto name="search" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Билеты"
        component={BookedStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Fontisto name="bus-ticket" size={24} color={color} />,
        }}
      />
      {(isSuperAdmin || isAdmin) && (
        <Tab.Screen
          name="Рейсы"
          component={TripsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <Fontisto name="plane" size={24} color={color} />,
          }}
        />
      )}
      {isSuperAdmin && (
        <Tab.Screen
          name="Пользователи"
          component={UsersScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <Fontisto name="person" size={24} color={color} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
});

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
