import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { logOut } from '@/store/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreene() {
  const dispatch = useDispatch();

  function handlerOut() {
    dispatch(logOut());
  }

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handlerOut}>
        <Text>
          Выйти
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
