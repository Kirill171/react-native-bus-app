import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoginForm from '@/components/login-form';
import RegisterForm from '@/components/register-form';
import CustomButton from '@/components/custom-button';

export default function AuthScreene() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Авторизация' : 'Регистрация'}</Text>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <CustomButton
        title={isLogin ? 'Перейти к регистрации' : 'Перейти к авторизации'}
        onPress={toggleForm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
});