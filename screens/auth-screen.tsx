import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import LoginForm from '../components/login-form';
import RegisterForm from '../components/register-form';

export default function AuthScreene() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{isLogin ? 'Login' : 'Register'}</Text>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <Button title={isLogin ? 'Switch to Register' : 'Switch to Login'} onPress={toggleForm} />
    </View>
  );
};
